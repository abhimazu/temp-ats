from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Job, Application, Interview
from schemas import JobCreate, JobResponse
from auth import require_role

router = APIRouter()

@router.get("/dashboard")
def get_recruiter_dashboard(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    """Get recruiter dashboard statistics"""
    my_jobs = db.query(Job).filter(Job.recruiter_id == current_user.id).count()
    
    # Applications to my jobs
    my_job_ids = [job.id for job in db.query(Job).filter(Job.recruiter_id == current_user.id).all()]
    total_applications = db.query(Application).filter(Application.job_id.in_(my_job_ids)).count()
    
    # Pending reviews
    pending_applications = db.query(Application).filter(
        Application.job_id.in_(my_job_ids),
        Application.status == "pending"
    ).count()
    
    return {
        "total_jobs": my_jobs,
        "total_applications": total_applications,
        "pending_reviews": pending_applications
    }

@router.post("/jobs", response_model=JobResponse)
def create_job(
    job: JobCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    """Create a new job posting"""
    new_job = Job(
        title=job.title,
        description=job.description,
        requirements=job.requirements,
        recruiter_id=current_user.id
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/jobs", response_model=List[JobResponse])
def get_my_jobs(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    """Get all jobs posted by current recruiter"""
    jobs = db.query(Job).filter(Job.recruiter_id == current_user.id).all()
    return jobs

@router.get("/jobs/{job_id}/applications")
def get_job_applications(
    job_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    """Get all applications for a specific job"""
    # Verify job belongs to recruiter
    job = db.query(Job).filter(Job.id == job_id, Job.recruiter_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    applications = db.query(Application).filter(Application.job_id == job_id).all()
    
    result = []
    for app in applications:
        candidate = db.query(User).filter(User.id == app.candidate_id).first()
        interview = db.query(Interview).filter(Interview.application_id == app.id).first()
        
        result.append({
            "application_id": app.id,
            "candidate_name": candidate.full_name,
            "candidate_email": candidate.email,
            "status": app.status,
            "applied_at": app.applied_at,
            "interview_score": interview.score if interview else None,
            "interview_status": interview.status if interview else None
        })
    
    return result
