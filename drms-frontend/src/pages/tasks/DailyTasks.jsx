import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Container, TextField, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../api/axiosConfig';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';
import { format } from 'date-fns';



const DailyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tasks/today');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching today\'s tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>

                {/* Main Task Area */}
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Today's Focus
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {format(new Date(), 'EEEE, MMMM do, yyyy')}
                            </Typography>
                        </Box>
                        <Box display="flex" gap={2}>
                            <TextField
                                placeholder="Search..."
                                variant="outlined"
                                size="small"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ bgcolor: 'background.paper', borderRadius: 2, width: { xs: '100%', sm: 250 } }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenCreate}
                                sx={{ borderRadius: 2, px: 3, py: 1, whiteSpace: 'nowrap' }}
                            >
                                Add Task
                            </Button>
                        </Box>
                    </Box>

                    {tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            py: 8,
                            bgcolor: '#f8fafc',
                            borderRadius: 4,
                            border: '2px dashed #e2e8f0'
                        }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                {tasks.length === 0 ? "No tasks scheduled for today." : "No matching tasks found."}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enjoy your day or add a task to get started!
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                            {tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onTaskUpdated={fetchTasks}
                                    onEdit={handleEditTask}
                                />
                            ))}
                        </Box>
                    )}
                </Box>



            </Box>

            <TaskModal
                open={isTaskModalOpen}
                handleClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={fetchTasks}
                taskToEdit={editingTask}
                initialScheduledDate={new Date()} // Pre-fill today
            />
        </Container>
    );
};

export default DailyTasks;
