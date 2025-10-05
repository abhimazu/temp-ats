import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Alert,
} from '@mui/material';
import { Work } from '@mui/icons-material';
import api from '../../api/axios';

const BrowseJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/candidate/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const response = await api.get('/candidate/my-applications');
      const jobIds = new Set(response.data.map((app: any) => app.job_id));
      setAppliedJobs(jobIds);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      await api.post('/candidate/apply', { job_id: jobId });
      setAppliedJobs(new Set([...appliedJobs, jobId]));
      setSuccessMessage('Application submitted! Go to "My Applications" to upload your resume and start the interview.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      console.error('Error applying:', error);
      alert(error.response?.data?.detail || 'Failed to apply');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Browse Available Jobs
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find your next opportunity and apply with AI-powered interviews
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No jobs available at the moment
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="start" gap={2}>
                    <Box
                      sx={{
                        bgcolor: '#e3f2fd',
                        p: 2,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Work color="primary" sx={{ fontSize: 32 }} />
                    </Box>
                    <Box flexGrow={1}>
                      <Typography variant="h6" gutterBottom>
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {job.description}
                      </Typography>
                      {job.requirements && (
                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Requirements:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {job.requirements}
                          </Typography>
                        </Box>
                      )}
                      <Box display="flex" gap={1} alignItems="center">
                        <Chip
                          label={job.status}
                          color="success"
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Posted: {new Date(job.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      {appliedJobs.has(job.id) ? (
                        <Chip label="Applied" color="success" />
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() => handleApply(job.id)}
                        >
                          Apply Now
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BrowseJobs;
