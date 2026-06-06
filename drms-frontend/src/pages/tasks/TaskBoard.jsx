import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, IconButton, CircularProgress, Button, TextField, InputAdornment } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../api/axiosConfig';
import { format } from 'date-fns';
import FocusTimer from '../../components/focus/FocusTimer';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';

const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

const TaskBoard = ({ goalId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const [editingTask, setEditingTask] = useState(null);
    const [focusTask, setFocusTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [goalId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const endpoint = goalId ? `/tasks?goalId=${goalId}` : '/tasks';
            const response = await api.get(endpoint);
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };


    const handleOpenCreate = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const handleEditTask = (task, action) => {
        if (action === 'FOCUS') {
            setFocusTask(task);
        } else {
            setEditingTask(task);
            setIsTaskModalOpen(true);
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
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                <TextField
                    placeholder="Search tasks..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: 300, bgcolor: 'background.paper', borderRadius: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                >
                    Add Task
                </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2, height: 'calc(100vh - 250px)' }}>
                {statuses.map((status) => (
                    <Box key={status} sx={{
                        minWidth: 320,
                        flex: 1,
                        bgcolor: 'background.default',
                        p: 0,
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <Box sx={{
                            p: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            background: (theme) => {
                                if (theme.palette.mode === 'dark') {
                                    return status === 'PENDING' ? 'linear-gradient(to right, rgba(51, 65, 85, 0.5), rgba(30, 41, 59, 0.5))' :
                                        status === 'IN_PROGRESS' ? 'linear-gradient(to right, rgba(30, 58, 138, 0.3), rgba(30, 41, 59, 0.5))' :
                                            'linear-gradient(to right, rgba(6, 78, 59, 0.3), rgba(30, 41, 59, 0.5))';
                                }
                                return status === 'PENDING' ? 'linear-gradient(to right, #f1f5f9, #ffffff)' :
                                    status === 'IN_PROGRESS' ? 'linear-gradient(to right, #eff6ff, #ffffff)' :
                                        'linear-gradient(to right, #f0fdf4, #ffffff)';
                            },
                            borderTopLeftRadius: '16px',
                            borderTopRightRadius: '16px'
                        }}>
                            <Typography variant="h6" fontWeight="bold" sx={{
                                color: status === 'PENDING' ? 'text.secondary' :
                                    status === 'IN_PROGRESS' ? 'info.main' :
                                        'success.main',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem',
                                letterSpacing: 1
                            }}>
                                {status === 'PENDING' ? 'TODO' : status.replace('_', ' ')}
                            </Typography>
                        </Box>

                        <Box sx={{ overflowY: 'auto', flex: 1, p: 2 }}>
                            {tasks.filter(t => t.status === status && t.title.toLowerCase().includes(searchQuery.toLowerCase())).map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onTaskUpdated={fetchTasks}
                                    onEdit={handleEditTask}
                                />
                            ))}
                            {tasks.filter(t => t.status === status && t.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                <Box sx={{
                                    border: '2px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    p: 3,
                                    mt: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'text.disabled'
                                }}>
                                    <Typography variant="body2">No tasks</Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>

            <TaskModal
                open={isTaskModalOpen}
                handleClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={fetchTasks}
                initialGoalId={goalId}
                taskToEdit={editingTask}
            />

            <FocusTimer
                open={!!focusTask}
                handleClose={() => setFocusTask(null)}
                task={focusTask}
                onSessionComplete={fetchTasks}
            />
        </Box>
    );
};


export default TaskBoard;
