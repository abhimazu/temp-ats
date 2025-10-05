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
import { Upload, PlayArrow } from '@mui/icons-material';
import api from '../../api/axios';

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/candidate/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (applicationId: number, file: File) => {
    setUploading(applicationId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(
        `/candidate/upload-resume/${applicationId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      alert('Resume uploaded successfully! You can now start the interview.');
      fetchApplications(); // Refresh the list
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      alert(error.response?.data?.detail || 'Failed to upload resume');
    } finally {
      setUploading(null);
    }
  };

  const startInterview = (interviewId: number) => {
    navigate(`/dashboard/interview/${interviewId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'interviewing':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
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
        My Applications
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track your applications and complete interviews
      </Typography>

      {applications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't applied to any jobs yet
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard/browse-jobs')}
          >
            Browse Available Jobs
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {applications.map((app) => (
            <Grid item xs={12} key={app.application_id}>
              <Card>
                <CardContent>
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {app.job_title}
                        </Typography>
                        <Chip
                          label={app.status}
                          color={getStatusColor(app.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {app.job_description.length > 150
                        ? `${app.job_description.substring(0, 150)}...`
                        : app.job_description}
                    </Typography>

                    <Box display="flex" gap={2} mt={2}>
                      {app.status === 'pending' && (
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<Upload />}
                          disabled={uploading === app.application_id}
                        >
                          {uploading === app.application_id ? 'Uploading...' : 'Upload Resume'}
                          <input
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(app.application_id, file);
                              }
                            }}
                          />
                        </Button>
                      )}

                      {app.has_interview && app.interview_status !== 'completed' && (
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<PlayArrow />}
                          onClick={() => startInterview(app.interview_id)}
                        >
                          {app.interview_status === 'in_progress' ? 'Continue Interview' : 'Start Interview'}
                        </Button>
                      )}

                      {app.interview_status === 'completed' && (
                        <Chip label="Interview Completed ✓" color="success" />
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

export default MyApplications;
