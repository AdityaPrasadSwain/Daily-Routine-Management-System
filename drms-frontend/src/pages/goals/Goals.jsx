import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem, Container, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Swal from 'sweetalert2';
import GoalCard from '../../components/goals/GoalCard';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parseISO, format } from 'date-fns';

const Goals = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ title: '', description: '', type: 'MONTHLY', targetDate: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);


    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await api.get('/goals');
            setGoals(response.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    };

    const handleOpenCreate = () => {
        setNewGoal({ title: '', description: '', type: 'MONTHLY', targetDate: '' });
        setIsEditing(false);
        setEditingId(null);
        setOpen(true);
    };

    const handleEdit = (goal) => {
        setNewGoal({
            title: goal.title,
            description: goal.description,
            type: goal.type,
            targetDate: goal.targetDate || ''
        });
        setIsEditing(true);
        setEditingId(goal.id);
        setOpen(true);
    };

    const handleSave = async () => {
        if (isEditing) {
            try {
                const payload = { ...newGoal, targetDate: newGoal.targetDate === '' ? null : newGoal.targetDate };
                await api.put(`/goals/${editingId}`, payload);
                setOpen(false);
                fetchGoals();
                Swal.fire('Success', 'Goal updated successfully', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to update goal', 'error');
            }
        } else {
            try {
                const payload = { ...newGoal, targetDate: newGoal.targetDate === '' ? null : newGoal.targetDate };
                await api.post('/goals', payload);
                setOpen(false);
                fetchGoals();
                Swal.fire('Success', 'Goal created successfully', 'success');
            } catch (error) {
                console.error(error);
                const errorMessage = error.response?.data || error.message || 'Failed to create goal';
                Swal.fire('Error', errorMessage, 'error');
            }
        }
    };

    // Calculate stats
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status !== 'COMPLETED').length;
    const completedGoals = goals.filter(g => g.status === 'COMPLETED').length;

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
            {/* Professional Header Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Goals
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track and achieve your objectives with focused planning
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                    sx={{
                        borderRadius: '12px',
                        px: 3,
                        py: 1.5,
                        boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
                    }}
                >
                    New Goal
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                        color: 'white',
                        boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    display: 'flex'
                                }}>
                                    <BusinessCenterIcon fontSize="large" />
                                </Box>
                                <Box>
                                    <Typography variant="h3" fontWeight={700}>
                                        {totalGoals}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Total Goals
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    display: 'flex'
                                }}>
                                    <TrendingUpIcon fontSize="large" />
                                </Box>
                                <Box>
                                    <Typography variant="h3" fontWeight={700}>
                                        {activeGoals}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Active Goals
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    display: 'flex'
                                }}>
                                    <CheckCircleIcon fontSize="large" />
                                </Box>
                                <Box>
                                    <Typography variant="h3" fontWeight={700}>
                                        {completedGoals}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Completed
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Goals Grid or Empty State */}
            {goals.length > 0 ? (
                <Grid container spacing={3}>
                    {goals.map((goal) => (
                        <Grid item xs={12} sm={6} lg={4} key={goal.id}>
                            <GoalCard
                                goal={goal}
                                onUpdate={{
                                    onEdit: handleEdit,
                                    onRefresh: fetchGoals
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{
                    py: 8,
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: 'divider'
                }}>
                    <BusinessCenterIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No goals yet
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                        Get started by creating your first goal to track your progress
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreate}
                        sx={{ borderRadius: '12px' }}
                    >
                        Create Your First Goal
                    </Button>
                </Box>
            )}

            {/* Create/Edit Goal Modal */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography component="div" variant="h6" fontWeight={600}>
                        {isEditing ? 'Edit Goal' : 'Create New Goal'}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Goal Title"
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 1 }}
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    />


                    <FormControl fullWidth margin="dense">
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={newGoal.type}
                            label="Type"
                            onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                        >
                            <MenuItem value="DAILY">Daily</MenuItem>
                            <MenuItem value="WEEKLY">Weekly</MenuItem>
                            <MenuItem value="MONTHLY">Monthly</MenuItem>
                            <MenuItem value="LONG_TERM">Long Term</MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Target Date"
                            value={newGoal.targetDate ? parseISO(newGoal.targetDate) : null}
                            onChange={(newValue) => {
                                setNewGoal({ 
                                    ...newGoal, 
                                    targetDate: newValue ? format(newValue, 'yyyy-MM-dd') : '' 
                                });
                            }}
                            slotProps={{
                                textField: {
                                    margin: "dense",
                                    fullWidth: true,
                                    variant: "outlined"
                                },
                                desktopPaper: {
                                    elevation: 8,
                                    sx: {
                                        borderRadius: 3,
                                        border: '1px solid rgba(129, 140, 248, 0.2)',
                                        '& .MuiPickersDay-root.Mui-selected': {
                                            background: 'linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%)',
                                            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiPickersDay-today': {
                                            borderColor: '#818cf8',
                                            borderWidth: 2
                                        }
                                    }
                                }
                            }}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: '8px' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ borderRadius: '8px', px: 3 }}
                    >
                        {isEditing ? 'Save Changes' : 'Create Goal'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Goals;
