import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Work,
  Assignment,
  Psychology,
} from '@mui/icons-material';
import api from '../../api/axios';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
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
      title: 'Total Candidates',
      value: stats?.total_candidates || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Recruiters',
      value: stats?.total_recruiters || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Active Jobs',
      value: stats?.total_jobs || 0,
      icon: <Work sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Applications',
      value: stats?.total_applications || 0,
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
    {
      title: 'Interviews Conducted',
      value: stats?.total_interviews || 0,
      icon: <Psychology sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
    },
    {
      title: 'Completed Interviews',
      value: stats?.completed_interviews || 0,
      icon: <Psychology sx={{ fontSize: 40 }} />,
      color: '#0288d1',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        System-wide overview and analytics
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Average Interview Score
            </Typography>
            <Typography variant="h3" color="primary">
              {stats?.average_score || 0}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on completed interviews
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Typography variant="body1" color="success.main" fontWeight="bold">
              ✓ All Systems Operational
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🚧 Work in Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Advanced analytics and reporting dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Real-time interview monitoring
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Candidate performance trends and insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • System health monitoring and alerts
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
