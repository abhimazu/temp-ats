import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import api from '../../api/axios';

const PostJob: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await api.post('/recruiter/jobs', {
        title,
        description,
        requirements,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/jobs');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to post job');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Post New Job
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Create a new job posting to attract qualified candidates
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 800 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Job posted successfully! Redirecting...
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            placeholder="e.g., Senior Software Engineer"
          />
          
          <TextField
            fullWidth
            label="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
            multiline
            rows={6}
            placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
          />
          
          <TextField
            fullWidth
            label="Requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            placeholder="Required skills, experience, education, certifications..."
          />

          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Post Job
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard/jobs')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostJob;
