# ATS AI Interviewer - Full Stack Application

A complete Applicant Tracking System with AI-powered interviews featuring role-based dashboards for Admins, Recruiters, and Candidates.

## 🎯 Features

### Admin Dashboard
- System-wide analytics and statistics
- View all candidates and recruiters
- Monitor AI interview analysis with Q&A
- Track all applications across the platform

### Recruiter Dashboard
- Post and manage job listings
- View applications for each job
- Track candidate interview scores
- Manage hiring pipeline

### Candidate Dashboard
- Browse available job openings
- Apply for jobs
- Upload resume
- Complete AI-powered interviews
- Track application status

## 🏗️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (dev), PostgreSQL (production-ready)
- **Authentication**: JWT with OAuth2
- **ORM**: SQLAlchemy

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Seed database with dummy data
python seed_data.py

# Start the backend server
python main.py
```

Backend runs at: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 🔐 Demo Login Credentials

### Admin
- **Email**: `admin@ats.com`
- **Password**: `admin123`
- **Access**: Full system overview, view all data, AI analysis

### Recruiters
1. **Sarah Johnson**
   - **Email**: `recruiter1@company.com`
   - **Password**: `recruiter123`
   
2. **Michael Chen**
   - **Email**: `recruiter2@company.com`
   - **Password**: `recruiter123`

**Access**: Post jobs, view applications, manage candidates

### Candidates
1. **John Doe** (Has completed interview)
   - **Email**: `john.doe@email.com`
   - **Password**: `candidate123`
   
2. **Jane Smith** (Interview in progress)
   - **Email**: `jane.smith@email.com`
   - **Password**: `candidate123`
   
3. **Mike Wilson** (Has completed interview)
   - **Email**: `mike.wilson@email.com`
   - **Password**: `candidate123`

**Access**: Browse jobs, apply, upload resume, complete interviews

## 📱 User Flows

### For Candidates
1. Login → Browse Jobs
2. Apply for a job
3. Upload your resume
4. Complete AI interview (5 questions)
5. Get instant AI evaluation and feedback

### For Recruiters
1. Login → Post a new job
2. View applications for your jobs
3. Review candidate interview scores and AI analysis
4. Make hiring decisions

### For Admins
1. Login → View system dashboard
2. Monitor all candidates and recruiters
3. Review AI interview analysis with Q&A
4. Track platform-wide metrics

## 📂 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application entry
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication logic
│   ├── seed_data.py         # Database seeder
│   ├── routers/
│   │   ├── auth.py          # Auth endpoints
│   │   ├── admin.py         # Admin endpoints
│   │   ├── recruiter.py     # Recruiter endpoints
│   │   └── candidate.py     # Candidate endpoints
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API configuration
│   │   ├── components/      # Shared components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── recruiter/   # Recruiter pages
│   │   │   └── candidate/   # Candidate pages
│   │   ├── App.tsx          # Main app with routing
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── DESIGN_DOCUMENT.md       # System design & logic
├── TECHNICAL_ARCHITECTURE.md # Tech stack & deployment
└── README.md                # This file
```

## 🎨 Features by Role

### Admin View
- **Navigation**: Dashboard, Candidates, Recruiters, AI Interviews, All Applications
- **Dashboard Stats**: Total candidates, recruiters, jobs, applications, interviews
- **AI Analysis**: View detailed Q&A and AI evaluations for all interviews
- **Color Theme**: Red accent

### Recruiter View
- **Navigation**: Dashboard, My Jobs, Post New Job
- **Dashboard Stats**: Total jobs posted, applications received, pending reviews
- **Job Management**: Create job postings, view applications, see candidate scores
- **Color Theme**: Blue accent

### Candidate View
- **Navigation**: Dashboard, Browse Jobs, My Applications
- **Dashboard Stats**: Total applications, pending, interviewing, completed
- **Application Flow**: Browse → Apply → Upload Resume → Interview → Get Evaluated
- **Interview Interface**: Answer 5 AI-generated questions one by one
- **Color Theme**: Green accent

## 🚧 Work in Progress Features

Each dashboard shows planned features including:
- Advanced analytics and reporting
- Real-time notifications
- Video interview support
- Automated candidate ranking
- Interview scheduling
- Email communication templates
- And more...

## 🗄️ Database Schema

### Main Tables
- **users**: All users (admins, recruiters, candidates)
- **jobs**: Job postings
- **applications**: Candidate applications
- **interviews**: Interview sessions with Q&A
- **Relationships**: Fully relational with foreign keys

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Login for all user types
- `GET /api/auth/me` - Get current user info

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/candidates` - All candidates
- `GET /api/admin/recruiters` - All recruiters
- `GET /api/admin/interviews` - All interviews with AI analysis

### Recruiter
- `GET /api/recruiter/dashboard` - Dashboard statistics
- `POST /api/recruiter/jobs` - Create job posting
- `GET /api/recruiter/jobs` - Get my jobs
- `GET /api/recruiter/jobs/{id}/applications` - Applications for a job

### Candidate
- `GET /api/candidate/dashboard` - Dashboard statistics
- `GET /api/candidate/jobs` - Browse jobs
- `POST /api/candidate/apply` - Apply for job
- `POST /api/candidate/upload-resume/{id}` - Upload resume
- `GET /api/candidate/my-applications` - My applications
- `GET /api/candidate/interview/{id}` - Get interview questions
- `POST /api/candidate/interview/{id}/answer` - Submit answer

## 📝 Notes

- Currently uses SQLite for simplicity
- Mock AI scoring is implemented (75-85% scores)
- Resume upload creates automatic interview questions
- Interview is sequential (one question at a time)
- All passwords are hashed using bcrypt
- JWT tokens expire after 24 hours

## 🌟 Next Steps

To extend this application:
1. Integrate real LLM (OpenAI/Anthropic) for question generation
2. Implement actual resume parsing with NLP
3. Add real-time scoring with AI evaluation
4. Implement email notifications
5. Add video interview support
6. Deploy to cloud (AWS/GCP/Azure)
7. Add advanced analytics dashboards

## 📄 License

This is a demonstration project for educational purposes.

---

**Built with ❤️ using FastAPI, React, and Material-UI**
