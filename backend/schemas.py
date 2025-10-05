from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class JobCreate(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    requirements: Optional[str]
    recruiter_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    resume_path: Optional[str]
    status: str
    applied_at: datetime
    
    class Config:
        from_attributes = True

class InterviewQuestion(BaseModel):
    question_id: int
    question_text: str
    answer: Optional[str] = None

class InterviewResponse(BaseModel):
    id: int
    application_id: int
    questions: Optional[List[Dict[str, Any]]]
    answers: Optional[List[Dict[str, Any]]]
    score: Optional[float]
    ai_analysis: Optional[Dict[str, Any]]
    status: str
    
    class Config:
        from_attributes = True

class AnswerSubmit(BaseModel):
    question_id: int
    answer: str
