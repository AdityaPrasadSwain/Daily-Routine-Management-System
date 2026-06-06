import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Card, CardContent, CircularProgress, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import api from '../api/axiosConfig';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const History = () => {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            let endpoint = '/history/daily';
            if (tabValue === 1) endpoint = '/history/weekly';
            if (tabValue === 2) endpoint = '/history/monthly';

            const response = await api.get(endpoint);
            setHistoryData(response.data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [tabValue]);

    const StatCard = ({ title, value, color, gradient }) => (
        <Card sx={{
            height: '100%',
            background: gradient,
            color: 'white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
            <CardContent>
                <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>{title}</Typography>
                <Typography variant="h3" fontWeight="bold">{value}</Typography>
            </CardContent>
        </Card>
    );

    const getChartData = () => {
        if (!historyData) return [];
        return [
            { name: 'Completed', value: historyData.completedTasks },
            { name: 'Pending', value: historyData.pendingTasks },
            { name: 'Skipped/Missed', value: historyData.skippedTasks }
        ];
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Task History</Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
                    <Tab label="Daily" />
                    <Tab label="Weekly" />
                    <Tab label="Monthly" />
                </Tabs>
            </Paper>

            {loading ? (
                <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
            ) : historyData ? (
                <>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Total Tasks" value={historyData.totalTasks} gradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Completed" value={historyData.completedTasks} gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Completion %" value={`${historyData.completionPercentage.toFixed(1)}%`} gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Pending/Missed" value={historyData.pendingTasks} gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, height: 400 }}>
                                <Typography variant="h6" gutterBottom>Status Overview</Typography>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={getChartData()}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label
                                        >
                                            {getChartData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, height: 400, overflow: 'auto' }}>
                                <Typography variant="h6" gutterBottom>Tasks Log</Typography>
                                <List>
                                    {historyData.tasks && historyData.tasks.length > 0 ? (
                                        historyData.tasks.map((task) => (
                                            <ListItem key={task.id} divider>
                                                <ListItemText
                                                    primary={task.title}
                                                    secondary={`Status: ${task.status} | Date: ${task.plannedStart ? new Date(task.plannedStart).toLocaleDateString() : 'N/A'}`}
                                                />
                                                <Chip
                                                    label={task.status}
                                                    color={task.status === 'COMPLETED' ? 'success' : task.status === 'MISSED' ? 'error' : 'default'}
                                                    size="small"
                                                />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography color="text.secondary">No tasks found for this period.</Typography>
                                    )}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <Typography>No data available</Typography>
            )}
        </Box>
    );
};

export default History;
