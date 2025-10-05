import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ExpandMore, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import api from '../../api/axios';

const Interviews: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get('/admin/interviews');
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Interview Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View detailed AI analysis and Q&A for all interviews
      </Typography>

      {interviews.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No interviews found
          </Typography>
        </Paper>
      ) : (
        interviews.map((interview) => (
          <Accordion key={interview.interview_id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" width="100%" gap={2}>
                {interview.status === 'completed' ? (
                  <CheckCircle color="success" />
                ) : (
                  <HourglassEmpty color="warning" />
                )}
                <Box flexGrow={1}>
                  <Typography variant="h6">
                    {interview.candidate_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {interview.job_title} • {interview.candidate_email}
                  </Typography>
                </Box>
                {interview.score && (
                  <Chip
                    label={`Score: ${interview.score}%`}
                    color={interview.score >= 80 ? 'success' : interview.score >= 60 ? 'primary' : 'warning'}
                  />
                )}
                <Chip
                  label={interview.status}
                  color={interview.status === 'completed' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* AI Analysis */}
                {interview.ai_analysis && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: '#f0f7ff' }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        🤖 AI Analysis
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Overall Assessment:</strong>{' '}
                        {interview.ai_analysis.overall_assessment}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Strengths:
                      </Typography>
                      <Box component="ul" sx={{ mt: 0 }}>
                        {interview.ai_analysis.strengths?.map((strength: string, idx: number) => (
                          <li key={idx}>
                            <Typography variant="body2">{strength}</Typography>
                          </li>
                        ))}
                      </Box>

                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                        Areas for Improvement:
                      </Typography>
                      <Box component="ul" sx={{ mt: 0 }}>
                        {interview.ai_analysis.areas_for_improvement?.map((area: string, idx: number) => (
                          <li key={idx}>
                            <Typography variant="body2">{area}</Typography>
                          </li>
                        ))}
                      </Box>

                      {interview.ai_analysis.recommendation && (
                        <Typography variant="body1" sx={{ mt: 2 }}>
                          <strong>Recommendation:</strong>{' '}
                          <Chip
                            label={interview.ai_analysis.recommendation}
                            color="success"
                            size="small"
                          />
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                )}

                {/* Questions & Answers */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Questions & Answers
                  </Typography>
                  {interview.questions?.map((q: any, idx: number) => {
                    const answer = interview.answers?.find((a: any) => a.question_id === q.id);
                    return (
                      <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Q{idx + 1}: {q.text}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Type: <Chip label={q.type} size="small" />
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body1">
                          <strong>Answer:</strong>{' '}
                          {answer ? answer.answer : <em>Not answered yet</em>}
                        </Typography>
                      </Paper>
                    );
                  })}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default Interviews;
