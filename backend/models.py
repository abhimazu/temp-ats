from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    RECRUITER = "recruiter"
    CANDIDATE = "candidate"

class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    INTERVIEWING = "interviewing"
    COMPLETED = "completed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    applications = relationship("Application", back_populates="candidate", foreign_keys="Application.candidate_id")
    jobs_posted = relationship("Job", back_populates="recruiter")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    recruiter_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    recruiter = relationship("User", back_populates="jobs_posted")
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    resume_path = Column(String)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    applied_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    candidate = relationship("User", back_populates="applications", foreign_keys=[candidate_id])
    job = relationship("Job", back_populates="applications")
    interview = relationship("Interview", back_populates="application", uselist=False)

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    questions = Column(JSON)  # List of questions
    answers = Column(JSON)  # List of answers
    score = Column(Float)
    ai_analysis = Column(JSON)  # AI evaluation results
    status = Column(String, default="pending")
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    
    # Relationships
    application = relationship("Application", back_populates="interview")
