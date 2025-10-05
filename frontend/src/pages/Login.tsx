import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const dummyCredentials = [
    { role: 'Admin', email: 'admin@ats.com', password: 'admin123' },
    { role: 'Recruiter 1', email: 'recruiter1@company.com', password: 'recruiter123' },
    { role: 'Recruiter 2', email: 'recruiter2@company.com', password: 'recruiter123' },
    { role: 'Candidate 1', email: 'john.doe@email.com', password: 'candidate123' },
    { role: 'Candidate 2', email: 'jane.smith@email.com', password: 'candidate123' },
    { role: 'Candidate 3', email: 'mike.wilson@email.com', password: 'candidate123' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          ATS AI Interviewer
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
          Intelligent Applicant Tracking System
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 3 }}
          >
            Login
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Demo Accounts - Quick Login
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click on any account to auto-fill credentials
          </Typography>
          
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="All Accounts" />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {dummyCredentials.map((cred, index) => (
              <Button
                key={index}
                variant="outlined"
                fullWidth
                sx={{ mb: 1, justifyContent: 'flex-start' }}
                onClick={() => quickLogin(cred.email, cred.password)}
              >
                <Box sx={{ textAlign: 'left', width: '100%' }}>
                  <Typography variant="body1" fontWeight="bold">
                    {cred.role}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {cred.email}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
