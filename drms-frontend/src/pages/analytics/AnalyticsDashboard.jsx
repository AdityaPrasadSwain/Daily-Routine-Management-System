import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from '../../api/axiosConfig';

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('/dashboard/stats');
            setData(response.data);
            setError(null);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
            setError("Failed to load analytics: " + (error.response?.data?.message || error.message));
        }
    };

    if (error) return <Box p={3}><Typography color="error">{error}</Typography></Box>;
    if (!data) return <Box p={3}><Typography>Loading...</Typography></Box>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const pieData = Object.keys(data.categoryDistribution).map(key => ({
        name: key,
        value: data.categoryDistribution[key]
    }));

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                Analytics Dashboard
            </Typography>

            {/* Stats Cards - Responsive Grid */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Completion Rate</Typography>
                            <Typography variant="h4">{data.completionRate.toFixed(1)}%</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Total Focus Time</Typography>
                            <Typography variant="h4">{(data.totalFocusTimeSeconds / 60).toFixed(0)} min</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Tasks Completed Today</Typography>
                            <Typography variant="h4">{data.tasksCompletedToday}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Tasks Due Today</Typography>
                            <Typography variant="h4">{data.tasksDueToday}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts - Responsive Grid */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                        <Typography variant="h6" gutterBottom>Weekly Activity</Typography>
                        <Box sx={{ height: { xs: 250, sm: 300 } }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.weeklyActivity}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 12 }} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar yAxisId="left" dataKey="tasksCompleted" name="Tasks Completed" fill="#8884d8" />
                                    <Bar yAxisId="right" dataKey="focusMinutes" name="Focus Minutes" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                        <Typography variant="h6" gutterBottom>Categories</Typography>
                        <Box sx={{ height: { xs: 250, sm: 300 } }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsDashboard;
