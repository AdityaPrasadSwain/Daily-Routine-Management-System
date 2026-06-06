import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, Tabs, Tab, Grid, Divider, Alert
} from '@mui/material';
import {
    Psychology, Assignment, Assessment, AccessAlarm,
    AutoAwesome, Spa, TrendingUp
} from '@mui/icons-material';

// Import Sub-Components
import AiCoach from './AiCoach';
import TaskPrioritizer from './TaskPrioritizer';
import LifeBalance from './LifeBalance';
import BurnoutIndicator from './BurnoutIndicator';
import FocusScoreDashboard from './FocusScoreDashboard';
import IdentitySelector from './IdentitySelector';
import RoutineOptimizer from './RoutineOptimizer';

// Import Legacy Features refactored into inline or sub-components (keeping existing logic for Goal/Alarm)
// For brevity in this big file, I will inline the Goal/Alarm/Review logic from previous AiAssistant 
// or simpler: re-implement them as "Classic Features" sections.
import api from '../../api/axiosConfig';
import { TextField, Button, CircularProgress, List, ListItem, ListItemText, Chip } from '@mui/material';
import Swal from 'sweetalert2';
import SocialDashboard from '../social/SocialDashboard';
import { MobileOff } from '@mui/icons-material';

const AiAssistant = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Card sx={{ mt: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Tabs value={activeTab} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary" variant="scrollable" scrollButtons="auto">
                    <Tab icon={<AutoAwesome />} label="Routine Intelligence" />
                    <Tab icon={<Assignment />} label="Task Planner" />
                    <Tab icon={<Psychology />} label="Life Balance" />
                    <Tab icon={<TrendingUp />} label="Productivity Engine" />
                    <Tab icon={<AccessAlarm />} label="Smart Alarms" />
                    <Tab icon={<MobileOff />} label="Digital Detox" />
                </Tabs>
            </Box>

            <CardContent>
                {/* TAB 0: ROUTINE INTELLIGENCE (Coach, Burnout, Reflection) */}
                {activeTab === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <BurnoutIndicator />
                        </Grid>
                        <Grid item xs={12}>
                            <AiCoach />
                        </Grid>
                    </Grid>
                )}

                {/* TAB 1: TASK PLANNER (Top 3, Energy, breakdown) */}
                {activeTab === 1 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                AI-powered tools to manage your workload and energy.
                            </Alert>
                            <TaskPrioritizer />
                            <Divider sx={{ my: 4 }} />
                            <GoalGeneratorSection />
                        </Grid>
                    </Grid>
                )}

                {/* TAB 2: LIFE BALANCE & REVIEW */}
                {activeTab === 2 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <LifeBalance />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DailyReviewSection />
                        </Grid>
                    </Grid>
                )}

                {/* TAB 3: PRODUCTIVITY ENGINE (NEW) */}
                {activeTab === 3 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <FocusScoreDashboard />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <IdentitySelector />
                        </Grid>
                    </Grid>
                )}

                {/* TAB 4: SMART ALARMS */}
                {activeTab === 4 && (
                    <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Smart Alarms adapt to your wake-up history.
                        </Alert>
                        <AlarmSection />
                    </Box>
                )}

                {/* TAB 5: DIGITAL DETOX */}
                {activeTab === 5 && (
                    <SocialDashboard />
                )}

            </CardContent>
        </Card>
    );
};

// --- INLINE SUB-COMPONENTS FOR PREVIOUS FEATURES ---

function GoalGeneratorSection() {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSuggest = async () => {
        setLoading(true);
        try {
            const res = await api.post('/ai/tasks/generate', { goalTitle: title, targetDate: new Date().toISOString().split('T')[0] });
            setResult(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Goal Breakdown</Typography>
            <Box display="flex" gap={2} mb={2}>
                <TextField size="small" fullWidth label="Goal" value={title} onChange={e => setTitle(e.target.value)} />
                <Button variant="contained" onClick={handleSuggest} disabled={loading}>{loading ? <CircularProgress size={20} /> : 'Breakdown'}</Button>
            </Box>
            {result && result.tasks && (
                <List dense>
                    {result.tasks.map((t, i) => (
                        <ListItem key={i}><ListItemText primary={t.title} secondary={t.priority} /></ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}

function DailyReviewSection() {
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(false);

    const getReview = async () => {
        setLoading(true);
        try {
            const res = await api.get('/ai/review/daily');
            setReview(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Daily Review</Typography>
                <Button variant="outlined" fullWidth onClick={getReview} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Generate Today\'s Review'}
                </Button>
                {review && (
                    <Box mt={2}>
                        <CircularProgress variant="determinate" value={review.productivityScore} size={60} />
                        <Typography variant="body1" mt={1}>{review.summary}</Typography>
                        <Typography variant="caption" color="text.secondary">Tip: {review.suggestion || review.improvementSuggestion}</Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

function AlarmSection() {
    const [task, setTask] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const getMsg = async () => {
        setLoading(true);
        try {
            const res = await api.post('/ai/alarms/message', { taskTitle: task, time: '08:00', alarmType: 'MORNING' });
            setMsg(res.data.message);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const checkSmartSilence = async () => {
        try {
            const res = await api.post('/ai/alarms/intelligence');
            Swal.fire({
                title: 'AI Suggestion',
                text: res.data.suggestion,
                icon: 'info',
                confirmButtonText: 'Got it'
            });
        } catch (err) { console.error(err); }
    };

    return (
        <Box>
            <Typography variant="h6">Motivational Alarm</Typography>
            <Box display="flex" gap={2} my={2}>
                <TextField size="small" fullWidth label="Task" value={task} onChange={e => setTask(e.target.value)} />
                <Button variant="contained" onClick={getMsg} disabled={loading}>Generate</Button>
            </Box>
            {msg && <Alert severity="warning">{msg}</Alert>}

            <Divider sx={{ my: 2 }} />

            <Button color="secondary" onClick={checkSmartSilence}>Check Smart Silence</Button>
        </Box>
    );
}

export default AiAssistant;
