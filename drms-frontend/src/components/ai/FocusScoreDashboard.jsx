import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Chip, LinearProgress, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SpeedIcon from '@mui/icons-material/Speed';
import RefreshIcon from '@mui/icons-material/Refresh';

const FocusScoreDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [mentalData, setMentalData] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [scoreRes, mentalRes] = await Promise.all([
                api.get('/ai/productivity/focus-score'),
                api.get('/ai/productivity/mental-load')
            ]);
            setData(scoreRes.data);
            setMentalData(mentalRes.data);
        } catch (error) {
            console.error("Failed to fetch focus metrics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <CircularProgress />
        </Card>
    );

    if (!data) return null;

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981'; // Success
        if (score >= 50) return '#f59e0b'; // Warning
        return '#ef4444'; // Error
    };

    return (
        <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', bgcolor: getScoreColor(data.score) }} />

            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SpeedIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Active Focus Score</Typography>
                    </Box>
                    <IconButton size="small" onClick={fetchData}><RefreshIcon fontSize="small" /></IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                        <Typography variant="h2" fontWeight="800" sx={{ color: getScoreColor(data.score) }}>
                            {data.score}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Daily Index</Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                        <Chip
                            icon={data.trend === 'UP' ? <TrendingUpIcon /> : data.trend === 'DOWN' ? <TrendingDownIcon /> : <TrendingFlatIcon />}
                            label={data.trend}
                            color={data.trend === 'UP' ? 'success' : data.trend === 'DOWN' ? 'error' : 'default'}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        {data.driftDetected && (
                            <Typography variant="caption" color="error" display="block">
                                ⚠️ Attention Drift
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, mb: 3, borderLeft: `3px solid ${getScoreColor(data.score)}` }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.9 }}>
                        "{data.explanation}"
                    </Typography>
                </Box>

                {mentalData && (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <PsychologyIcon fontSize="small" color="action" />
                            <Typography variant="subtitle2">Mental Load: {mentalData.status || "Analyzing..."}</Typography>
                        </Box>
                        {mentalData.suggestion && (
                            <Typography variant="caption" color="text.secondary">
                                {mentalData.suggestion}
                            </Typography>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default FocusScoreDashboard;
