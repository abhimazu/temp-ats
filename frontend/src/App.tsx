import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Candidates from './pages/admin/Candidates';
import Interviews from './pages/admin/Interviews';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import MyJobs from './pages/recruiter/MyJobs';

// Candidate pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import BrowseJobs from './pages/candidate/BrowseJobs';
import MyApplications from './pages/candidate/MyApplications';
import Interview from './pages/candidate/Interview';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'recruiter') {
    return <RecruiterDashboard />;
  } else if (user?.role === 'candidate') {
    return <CandidateDashboard />;
  }

  return <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardRouter />} />
              
              {/* Admin Routes */}
              <Route
                path="candidates"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Candidates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="recruiters"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Candidates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="interviews"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Interviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="applications"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Interviews />
                  </ProtectedRoute>
                }
              />
              
              {/* Recruiter Routes */}
              <Route
                path="jobs"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <MyJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="post-job"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              
              {/* Candidate Routes */}
              <Route
                path="browse-jobs"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <BrowseJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-applications"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="interview/:interviewId"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <Interview />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;