import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../../api/axiosConfig';
import { motion } from 'framer-motion';

const GrowthDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGrowthReport();
    }, []);

    const fetchGrowthReport = async () => {
        try {
            const response = await api.get('/reviews/growth');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching growth report:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" itemsAlign="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!stats) return <Typography>No data available.</Typography>;

    // Prepare data for Pie Chart
    const moodData = stats.moodDistribution
        ? Object.entries(stats.moodDistribution).map(([mood, count]) => ({ name: mood, value: count }))
        : [];

    const COLORS = ['#FFBB28', '#FF8042', '#00C49F', '#0088FE', '#8884d8'];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                Growth & Insights 🚀
            </Typography>

            <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card sx={{ height: '100%', bgcolor: 'primary.main', color: 'white' }}>
                            <CardContent>
                                <Typography variant="h6">Total Tasks Reviewed</Typography>
                                <Typography variant="h2" fontWeight="bold">{stats.totalTasksReviewed}</Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card sx={{ height: '100%', bgcolor: 'secondary.main', color: 'white' }}>
                            <CardContent>
                                <Typography variant="h6">Average Rating</Typography>
                                <Typography variant="h2" fontWeight="bold">
                                    {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'} <span style={{ fontSize: '1.5rem' }}>/ 5</span>
                                </Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card sx={{ height: '100%', bgcolor: 'success.dark', color: 'white' }}>
                            <CardContent>
                                <Typography variant="h6">Top Mood</Typography>
                                <Typography variant="h3" fontWeight="bold">{stats.topMood}</Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Mood Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 400 }}>
                        <Typography variant="h6" gutterBottom>Mood Distribution</Typography>
                        {moodData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={moodData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {moodData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                                <Typography color="text.secondary">No mood data yet.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Growth Tips</Typography>
                        <Box mt={2}>
                            <Typography paragraph>
                                💡 <strong>Consistency is key:</strong> Try to maintain a high completion rate.
                            </Typography>
                            <Typography paragraph>
                                🌟 <strong>Reflect often:</strong> Reviewing tasks helps you understand your productivity patterns.
                            </Typography>
                            <Typography paragraph>
                                🔥 <strong>Challenge yourself:</strong> If every task is "Low Effort", try increasing difficulty.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GrowthDashboard;
