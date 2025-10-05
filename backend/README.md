# ATS AI Interviewer - Backend

FastAPI backend for the ATS AI Interviewer system.

## Setup

1. Install Python 3.11+

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Seed the database with dummy data:
```bash
python seed_data.py
```

4. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## Dummy Login Credentials

### Admin
- Email: `admin@ats.com`
- Password: `admin123`

### Recruiters
- Email: `recruiter1@company.com` / Password: `recruiter123`
- Email: `recruiter2@company.com` / Password: `recruiter123`

### Candidates
- Email: `john.doe@email.com` / Password: `candidate123`
- Email: `jane.smith@email.com` / Password: `candidate123`
- Email: `mike.wilson@email.com` / Password: `candidate123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login for all user types
- `GET /api/auth/me` - Get current user info

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/candidates` - List all candidates
- `GET /api/admin/recruiters` - List all recruiters
- `GET /api/admin/interviews` - List all interviews with AI analysis
- `GET /api/admin/applications` - List all applications

### Recruiter Routes
- `GET /api/recruiter/dashboard` - Recruiter dashboard stats
- `POST /api/recruiter/jobs` - Create new job posting
- `GET /api/recruiter/jobs` - Get my job postings
- `GET /api/recruiter/jobs/{job_id}/applications` - Get applications for a job

### Candidate Routes
- `GET /api/candidate/dashboard` - Candidate dashboard stats
- `GET /api/candidate/jobs` - List available jobs
- `POST /api/candidate/apply` - Apply for a job
- `POST /api/candidate/upload-resume/{application_id}` - Upload resume
- `GET /api/candidate/my-applications` - Get my applications
- `GET /api/candidate/interview/{interview_id}` - Get interview questions
- `POST /api/candidate/interview/{interview_id}/answer` - Submit answer
