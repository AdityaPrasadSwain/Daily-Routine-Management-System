import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Button, IconButton, Chip, Avatar, Container } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import api from '../../api/axiosConfig';
import GrowthDashboard from '../../components/dashboard/GrowthDashboard';
import ProgressAnalytics from '../../components/analytics/ProgressAnalytics';
import ReviewSummary from '../../components/analytics/ReviewSummary';
import TaskModal from '../../components/tasks/TaskModal';
import Link from '@mui/material/Link';
import FocusScoreDashboard from '../../components/ai/FocusScoreDashboard';
import AiAssistant from '../../components/ai/AiAssistant';



import { format } from 'date-fns';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, colorGradient }) => (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card sx={{
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            background: colorGradient,
            color: 'white',
            border: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
            <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.2 }}>
                {React.cloneElement(icon, { sx: { fontSize: 100 } })}
            </Box>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.2)', display: 'flex' }}>
                        {icon}
                    </Box>
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    {value}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    </motion.div>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
    }
};

const Dashboard = () => {
    const [stats, setStats] = useState([
        { title: 'Total Goals', value: 0, icon: <BusinessCenterIcon fontSize="medium" />, gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
        { title: 'Total Tasks', value: 0, icon: <AssignmentIcon fontSize="medium" />, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { title: 'Completed', value: 0, icon: <CheckCircleIcon fontSize="medium" />, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { title: 'Overdue', value: 0, icon: <WarningIcon fontSize="medium" />, gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
    ]);
    const [loading, setLoading] = useState(true);
    const [recentTasks, setRecentTasks] = useState([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const statsResponse = await api.get('/dashboard/stats');
            const data = statsResponse.data;

            setStats([
                { title: 'Total Goals', value: data.totalGoals || 0, icon: <BusinessCenterIcon />, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
                { title: 'Total Tasks', value: data.totalTasks || 0, icon: <AssignmentIcon />, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
                { title: 'Completed', value: data.completedTasks || 0, icon: <CheckCircleIcon />, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                { title: 'Overdue', value: data.overdueTasks || 0, icon: <WarningIcon />, gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' },
            ]);

            const tasksResponse = await api.get('/tasks');
            // Filter non-completed for "Recent Active" or just show all recent
            setRecentTasks(tasksResponse.data.slice(0, 20));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ pb: 4 }}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
                    <motion.div variants={itemVariants}>
                        <Box>
                            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2, fontWeight: 600 }}>
                                {format(new Date(), 'EEEE, MMMM do, yyyy')}
                            </Typography>
                            <Typography variant="h3" fontWeight={800} sx={{ background: 'linear-gradient(90deg, #111827 0%, #4b5563 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {greeting}, Swain
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                                Here's what's happening with your projects today.
                            </Typography>
                        </Box>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<CalendarMonthIcon />}
                                sx={{ borderRadius: '12px', height: 48, px: 3, borderColor: 'divider', color: 'text.primary' }}
                            >
                                Calendar
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setIsTaskModalOpen(true)}
                                sx={{
                                    borderRadius: '12px',
                                    height: 48,
                                    px: 3,
                                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3), 0 2px 4px -1px rgba(79, 70, 229, 0.06)'
                                }}
                            >
                                New Task
                            </Button>
                        </Box>
                    </motion.div>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={3} mb={5}>
                    {stats.map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.title}>
                            <motion.div variants={itemVariants}>
                                <StatCard
                                    title={stat.title}
                                    value={stat.value}
                                    icon={stat.icon}
                                    colorGradient={stat.gradient}
                                />
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Main Content Area */}
                <Grid container spacing={4}>
                    {/* Left Column: Tasks & Charts */}
                    <Grid item xs={12} lg={8}>
                        <motion.div variants={itemVariants}>
                            {/* Social Media Detox Section */}
                            <GrowthDashboard />


                            {/* AI Focus Score Dashboard */}
                            <Box sx={{ mt: 4, mb: 4 }}>
                                <FocusScoreDashboard />
                            </Box>

                            {/* Recent Activity Section */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight={700}>Recent Activity</Typography>
                                    <Button size="small" endIcon={<TrendingUpIcon />}>View All</Button>
                                </Box>
                                <Card sx={{ border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                    <Box sx={{
                                        maxHeight: '400px', // Fixed height for scroll
                                        overflowY: 'auto', // Enable vertical scrolling
                                        // Custom Scrollbar
                                        '&::-webkit-scrollbar': { width: '8px' },
                                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                                        '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '4px' },
                                        '&::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
                                        '.dark-mode &::-webkit-scrollbar-thumb': { background: '#475569' },
                                        '.dark-mode &::-webkit-scrollbar-thumb:hover': { background: '#64748b' }
                                    }}>
                                        <List sx={{ p: 0 }}>
                                            {recentTasks.length > 0 ? (
                                                recentTasks.map((task, index) => (
                                                    <React.Fragment key={task.id}>
                                                        <ListItem alignItems="center" sx={{ py: 2, px: 3 }}>
                                                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                                                <Avatar sx={{
                                                                    bgcolor: task.priority === 'HIGH' ? 'error.light' : task.priority === 'MEDIUM' ? 'warning.light' : 'success.light',
                                                                    color: task.priority === 'HIGH' ? 'error.contrastText' : task.priority === 'MEDIUM' ? 'warning.contrastText' : 'success.contrastText',
                                                                    width: 40, height: 40
                                                                }}>
                                                                    {task.priority === 'HIGH' ? '!' : task.priority === 'MEDIUM' ? '-' : '✓'}
                                                                </Avatar>
                                                            </Box>
                                                            <ListItemText
                                                                primary={<Typography variant="subtitle1" fontWeight={600}>{task.title}</Typography>}
                                                                secondaryTypographyProps={{ component: 'div' }}
                                                                secondary={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                                        <Chip label={task.category || 'Work'} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'background.default' }} />
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            • {task.plannedStart ? format(new Date(task.plannedStart), 'MMM d, h:mm a') : 'No Date'}
                                                                        </Typography>
                                                                    </Box>
                                                                }
                                                            />
                                                            <Box>
                                                                <Chip
                                                                    label={task.status}
                                                                    color={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'info' : 'default'}
                                                                    variant={task.status === 'COMPLETED' ? 'filled' : 'outlined'}
                                                                    size="small"
                                                                    sx={{ fontWeight: 600, borderRadius: '6px' }}
                                                                />
                                                            </Box>
                                                        </ListItem>
                                                        {index < recentTasks.length - 1 && <Divider component="li" variant="inset" />}
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <Box sx={{ p: 5, textAlign: 'center' }}>
                                                    <AssignmentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                                    <Typography color="text.secondary">No active tasks found. Time to plan!</Typography>
                                                </Box>
                                            )}
                                        </List>
                                    </Box>
                                </Card>
                            </Box>
                        </motion.div>

                        <motion.div variants={itemVariants}>

                        </motion.div>
                    </Grid>

                    {/* Right Column: Analytics & Summary */}
                    <Grid item xs={12} lg={4}>
                        <Grid container spacing={4} direction="column">
                            <Grid item>
                                <motion.div variants={itemVariants}>
                                    <ProgressAnalytics />
                                </motion.div>
                            </Grid>
                            <Grid item>
                                <motion.div variants={itemVariants}>
                                    <ReviewSummary />
                                </motion.div>
                            </Grid>
                            <Grid item>
                                <motion.div variants={itemVariants}>
                                    <Card sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <AccessTimeIcon color="warning" />
                                            <Typography variant="h6" fontWeight="bold">Focus Tip</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                                            "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle."
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.6 }}>
                                            — Steve Jobs
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={8}>
                        <motion.div variants={itemVariants}>
                            <AiAssistant />
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Modals */}
                <TaskModal
                    open={isTaskModalOpen}
                    handleClose={() => setIsTaskModalOpen(false)}
                    onTaskCreated={fetchDashboardData}
                />
            </motion.div>
        </Container>
    );
};

export default Dashboard;
