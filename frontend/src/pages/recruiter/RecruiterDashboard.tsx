import React, { useEffect, useState } from 'react';
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
import { Work, Assignment, PendingActions, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const RecruiterDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/recruiter/dashboard');
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
      title: 'My Job Postings',
      value: stats?.total_jobs || 0,
      icon: <Work sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Applications',
      value: stats?.total_applications || 0,
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Pending Reviews',
      value: stats?.pending_reviews || 0,
      icon: <PendingActions sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Recruiter Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your job postings and candidate applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/dashboard/post-job')}
        >
          Post New Job
        </Button>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={4} key={index}>
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
                  onClick={() => navigate('/dashboard/jobs')}
                >
                  View My Jobs
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/post-job')}
                >
                  Post New Job
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              🚧 Work in Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Advanced candidate filtering and search
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Automated candidate ranking based on AI scores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Interview scheduling and calendar integration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Email templates and candidate communication
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Analytics and hiring pipeline visualization
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecruiterDashboard;
