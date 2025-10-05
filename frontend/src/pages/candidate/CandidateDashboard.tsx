import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from '@mui/material';
import { Assignment, HourglassEmpty, CheckCircle, Search } from '@mui/icons-material';
import api from '../../api/axios';

const CandidateDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/candidate/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Applications',
      value: stats?.total_applications || 0,
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: <HourglassEmpty sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Interviewing',
      value: stats?.interviewing || 0,
      icon: <HourglassEmpty sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Candidate Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your applications and complete interviews
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={() => navigate('/dashboard/browse-jobs')}
        >
          Browse Jobs
        </Button>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/browse-jobs')}
                >
                  Browse Available Jobs
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/my-applications')}
                >
                  View My Applications
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" gutterBottom color="primary">
              💡 How It Works
            </Typography>
            <Typography variant="body2" paragraph>
              1. <strong>Browse Jobs:</strong> Find positions that match your skills and interests
            </Typography>
            <Typography variant="body2" paragraph>
              2. <strong>Apply:</strong> Submit your application for any job
            </Typography>
            <Typography variant="body2" paragraph>
              3. <strong>Upload Resume:</strong> Upload your resume to start the AI interview
            </Typography>
            <Typography variant="body2" paragraph>
              4. <strong>Complete Interview:</strong> Answer AI-generated questions tailored to the job and your background
            </Typography>
            <Typography variant="body2">
              5. <strong>Get Evaluated:</strong> Receive instant AI evaluation and feedback
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              🚧 Work in Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Resume builder and templates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Interview practice mode with sample questions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Video interview support
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Skill assessments and coding challenges
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Application status notifications
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CandidateDashboard;
