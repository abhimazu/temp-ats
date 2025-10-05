# 🚀 Quick Start Guide - ATS AI Interviewer

## Prerequisites
- Python 3.11+ installed
- Node.js 20+ installed
- Terminal/Command Prompt

## Step-by-Step Setup

### 1️⃣ Start the Backend (FastAPI)

Open a terminal and run:

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Seed the database with dummy data
python seed_data.py

# Start the backend server
python main.py
```

✅ **Backend Running**: `http://localhost:8000`  
📚 **API Docs**: `http://localhost:8000/docs`

### 2️⃣ Start the Frontend (React)

Open a **NEW** terminal window and run:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

✅ **Frontend Running**: `http://localhost:5173`

### 3️⃣ Access the Application

Open your browser and go to: **`http://localhost:5173`**

## 🔐 Test Login Credentials

The login page has **Quick Login** buttons - just click on any role to auto-fill credentials!

### 🔴 Admin (Full System Access)
- **Email**: `admin@ats.com`
- **Password**: `admin123`

**What you'll see:**
- System-wide dashboard with statistics
- All candidates list
- All recruiters list
- AI Interview Analysis with Q&A
- All applications across the platform

---

### 🔵 Recruiter (Job Management)
- **Email**: `recruiter1@company.com`
- **Password**: `recruiter123`

**What you'll see:**
- Recruiter dashboard
- Post new job listings
- View your job postings
- See applications and candidate scores
- Mock data: 2-3 jobs already posted

---

### 🟢 Candidate (Job Application & Interview)

**Option 1: John Doe (Completed Interview)**
- **Email**: `john.doe@email.com`
- **Password**: `candidate123`
- Status: Has a completed interview with AI score of 85.5%

**Option 2: Jane Smith (In Progress)**
- **Email**: `jane.smith@email.com`  
- **Password**: `candidate123`
- Status: Interview in progress (2/5 questions answered)

**Option 3: Mike Wilson (Completed)**
- **Email**: `mike.wilson@email.com`
- **Password**: `candidate123`
- Status: Completed interview with score of 78.0%

**What you'll see:**
- Candidate dashboard
- Browse available jobs (5 jobs in system)
- Apply for jobs
- Upload resume
- Complete AI interview (5 questions)
- View application status

---

## 📋 Try These User Flows

### 🎯 Flow 1: Admin Viewing AI Analysis
1. Login as **Admin**
2. Click "AI Interviews" in sidebar
3. Expand any completed interview
4. See AI analysis with strengths, weaknesses, and recommendation
5. View all Q&A pairs

### 🎯 Flow 2: Recruiter Posting a Job
1. Login as **Recruiter**
2. Click "Post New Job"
3. Fill in job details
4. Submit
5. View your jobs and check for applications

### 🎯 Flow 3: Candidate Applying & Interviewing
1. Login as a **new Candidate** (or use existing)
2. Click "Browse Jobs"
3. Click "Apply Now" on any job
4. Go to "My Applications"
5. Upload a resume (any PDF/DOC file)
6. Click "Start Interview"
7. Answer the 5 AI-generated questions one by one
8. Submit final answer
9. See completion message!

---

## 🎨 Key Features to Explore

### Navigation Panels (Different for Each Role)

**Admin Navigation:**
- Dashboard
- Candidates
- Recruiters
- AI Interviews
- All Applications

**Recruiter Navigation:**
- Dashboard
- My Jobs
- Post New Job

**Candidate Navigation:**
- Dashboard
- Browse Jobs
- My Applications

### Color-Coded Roles
- 🔴 Admin: Red accent
- 🔵 Recruiter: Blue accent
- 🟢 Candidate: Green accent

### Mock Data Included
- ✅ 5 Job postings (by 2 recruiters)
- ✅ 5 Candidates registered
- ✅ 5 Applications submitted
- ✅ 3 Interviews completed with AI scores
- ✅ 1 Interview in progress

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Make sure you're in the backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt

# Try running again
python main.py
```

### Frontend won't start
```bash
# Make sure you're in the frontend directory
cd frontend

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Try running again
npm run dev
```

### Database issues
```bash
# Re-seed the database
cd backend
python seed_data.py
```

### Port already in use
- Backend (8000): Stop any other Python servers
- Frontend (5173): Stop any other Vite/React servers

---

## 📦 What's Included

### Backend Features
✅ JWT Authentication  
✅ Role-based access control  
✅ RESTful API with FastAPI  
✅ SQLAlchemy ORM  
✅ Mock AI scoring  
✅ Resume upload handling  
✅ Interview Q&A system  

### Frontend Features
✅ Material-UI components  
✅ Role-based dashboards  
✅ Protected routes  
✅ Real-time form handling  
✅ File upload support  
✅ Responsive design  

---

## 🚧 Work in Progress Features

Each dashboard shows "Work in Progress" sections with planned features:
- Real LLM integration (GPT-4/Claude)
- Real resume parsing with NLP
- Video interview support
- Advanced analytics
- Email notifications
- And much more!

---

## 📚 Additional Resources

- **Full Documentation**: See `README.md`
- **Design Document**: See `DESIGN_DOCUMENT.md`
- **Technical Architecture**: See `TECHNICAL_ARCHITECTURE.md`
- **API Documentation**: `http://localhost:8000/docs` (when backend is running)

---

## 🎉 You're All Set!

The application is now running with:
- ✅ Backend API at `http://localhost:8000`
- ✅ Frontend UI at `http://localhost:5173`
- ✅ 3 role-based dashboards
- ✅ Complete authentication system
- ✅ Mock data for testing

**Start exploring by logging in with any of the demo accounts!** 🚀
