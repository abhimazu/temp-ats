"""
Seed database with dummy data for testing

Dummy Login Credentials:
------------------------
Admin:
  Email: admin@ats.com
  Password: admin123

Recruiters:
  Email: recruiter1@company.com
  Password: recruiter123
  
  Email: recruiter2@company.com
  Password: recruiter123

Candidates:
  Email: john.doe@email.com
  Password: candidate123
  
  Email: jane.smith@email.com
  Password: candidate123
  
  Email: mike.wilson@email.com
  Password: candidate123
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, Job, Application, Interview, UserRole, ApplicationStatus
from auth import get_password_hash
from datetime import datetime, timedelta
import random

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Interview).delete()
        db.query(Application).delete()
        db.query(Job).delete()
        db.query(User).delete()
        db.commit()
        
        # Create Admin
        admin = User(
            email="admin@ats.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            role=UserRole.ADMIN
        )
        db.add(admin)
        
        # Create Recruiters
        recruiters = [
            User(
                email="recruiter1@company.com",
                hashed_password=get_password_hash("recruiter123"),
                full_name="Sarah Johnson",
                role=UserRole.RECRUITER
            ),
            User(
                email="recruiter2@company.com",
                hashed_password=get_password_hash("recruiter123"),
                full_name="Michael Chen",
                role=UserRole.RECRUITER
            )
        ]
        for recruiter in recruiters:
            db.add(recruiter)
        
        # Create Candidates
        candidates = [
            User(
                email="john.doe@email.com",
                hashed_password=get_password_hash("candidate123"),
                full_name="John Doe",
                role=UserRole.CANDIDATE
            ),
            User(
                email="jane.smith@email.com",
                hashed_password=get_password_hash("candidate123"),
                full_name="Jane Smith",
                role=UserRole.CANDIDATE
            ),
            User(
                email="mike.wilson@email.com",
                hashed_password=get_password_hash("candidate123"),
                full_name="Mike Wilson",
                role=UserRole.CANDIDATE
            ),
            User(
                email="emily.brown@email.com",
                hashed_password=get_password_hash("candidate123"),
                full_name="Emily Brown",
                role=UserRole.CANDIDATE
            ),
            User(
                email="david.lee@email.com",
                hashed_password=get_password_hash("candidate123"),
                full_name="David Lee",
                role=UserRole.CANDIDATE
            )
        ]
        for candidate in candidates:
            db.add(candidate)
        
        db.commit()
        db.refresh(recruiters[0])
        db.refresh(recruiters[1])
        
        # Create Jobs
        jobs = [
            Job(
                title="Senior Python Developer",
                description="We are looking for an experienced Python developer to join our backend team. You'll work on building scalable APIs and microservices.",
                requirements="5+ years Python experience, Django/FastAPI, PostgreSQL, AWS",
                recruiter_id=recruiters[0].id,
                created_at=datetime.utcnow() - timedelta(days=10)
            ),
            Job(
                title="Full Stack Engineer",
                description="Join our team to build modern web applications. Work with React, Node.js, and cloud technologies.",
                requirements="3+ years experience, React, Node.js, TypeScript, MongoDB",
                recruiter_id=recruiters[0].id,
                created_at=datetime.utcnow() - timedelta(days=7)
            ),
            Job(
                title="DevOps Engineer",
                description="Looking for a DevOps engineer to manage our cloud infrastructure and CI/CD pipelines.",
                requirements="Kubernetes, Docker, AWS/GCP, Terraform, CI/CD",
                recruiter_id=recruiters[1].id,
                created_at=datetime.utcnow() - timedelta(days=5)
            ),
            Job(
                title="Machine Learning Engineer",
                description="Work on cutting-edge ML projects. Build and deploy ML models at scale.",
                requirements="Python, TensorFlow/PyTorch, MLOps, 3+ years ML experience",
                recruiter_id=recruiters[1].id,
                created_at=datetime.utcnow() - timedelta(days=3)
            ),
            Job(
                title="Frontend Developer",
                description="Create beautiful, responsive user interfaces using modern frontend technologies.",
                requirements="React, TypeScript, CSS, 2+ years experience",
                recruiter_id=recruiters[0].id,
                created_at=datetime.utcnow() - timedelta(days=2)
            )
        ]
        for job in jobs:
            db.add(job)
        
        db.commit()
        
        # Refresh candidates and jobs
        for candidate in candidates:
            db.refresh(candidate)
        for job in jobs:
            db.refresh(job)
        
        # Create Applications and Interviews
        statuses = [ApplicationStatus.PENDING, ApplicationStatus.INTERVIEWING, ApplicationStatus.COMPLETED]
        
        # John Doe - Multiple applications
        app1 = Application(
            candidate_id=candidates[0].id,
            job_id=jobs[0].id,
            resume_path="uploads/resumes/john_doe_resume.pdf",
            status=ApplicationStatus.COMPLETED,
            applied_at=datetime.utcnow() - timedelta(days=8)
        )
        db.add(app1)
        db.commit()
        db.refresh(app1)
        
        interview1 = Interview(
            application_id=app1.id,
            questions=[
                {"id": 1, "text": "Tell me about your experience with Python programming?", "type": "technical"},
                {"id": 2, "text": "Describe a challenging project you worked on.", "type": "behavioral"},
                {"id": 3, "text": "What interests you about this position?", "type": "general"},
                {"id": 4, "text": "How do you handle code reviews?", "type": "technical"},
                {"id": 5, "text": "Describe your experience with microservices.", "type": "technical"}
            ],
            answers=[
                {"question_id": 1, "answer": "I have 6 years of Python experience, working extensively with Django and FastAPI...", "answered_at": (datetime.utcnow() - timedelta(days=7)).isoformat()},
                {"question_id": 2, "answer": "I led a project to migrate our monolith to microservices architecture...", "answered_at": (datetime.utcnow() - timedelta(days=7)).isoformat()},
                {"question_id": 3, "answer": "I'm excited about the scale and technical challenges this role offers...", "answered_at": (datetime.utcnow() - timedelta(days=7)).isoformat()},
                {"question_id": 4, "answer": "I believe code reviews are crucial for maintaining code quality...", "answered_at": (datetime.utcnow() - timedelta(days=7)).isoformat()},
                {"question_id": 5, "answer": "I've built and maintained multiple microservices using Docker and Kubernetes...", "answered_at": (datetime.utcnow() - timedelta(days=7)).isoformat()}
            ],
            score=85.5,
            ai_analysis={
                "overall_assessment": "Excellent candidate with strong technical background",
                "strengths": ["Deep Python expertise", "Microservices experience", "Clear communication", "Problem-solving ability"],
                "areas_for_improvement": ["Could elaborate more on cloud architecture patterns"],
                "technical_score": 88,
                "communication_score": 85,
                "problem_solving_score": 82,
                "recommendation": "Strong hire - proceed to final round"
            },
            status="completed",
            started_at=datetime.utcnow() - timedelta(days=7),
            completed_at=datetime.utcnow() - timedelta(days=7, hours=1)
        )
        db.add(interview1)
        
        # Jane Smith application
        app2 = Application(
            candidate_id=candidates[1].id,
            job_id=jobs[1].id,
            resume_path="uploads/resumes/jane_smith_resume.pdf",
            status=ApplicationStatus.INTERVIEWING,
            applied_at=datetime.utcnow() - timedelta(days=5)
        )
        db.add(app2)
        db.commit()
        db.refresh(app2)
        
        interview2 = Interview(
            application_id=app2.id,
            questions=[
                {"id": 1, "text": "What's your experience with React?", "type": "technical"},
                {"id": 2, "text": "How do you ensure code quality?", "type": "technical"},
                {"id": 3, "text": "Tell me about a time you worked in a team.", "type": "behavioral"},
                {"id": 4, "text": "What's your approach to debugging?", "type": "technical"},
                {"id": 5, "text": "Why are you interested in this role?", "type": "general"}
            ],
            answers=[
                {"question_id": 1, "answer": "I've been working with React for 4 years, including hooks and state management...", "answered_at": (datetime.utcnow() - timedelta(days=4)).isoformat()},
                {"question_id": 2, "answer": "I write unit tests, use ESLint, and follow code review best practices...", "answered_at": (datetime.utcnow() - timedelta(days=4)).isoformat()}
            ],
            score=None,
            ai_analysis=None,
            status="in_progress",
            started_at=datetime.utcnow() - timedelta(days=4)
        )
        db.add(interview2)
        
        # Mike Wilson application
        app3 = Application(
            candidate_id=candidates[2].id,
            job_id=jobs[2].id,
            resume_path="uploads/resumes/mike_wilson_resume.pdf",
            status=ApplicationStatus.COMPLETED,
            applied_at=datetime.utcnow() - timedelta(days=4)
        )
        db.add(app3)
        db.commit()
        db.refresh(app3)
        
        interview3 = Interview(
            application_id=app3.id,
            questions=[
                {"id": 1, "text": "Describe your Kubernetes experience.", "type": "technical"},
                {"id": 2, "text": "How do you handle production incidents?", "type": "behavioral"},
                {"id": 3, "text": "What CI/CD tools have you used?", "type": "technical"},
                {"id": 4, "text": "Explain your infrastructure as code approach.", "type": "technical"},
                {"id": 5, "text": "How do you ensure system reliability?", "type": "technical"}
            ],
            answers=[
                {"question_id": 1, "answer": "I've managed K8s clusters in production for 3 years...", "answered_at": (datetime.utcnow() - timedelta(days=3)).isoformat()},
                {"question_id": 2, "answer": "I follow incident response procedures, maintain runbooks...", "answered_at": (datetime.utcnow() - timedelta(days=3)).isoformat()},
                {"question_id": 3, "answer": "Jenkins, GitLab CI, and GitHub Actions extensively...", "answered_at": (datetime.utcnow() - timedelta(days=3)).isoformat()},
                {"question_id": 4, "answer": "I use Terraform for all infrastructure provisioning...", "answered_at": (datetime.utcnow() - timedelta(days=3)).isoformat()},
                {"question_id": 5, "answer": "Monitoring, alerting, redundancy, and automated failover...", "answered_at": (datetime.utcnow() - timedelta(days=3)).isoformat()}
            ],
            score=78.0,
            ai_analysis={
                "overall_assessment": "Solid DevOps engineer with good practical experience",
                "strengths": ["Kubernetes expertise", "CI/CD knowledge", "Incident management"],
                "areas_for_improvement": ["Could demonstrate more cloud architecture knowledge", "Security best practices"],
                "technical_score": 80,
                "communication_score": 75,
                "problem_solving_score": 78,
                "recommendation": "Good candidate - consider for offer"
            },
            status="completed",
            started_at=datetime.utcnow() - timedelta(days=3),
            completed_at=datetime.utcnow() - timedelta(days=3, hours=1)
        )
        db.add(interview3)
        
        # Emily Brown - Pending application
        app4 = Application(
            candidate_id=candidates[3].id,
            job_id=jobs[3].id,
            status=ApplicationStatus.PENDING,
            applied_at=datetime.utcnow() - timedelta(days=2)
        )
        db.add(app4)
        
        # David Lee - Pending application
        app5 = Application(
            candidate_id=candidates[4].id,
            job_id=jobs[0].id,
            status=ApplicationStatus.PENDING,
            applied_at=datetime.utcnow() - timedelta(days=1)
        )
        db.add(app5)
        
        db.commit()
        
        print("✅ Database seeded successfully!")
        print("\n" + "="*60)
        print("DUMMY LOGIN CREDENTIALS")
        print("="*60)
        print("\n🔐 ADMIN:")
        print("   Email: admin@ats.com")
        print("   Password: admin123")
        print("\n👔 RECRUITERS:")
        print("   Email: recruiter1@company.com")
        print("   Password: recruiter123")
        print("   ---")
        print("   Email: recruiter2@company.com")
        print("   Password: recruiter123")
        print("\n👤 CANDIDATES:")
        print("   Email: john.doe@email.com")
        print("   Password: candidate123")
        print("   ---")
        print("   Email: jane.smith@email.com")
        print("   Password: candidate123")
        print("   ---")
        print("   Email: mike.wilson@email.com")
        print("   Password: candidate123")
        print("="*60)
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
