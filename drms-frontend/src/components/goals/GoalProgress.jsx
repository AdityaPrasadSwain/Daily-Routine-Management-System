import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, List, ListItem, ListItemText, Chip, Divider, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import api from '../../api/axiosConfig';

const GoalProgress = ({ goalId }) => {
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (goalId) {
            fetchProgress();
        }
    }, [goalId]);

    const fetchProgress = async () => {
        try {
            const res = await api.get(`/goals/${goalId}/progress`);
            setProgressData(res.data);
        } catch (error) {
            console.error("Failed to fetch goal progress", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LinearProgress />;

    if (!progressData) return null;

    const { progressPercentage, completedTasks, totalTasks, status, tasks } = progressData;

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'NEAR_COMPLETION': return 'info';
            case 'IN_PROGRESS': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">Progress</Typography>
                <Chip label={status.replace('_', ' ')} color={getStatusColor(status)} size="small" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${progressPercentage}%`}</Typography>
                </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {completedTasks} of {totalTasks} tasks completed
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Linked Tasks</Typography>
            {tasks && tasks.length > 0 ? (
                <List dense>
                    {tasks.map((task) => (
                        <ListItem key={task.id} disablePadding sx={{ mb: 1 }}>
                            <Box sx={{ mr: 2, color: task.status === 'COMPLETED' ? 'success.main' : 'text.disabled' }}>
                                {task.status === 'COMPLETED' ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                            </Box>
                            <ListItemText
                                primary={task.title}
                                secondary={task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                                primaryTypographyProps={{ sx: { textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none' } }}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    No tasks linked to this goal yet.
                </Typography>
            )}
        </Paper>
    );
};

export default GoalProgress;
