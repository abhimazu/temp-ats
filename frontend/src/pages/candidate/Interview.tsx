import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { Send, CheckCircle } from '@mui/icons-material';
import api from '../../api/axios';

const Interview: React.FC = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<any>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterview();
  }, [interviewId]);

  const fetchInterview = async () => {
    try {
      const response = await api.get(`/candidate/interview/${interviewId}`);
      setInterview(response.data);
    } catch (error) {
      console.error('Error fetching interview:', error);
      setError('Failed to load interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const currentQuestion = interview.questions[interview.current_question];
      const response = await api.post(`/candidate/interview/${interviewId}/answer`, {
        question_id: currentQuestion.id,
        answer: currentAnswer,
      });

      setCurrentAnswer('');
      
      if (response.data.completed) {
        // Interview completed
        alert('Interview completed! Thank you for your time.');
        navigate('/dashboard/my-applications');
      } else {
        // Load next question
        fetchInterview();
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      setError(error.response?.data?.detail || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading interview...</Typography>
      </Box>
    );
  }

  if (error && !interview) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (interview.status === 'completed') {
    return (
      <Box>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Interview Completed!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for completing the interview. Your responses have been recorded and will be evaluated.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard/my-applications')}
          >
            Back to My Applications
          </Button>
        </Paper>
      </Box>
    );
  }

  const currentQuestion = interview.questions[interview.current_question];
  const progress = ((interview.current_question) / interview.questions.length) * 100;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Interview
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body1">
            Question {interview.current_question + 1} of {interview.questions.length}
          </Typography>
          <Chip
            label={`${Math.round(progress)}% Complete`}
            color="primary"
            size="small"
          />
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="start" gap={2}>
            <Typography
              variant="h6"
              sx={{
                bgcolor: '#1976d2',
                color: 'white',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              Q{interview.current_question + 1}
            </Typography>
            <Box flexGrow={1}>
              <Typography variant="h6" gutterBottom>
                {currentQuestion.text}
              </Typography>
              <Chip label={currentQuestion.type} size="small" sx={{ mt: 1 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Your Answer:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={8}
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here... Be specific and provide examples where relevant."
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Send />}
            onClick={submitAnswer}
            disabled={submitting || !currentAnswer.trim()}
          >
            {submitting ? 'Submitting...' : interview.current_question === interview.questions.length - 1 ? 'Submit Final Answer' : 'Submit & Next'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/my-applications')}
          >
            Save & Exit
          </Button>
        </Box>
      </Paper>

      {/* Previously answered questions */}
      {interview.answers && interview.answers.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Previous Answers
          </Typography>
          {interview.answers.map((ans: any, idx: number) => {
            const q = interview.questions.find((question: any) => question.id === ans.question_id);
            return (
              <Paper key={idx} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Q{idx + 1}: {q?.text}
                </Typography>
                <Typography variant="body1">{ans.answer}</Typography>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Interview;
