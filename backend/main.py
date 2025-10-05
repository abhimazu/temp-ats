from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, admin, recruiter, candidate

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ATS AI Interviewer API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["Recruiter"])
app.include_router(candidate.router, prefix="/api/candidate", tags=["Candidate"])

@app.get("/")
def root():
    return {
        "message": "ATS AI Interviewer API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
