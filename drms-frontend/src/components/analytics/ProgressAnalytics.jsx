import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../api/axiosConfig';

const ProgressAnalytics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/tasks/analytics/weekly');
                // Format date for chart
                const formattedData = response.data.map(item => ({
                    ...item,
                    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
                    avgProgress: Math.round(item.avgProgress)
                }));
                setData(formattedData);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <CircularProgress title="Loading Chart..." />;

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Weekly Progress
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
                {data.length > 0 ? (
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="avgProgress" fill="#3f51b5" radius={[4, 4, 0, 0]} name="Avg Progress %" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                        <Typography color="text.secondary">No data available</Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default ProgressAnalytics;
