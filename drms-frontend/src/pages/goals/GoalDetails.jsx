import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import TaskBoard from '../tasks/TaskBoard';
import GoalProgress from '../../components/goals/GoalProgress';
import api from '../../api/axiosConfig';

const GoalDetails = () => {
    const { goalId } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const [goal, setGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [health, setHealth] = useState(0);
    const [momentum, setMomentum] = useState('STABLE');
    const [insights, setInsights] = useState([]);
    const [reflections, setReflections] = useState([]);

    useEffect(() => {
        const fetchGoal = async () => {
            try {
                const response = await api.get(`/goals/${goalId}`);
                setGoal(response.data);

                // Fetch intelligence data
                api.get(`/goals/${goalId}/health`).then(res => setHealth(res.data.score)).catch(err => console.error(err));
                api.get(`/goals/${goalId}/momentum`).then(res => setMomentum(res.data.momentum)).catch(err => console.error(err));
                api.get(`/goals/${goalId}/insights`).then(res => setInsights(res.data)).catch(err => console.error(err));
                api.get(`/goals/${goalId}/reflections`).then(res => setReflections(res.data)).catch(err => console.error(err));
            } catch (error) {
                console.error('Error fetching goal:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGoal();
    }, [goalId]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const TabPanel = ({ children, value, index, ...other }) => (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );

    if (loading) return <CircularProgress />;
    if (!goal) return <Typography>Goal not found</Typography>;

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">{goal.title}</Typography>
                    <Typography color="text.secondary">{goal.description}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="overline" color="text.secondary">Health Score</Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <CircularProgress variant="determinate" value={health} color={health > 70 ? 'success' : health > 40 ? 'warning' : 'error'} size={60} />
                        <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h6" component="div" color="text.secondary">{health}</Typography>
                        </Box>
                    </Box>
                    <Typography variant="caption" display="block" sx={{ mt: 1, fontWeight: 'bold', color: momentum === 'SURGING' || momentum === 'IMPROVING' ? 'success.main' : 'text.secondary' }}>
                        {momentum}
                    </Typography>
                </Box>
            </Box>

            <GoalProgress goalId={goalId} />

            {insights.length > 0 && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'info.soft', borderRadius: 1, border: '1px solid', borderColor: 'info.main' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="info.main" gutterBottom>AI Coach Insights</Typography>
                    {insights.map((insight, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>• {insight}</Typography>
                    ))}
                </Box>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="goal tabs">
                    <Tab label="Tasks" />
                    <Tab label="Reflections" />
                    <Tab label="Activity" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <TaskBoard goalId={goalId} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>Weekly Reflections</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Reflect on your progress to improve your score.</Typography>

                {reflections.length > 0 ? (
                    reflections.map((reflection) => (
                        <Box key={reflection.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {new Date(reflection.reflectionDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" sx={{ bgcolor: reflection.score >= 7 ? 'success.light' : 'warning.light', px: 1, borderRadius: 1 }}>
                                    Score: {reflection.score}/10
                                </Typography>
                            </Box>
                            <Typography variant="body2">{reflection.insights}</Typography>
                            {reflection.obstacles && (
                                <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>Obstacles: {reflection.obstacles}</Typography>
                            )}
                        </Box>
                    ))
                ) : (
                    <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                        <Typography color="text.secondary">No reflections yet. Start by reflecting on your week.</Typography>
                    </Box>
                )}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <Typography variant="h6">Recent Activity</Typography>
                {/* Activity log */}
            </TabPanel>
        </Box>
    );
};

export default GoalDetails;
