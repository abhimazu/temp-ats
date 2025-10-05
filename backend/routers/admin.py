from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models import User, Job, Application, Interview, UserRole
from schemas import UserResponse, ApplicationResponse
from auth import require_role

router = APIRouter()

@router.get("/dashboard")
def get_admin_dashboard(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    total_candidates = db.query(User).filter(User.role == UserRole.CANDIDATE).count()
    total_recruiters = db.query(User).filter(User.role == UserRole.RECRUITER).count()
    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()
    total_interviews = db.query(Interview).count()
    
    # Interviews completed
    completed_interviews = db.query(Interview).filter(Interview.status == "completed").count()
    
    # Average score
    avg_score = db.query(func.avg(Interview.score)).filter(Interview.score.isnot(None)).scalar() or 0
    
    return {
        "total_candidates": total_candidates,
        "total_recruiters": total_recruiters,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "total_interviews": total_interviews,
        "completed_interviews": completed_interviews,
        "average_score": round(float(avg_score), 2)
    }

@router.get("/candidates", response_model=List[UserResponse])
def get_all_candidates(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Get all candidates"""
    candidates = db.query(User).filter(User.role == UserRole.CANDIDATE).all()
    return candidates

@router.get("/recruiters", response_model=List[UserResponse])
def get_all_recruiters(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Get all recruiters"""
    recruiters = db.query(User).filter(User.role == UserRole.RECRUITER).all()
    return recruiters

@router.get("/interviews")
def get_all_interviews(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Get all interviews with AI analysis"""
    interviews = db.query(Interview).all()
    
    result = []
    for interview in interviews:
        application = db.query(Application).filter(Application.id == interview.application_id).first()
        candidate = db.query(User).filter(User.id == application.candidate_id).first()
        job = db.query(Job).filter(Job.id == application.job_id).first()
        
        result.append({
            "interview_id": interview.id,
            "candidate_name": candidate.full_name,
            "candidate_email": candidate.email,
            "job_title": job.title,
            "status": interview.status,
            "score": interview.score,
            "questions": interview.questions,
            "answers": interview.answers,
            "ai_analysis": interview.ai_analysis,
            "completed_at": interview.completed_at
        })
    
    return result

@router.get("/applications")
def get_all_applications(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Get all applications"""
    applications = db.query(Application).all()
    
    result = []
    for app in applications:
        candidate = db.query(User).filter(User.id == app.candidate_id).first()
        job = db.query(Job).filter(Job.id == app.job_id).first()
        
        result.append({
            "application_id": app.id,
            "candidate_name": candidate.full_name,
            "candidate_email": candidate.email,
            "job_title": job.title,
            "status": app.status,
            "applied_at": app.applied_at
        })
    
    return result
