import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Paper, Grid, TextField, Button,
    ToggleButton, ToggleButtonGroup, Card, CardContent, CircularProgress,
    Fade, Chip, Stack, useTheme, Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import Battery0BarIcon from '@mui/icons-material/Battery0Bar';
import Battery5BarIcon from '@mui/icons-material/Battery5Bar';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import api from '../../api/axiosConfig';

const moodIcons = [
    { value: 'VERY_BAD', icon: <SentimentVeryDissatisfiedIcon sx={{ fontSize: 48 }} />, label: 'Rough', color: '#ef4444' },
    { value: 'BAD', icon: <SentimentDissatisfiedIcon sx={{ fontSize: 48 }} />, label: 'Bad', color: '#f97316' },
    { value: 'NEUTRAL', icon: <SentimentSatisfiedIcon sx={{ fontSize: 48 }} />, label: 'Okay', color: '#eab308' },
    { value: 'GOOD', icon: <SentimentSatisfiedAltIcon sx={{ fontSize: 48 }} />, label: 'Good', color: '#22c55e' },
    { value: 'VERY_GOOD', icon: <SentimentVerySatisfiedIcon sx={{ fontSize: 48 }} />, label: 'Great', color: '#3b82f6' },
];

const ReviewPage = () => {
    const theme = useTheme();
    const [mood, setMood] = useState('NEUTRAL');
    const [energy, setEnergy] = useState('MEDIUM');
    const [wentWell, setWentWell] = useState('');
    const [difficulties, setDifficulties] = useState('');
    const [improveTomorrow, setImproveTomorrow] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        checkTodayReview();
    }, []);

    const checkTodayReview = async () => {
        try {
            const res = await api.get('/reviews/daily/today');
            if (res.status === 200 && res.data) {
                setHasSubmitted(true);
            }
        } catch (e) {
            // No review for today
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                date: new Date().toISOString().split('T')[0],
                mood,
                energyLevel: energy,
                wentWell,
                difficulties,
                improveTomorrow
            };
            await api.post('/reviews/daily', payload);
            setHasSubmitted(true);
            Swal.fire({
                title: 'Review Saved!',
                text: 'Great job reflecting on your day.',
                icon: 'success',
                confirmButtonColor: theme.palette.primary.main
            });
        } catch (e) {
            Swal.fire('Error', 'Failed to save review.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
            {/* Header Section */}
            <Box sx={{ mb: 5, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" sx={{ background: 'linear-gradient(45deg, #3b82f6, #ec4899)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                    Daily Review
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Pause. Reflect. Reset.
                </Typography>
                <StreakBadge />
            </Box>

            {!hasSubmitted ? (
                <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', mb: 4 }}>

                        {/* Section 1: Mood & Energy */}
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, color: 'text.primary' }}>
                            1. How are you feeling today?
                        </Typography>

                        <Box sx={{ mb: 6 }}>
                            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
                                {moodIcons.map((m) => (
                                    <Box
                                        key={m.value}
                                        onClick={() => setMood(m.value)}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            opacity: mood === m.value ? 1 : 0.5,
                                            transform: mood === m.value ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': { opacity: 0.8, transform: 'scale(1.05)' }
                                        }}
                                    >
                                        <Box sx={{ color: m.color, mb: 1 }}>{m.icon}</Box>
                                        <Typography variant="caption" fontWeight="bold" color={mood === m.value ? 'text.primary' : 'text.secondary'}>
                                            {m.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>

                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom align="center" sx={{ mb: 2 }}>
                                Energy Level
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ToggleButtonGroup
                                    value={energy}
                                    exclusive
                                    onChange={(e, val) => val && setEnergy(val)}
                                    aria-label="energy"
                                    sx={{ bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2 }}
                                >
                                    <ToggleButton value="LOW" sx={{ px: 3, py: 1.5 }}>
                                        <Battery0BarIcon sx={{ mr: 1, color: 'error.main' }} /> Low
                                    </ToggleButton>
                                    <ToggleButton value="MEDIUM" sx={{ px: 3, py: 1.5 }}>
                                        <Battery5BarIcon sx={{ mr: 1, color: 'warning.main', transform: 'rotate(90deg)' }} /> Medium
                                    </ToggleButton>
                                    <ToggleButton value="HIGH" sx={{ px: 3, py: 1.5 }}>
                                        <Battery5BarIcon sx={{ mr: 1, color: 'success.main' }} /> High
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Section 2: Reflection */}
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, color: 'text.primary' }}>
                            2. Quick Reflection
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="What went well today?"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={wentWell}
                                    onChange={(e) => setWentWell(e.target.value)}
                                    placeholder="Small wins, happy moments, achievements..."
                                    variant="outlined"
                                    sx={{ bgcolor: 'background.paper' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="What was difficult?"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={difficulties}
                                    onChange={(e) => setDifficulties(e.target.value)}
                                    placeholder="Stressors, blockers, negative emotions..."
                                    variant="outlined"
                                    sx={{ bgcolor: 'background.paper' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="One thing to improve tomorrow?"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={improveTomorrow}
                                    onChange={(e) => setImproveTomorrow(e.target.value)}
                                    placeholder="Actionable step for a better day..."
                                    variant="outlined"
                                    sx={{ bgcolor: 'background.paper' }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 5, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                                sx={{
                                    borderRadius: 3,
                                    px: 6,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                                    boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.5)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px 0 rgba(139, 92, 246, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                {loading ? 'Saving...' : 'Complete Review'}
                            </Button>
                        </Box>

                    </Paper>
                </Box>
            ) : (
                <Fade in={true}>
                    <Paper elevation={0} sx={{ p: 6, borderRadius: 4, textAlign: 'center', bgcolor: 'success.soft', border: '1px solid', borderColor: 'success.light' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'success.main', color: 'white' }}>
                                <SentimentVerySatisfiedIcon sx={{ fontSize: 60 }} />
                            </Box>
                        </Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="success.dark">
                            Review Complete!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            You've logged your day. Sleep well and recharge for tomorrow!
                        </Typography>
                        <Button variant="outlined" color="success" onClick={() => window.location.href = '/dashboard'}>
                            Return to Dashboard
                        </Button>
                    </Paper>
                </Fade>
            )}

            <Box sx={{ mt: 8 }}>
                <Divider sx={{ mb: 4 }}><Chip label="Weekly Insights" /></Divider>
                <WeeklyReportSection />
            </Box>

        </Container>
    );
};

const WeeklyReportSection = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canGenerate, setCanGenerate] = useState(true);

    useEffect(() => {
        fetchLatestReport();
    }, []);

    const fetchLatestReport = async () => {
        try {
            const res = await api.get('/reviews/weekly/latest');
            if (res.status === 200 && res.data) {
                setReport(res.data);
            }
        } catch (e) {
            // No report found
        }
    };

    const generateReport = async () => {
        setLoading(true);
        try {
            const res = await api.post('/reviews/weekly/generate');
            if (res.status === 200 && res.data) {
                setReport(res.data);
                Swal.fire('Weekly Review Ready', 'Your insights have been generated!', 'success');
            } else {
                Swal.fire('Not enough data', 'Keep logging your daily reviews to unlock weekly insights!', 'info');
                setCanGenerate(false);
            }
        } catch (e) {
            Swal.fire('Error', 'Could not generate report.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!report) {
        return (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.default', border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
                <AutoAwesomeIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Unlock Weekly Insights
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Generate a summary of your week to see mood trends and actionable advice.
                </Typography>
                <Button
                    variant="contained"
                    onClick={generateReport}
                    disabled={!canGenerate || loading}
                    startIcon={<AutoAwesomeIcon />}
                    sx={{ borderRadius: 2 }}
                >
                    {loading ? 'Generating...' : 'Generate Report'}
                </Button>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AutoAwesomeIcon sx={{ color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                    Weekly Review & Insights
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Mood Trend</Typography>
                        <Typography variant="h6" fontWeight="bold" color={report.moodTrend === 'IMPROVING' ? 'success.main' : 'warning.main'}>
                            {report.moodTrend}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Avg Mood</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {report.averageMoodScore.toFixed(1)} / 5.0
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Total Logs</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {report.totalEntries}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Smart Insights</Typography>
            <Grid container spacing={2}>
                {report.insights.map((insight) => (
                    <Grid item xs={12} key={insight.id}>
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'start' }}>
                                    <LightbulbIcon color="warning" sx={{ mr: 2, mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {insight.type.replace('_', ' ')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {insight.message}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

const StreakBadge = () => {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        api.get('/reviews/streak').then(res => setStreak(res.data)).catch(err => console.error(err));
    }, []);

    if (streak === 0) return null;

    return (
        <Chip
            icon={<Box component="span" sx={{ fontSize: '1.2rem' }}>🔥</Box>}
            label={`${streak} Day Streak!`}
            color="warning"
            sx={{ mt: 2, fontWeight: 'bold' }}
        />
    );
};

const WeeklyInsights = ({ moodIcons }) => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/reviews/weekly-summary');
                setStats(res.data);
            } catch (e) {
                console.error("Failed to load weekly stats", e);
            }
        };
        fetchStats();
    }, []);

    if (!stats.length) return <Typography color="text.secondary">No reviews this week yet. Start today!</Typography>;

    return (
        <Grid container spacing={2}>
            {stats.map((day) => (
                <Grid item xs={12} sm={6} md={4} key={day.id}>
                    <Paper sx={{ p: 2, borderRadius: '16px', bgcolor: '#f8fafc' }}>
                        <Typography variant="caption" color="text.secondary">
                            {format(new Date(day.date), 'EEEE, MMM do')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Box sx={{ mr: 1 }}>
                                {moodIcons.find(m => m.value === day.mood)?.icon}
                            </Box>
                            <Typography variant="body2" fontWeight="bold">
                                {day.mood}
                            </Typography>
                        </Box>
                        {day.suggestedAction && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic', color: 'primary.main' }}>
                                "{day.suggestedAction}"
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default ReviewPage;
