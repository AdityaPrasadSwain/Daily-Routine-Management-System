import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Zap, Clock } from 'lucide-react';
import api from '../../api/axiosConfig';
import { ThemeContext } from '../../context/ThemeContext';
import Swal from 'sweetalert2';

const GrowthDashboard = () => {
    const { mode } = useContext(ThemeContext);
    const isDark = mode === 'dark';
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayAvoidedMinutes: 0,
        totalAvoidedMinutes: 0,
        growthScore: 0,
        focusLevel: 0,
        pointsForNextLevel: 50
    });

    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const subTextColor = isDark ? '#94a3b8' : '#64748b';
    const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)';

    const fetchStats = async () => {
        try {
            const response = await api.get('/growth/stats');
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch growth stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogMinutes = async (minutes) => {
        try {
            const response = await api.post('/growth/log-avoidance', { minutes });
            setStats(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Great Job!',
                text: `You avoided social media for ${minutes} minutes!`,
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: isDark ? '#fff' : '#1e293b',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to log minutes.',
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: isDark ? '#fff' : '#1e293b'
            });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    const levelProgress = 50 - stats.pointsForNextLevel;
    const progressPercent = (levelProgress / 50) * 100;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                background: cardBg,
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                mb: 4
            }}
        >
            <Box display="flex" alignItems="center" mb={3}>
                <Shield color="#4cc9f0" size={28} style={{ marginRight: 12 }} />
                <Typography variant="h5" fontWeight="bold" color={textColor}>
                    Social Media Detox
                </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={3} mb={4}>
                {/* Stat 1: Today's Time */}
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Clock color="#4361ee" size={24} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" fontWeight="bold" color={textColor}>
                        {stats.todayAvoidedMinutes}m
                    </Typography>
                    <Typography variant="body2" color={subTextColor}>
                        Avoided Today
                    </Typography>
                </Box>

                {/* Stat 2: Growth Score */}
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <TrendingUp color="#3a0ca3" size={24} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" fontWeight="bold" color={textColor}>
                        {stats.growthScore}
                    </Typography>
                    <Typography variant="body2" color={subTextColor}>
                        Growth Score
                    </Typography>
                </Box>

                {/* Stat 3: Focus Level */}
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Zap color="#f72585" size={24} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" fontWeight="bold" color={textColor}>
                        Lvl {stats.focusLevel}
                    </Typography>
                    <Typography variant="body2" color={subTextColor}>
                        Focus Master
                    </Typography>
                </Box>
            </Box>

            {/* Level Progress */}
            <Box mb={4}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color={subTextColor}>
                        Next Level Progress
                    </Typography>
                    <Typography variant="body2" color={textColor} fontWeight="bold">
                        {stats.pointsForNextLevel} pts needed
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: 'linear-gradient(90deg, #4361ee, #f72585)'
                        }
                    }}
                />
            </Box>

            {/* Actions */}
            <Typography variant="h6" fontWeight="bold" color={textColor} mb={2}>
                Log Avoidance Time
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                    variant="contained"
                    startIcon={<Clock size={16} />}
                    onClick={() => handleLogMinutes(30)}
                    sx={{
                        bgcolor: '#4cc9f0',
                        color: '#fff',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#4895ef' }
                    }}
                >
                    +30 Mins
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Clock size={16} />}
                    onClick={() => handleLogMinutes(60)}
                    sx={{
                        bgcolor: '#4361ee',
                        color: '#fff',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#3a0ca3' }
                    }}
                >
                    +60 Mins
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Clock size={16} />}
                    onClick={() => handleLogMinutes(120)}
                    sx={{
                        bgcolor: '#7209b7',
                        color: '#fff',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#560bad' }
                    }}
                >
                    +120 Mins
                </Button>
            </Box>
        </Paper>
    );
};

export default GrowthDashboard;
