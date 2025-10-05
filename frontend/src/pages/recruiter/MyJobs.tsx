import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Visibility, Add } from '@mui/icons-material';
import api from '../../api/axios';

const MyJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/recruiter/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewApplications = (jobId: number) => {
    navigate(`/dashboard/job/${jobId}/applications`);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            My Job Postings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your active job postings and view applications
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

      {jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't posted any jobs yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/dashboard/post-job')}
          >
            Post Your First Job
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box flexGrow={1}>
                      <Typography variant="h6" gutterBottom>
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {job.description.length > 200
                          ? `${job.description.substring(0, 200)}...`
                          : job.description}
                      </Typography>
                      {job.requirements && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Requirements:</strong> {job.requirements}
                        </Typography>
                      )}
                      <Box mt={2}>
                        <Chip
                          label={job.status}
                          color={job.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          Posted: {new Date(job.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => viewApplications(job.id)}
                      sx={{ ml: 2 }}
                    >
                      View Applications
                    </Button>
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

export default MyJobs;
