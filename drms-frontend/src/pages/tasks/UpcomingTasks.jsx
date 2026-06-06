import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Container, Divider, TextField, Paper } from '@mui/material';
import api from '../../api/axiosConfig';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';
import { format, parseISO, isToday } from 'date-fns';

const UpcomingTasks = () => {
    const [upcomingData, setUpcomingData] = useState(null);
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks(startDate);
    }, [startDate]);

    const fetchTasks = async (date) => {
        try {
            setLoading(true);
            const response = await api.get(`/tasks/upcoming?startDate=${date}`);
            setUpcomingData(response.data);
        } catch (error) {
            console.error('Error fetching upcoming tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleTaskUpdated = () => {
        fetchTasks(startDate);
    };

    if (loading && !upcomingData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Upcoming Week
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {upcomingData ?
                            `From ${format(parseISO(upcomingData.startDate), 'MMM do')} to ${format(parseISO(upcomingData.endDate), 'MMM do')}`
                            : 'Loading agenda...'}
                    </Typography>
                </Box>
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={handleDateChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ width: 200 }}
                />
            </Box>

            {/* List of 7 Days */}
            {upcomingData?.dailyGroups?.map((group) => (
                <Box key={group.date} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 1,
                            color: isToday(parseISO(group.date)) ? 'primary.main' : 'text.primary'
                        }}>
                            <Typography variant="h6" fontWeight="bold">
                                {format(parseISO(group.date), 'EEEE')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {format(parseISO(group.date), 'MMM do')}
                            </Typography>
                            {isToday(parseISO(group.date)) && (
                                <Box component="span" sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    px: 1,
                                    py: 0.2,
                                    borderRadius: 1,
                                    fontSize: '0.7rem',
                                    ml: 1
                                }}>
                                    TODAY
                                </Box>
                            )}
                        </Box>
                        <Divider sx={{ flex: 1, ml: 2 }} />
                    </Box>

                    {group.tasks.length === 0 ? (
                        <Paper variant="outlined" sx={{
                            p: 2,
                            bgcolor: 'background.default',
                            borderStyle: 'dashed',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="body2" color="text.secondary" align="center">
                                No tasks scheduled
                            </Typography>
                        </Paper>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                            {group.tasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onTaskUpdated={handleTaskUpdated}
                                    onEdit={handleEditTask}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            ))}

            <TaskModal
                open={isTaskModalOpen}
                handleClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={handleTaskUpdated}
                taskToEdit={editingTask}
            />
        </Container>
    );
};

export default UpcomingTasks;
