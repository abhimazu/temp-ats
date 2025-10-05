from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import User, Job, Application, Interview, ApplicationStatus
from schemas import JobResponse, ApplicationCreate, ApplicationResponse, AnswerSubmit
from auth import require_role
import os
import shutil

router = APIRouter()

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/dashboard")
def get_candidate_dashboard(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    """Get candidate dashboard statistics"""
    total_applications = db.query(Application).filter(Application.candidate_id == current_user.id).count()
    
    pending = db.query(Application).filter(
        Application.candidate_id == current_user.id,
        Application.status == ApplicationStatus.PENDING
    ).count()
    
    interviewing = db.query(Application).filter(
        Application.candidate_id == current_user.id,
        Application.status == ApplicationStatus.INTERVIEWING
    ).count()
    
    completed = db.query(Application).filter(
        Application.candidate_id == current_user.id,
        Application.status == ApplicationStatus.COMPLETED
    ).count()
    
    return {
        "total_applications": total_applications,
        "pending": pending,
        "interviewing": interviewing,
        "completed": completed
    }

@router.get("/jobs", response_model=List[JobResponse])
def get_available_jobs(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    """Get all available job postings"""
    jobs = db.query(Job).filter(Job.status == "active").all()
    return jobs

@router.post("/apply")
def apply_for_job(
    application: ApplicationCreate,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    """Apply for a job"""
    # Check if already applied
    existing = db.query(Application).filter(
        Application.candidate_id == current_user.id,
        Application.job_id == application.job_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already applied for this job")
    
    new_application = Application(
        candidate_id=current_user.id,
        job_id=application.job_id,
        status=ApplicationStatus.PENDING
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    return {"message": "Application submitted successfully", "application_id": new_application.id}

@router.post("/upload-resume/{application_id}")
async def upload_resume(
    application_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    """Upload resume for an application"""
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.candidate_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"resume_{current_user.id}_{application_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update application
    application.resume_path = file_path
    application.status = ApplicationStatus.INTERVIEWING
    db.commit()
    
    # Create interview with sample questions
    interview = Interview(
        application_id=application.id,
        questions=[
            {"id": 1, "text": "Tell me about your experience with Python programming?", "type": "technical"},
            {"id": 2, "text": "Describe a challenging project you worked on and how you overcame obstacles.", "type": "behavioral"},
            {"id": 3, "text": "What interests you about this position?", "type": "general"},
            {"id": 4, "text": "How do you stay updated with new technologies?", "type": "general"},
            {"id": 5, "text": "Describe your experience working in a team environment.", "type": "behavioral"}
        ],
        answers=[],
        status="in_progress",
        started_at=datetime.utcnow()
    )
    db.add(interview)
    db.commit()
    
    return {"message": "Resume uploaded successfully", "interview_id": interview.id}

@router.get("/my-applications")
def get_my_applications(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    """Get all applications by current candidate"""
    applications = db.query(Application).filter(Application.candidate_id == current_user.id).all()
    
    result = []
    for app in applications:
        job = db.query(Job).filter(Job.id == app.job_id).first()
        interview = db.query(Interview).filter(Interview.application_id == app.id).first()
        
        result.append({
            "application_id": app.id,
            "job_title": job.title,
            "job_description": job.description,
            "status": app.status,
            "applied_at": app.applied_at,
            "has_interview": interview is not None,
            "interview_id": interview.id if interview else None,
            "interview_status": interview.status if interview else None
        })
    
    return result

@router.get("/interview/{interview_id}")
def get_interview(
    interview_id: int,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    """Get interview questions"""
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Verify interview belongs to candidate
    application = db.query(Application).filter(
        Application.id == interview.application_id,
        Application.candidate_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return {
        "interview_id": interview.id,
        "questions": interview.questions,
        "answers": interview.answers,
        "status": interview.status,
        "current_question": len(interview.answers or [])
    }

@router.post("/interview/{interview_id}/answer")
def submit_answer(
    interview_id: int,
    answer: AnswerSubmit,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    """Submit answer to interview question"""
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Verify ownership
    application = db.query(Application).filter(
        Application.id == interview.application_id,
        Application.candidate_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Add answer
    answers = interview.answers or []
    answers.append({
        "question_id": answer.question_id,
        "answer": answer.answer,
        "answered_at": datetime.utcnow().isoformat()
    })
    interview.answers = answers
    
    # Check if all questions answered
    if len(answers) >= len(interview.questions):
        interview.status = "completed"
        interview.completed_at = datetime.utcnow()
        application.status = ApplicationStatus.COMPLETED
        
        # Mock AI scoring
        interview.score = 75.5
        interview.ai_analysis = {
            "overall_assessment": "Strong candidate with good technical knowledge",
            "strengths": ["Clear communication", "Relevant experience", "Problem-solving skills"],
            "areas_for_improvement": ["Could provide more specific examples", "Technical depth in certain areas"],
            "recommendation": "Proceed to next round"
        }
    
    db.commit()
    
    return {
        "message": "Answer submitted successfully",
        "completed": interview.status == "completed",
        "next_question": len(answers) if interview.status != "completed" else None
    }
