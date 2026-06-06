import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Slider, MenuItem, Select, FormControl, InputLabel, Alert, CircularProgress } from '@mui/material';
import { Save, Insights } from '@mui/icons-material';
import api from '../../api/axiosConfig';

const UsageLogger = ({ onLogSubmit }) => {
    const [minutes, setMinutes] = useState(30);
    const [moodBefore, setMoodBefore] = useState('BORED');
    const [moodAfter, setMoodAfter] = useState('GUILTY');
    const [trigger, setTrigger] = useState('BOREDOM');
    const [productivity, setProductivity] = useState(5);
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                minutesSpent: minutes,
                moodBefore,
                moodAfter,
                triggerType: trigger,
                productivityImpact: productivity,
                generateAiInsight: true
            };
            const res = await api.post('/social/awareness/log', payload);
            setInsight(res.data.aiInsight);
            if (onLogSubmit) onLogSubmit();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                    <Insights color="primary" /> Awareness Logger
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                        <Typography gutterBottom>Time Spent: {minutes} mins</Typography>
                        <Slider
                            value={minutes}
                            onChange={(e, v) => setMinutes(v)}
                            min={5} max={180} step={5}
                            valueLabelDisplay="auto"
                        />
                    </Box>

                    <Box display="flex" gap={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Mood Before</InputLabel>
                            <Select value={moodBefore} label="Mood Before" onChange={e => setMoodBefore(e.target.value)}>
                                <MenuItem value="BORED">Bored</MenuItem>
                                <MenuItem value="STRESSED">Stressed</MenuItem>
                                <MenuItem value="TIRED">Tired</MenuItem>
                                <MenuItem value="ANXIOUS">Anxious</MenuItem>
                                <MenuItem value="HAPPY">Happy</MenuItem>
                                <MenuItem value="NEUTRAL">Neutral</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                            <InputLabel>Mood After</InputLabel>
                            <Select value={moodAfter} label="Mood After" onChange={e => setMoodAfter(e.target.value)}>
                                <MenuItem value="GUILTY">Guilty</MenuItem>
                                <MenuItem value="DRAINED">Drained</MenuItem>
                                <MenuItem value="INSPIRED">Inspired</MenuItem>
                                <MenuItem value="DISTRACTED">Distracted</MenuItem>
                                <MenuItem value="HAPPY">Happy</MenuItem>
                                <MenuItem value="NEUTRAL">Neutral</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <FormControl fullWidth size="small">
                        <InputLabel>Trigger</InputLabel>
                        <Select value={trigger} label="Trigger" onChange={e => setTrigger(e.target.value)}>
                            <MenuItem value="BOREDOM">Boredom</MenuItem>
                            <MenuItem value="STRESS">Stress</MenuItem>
                            <MenuItem value="NOTIFICATION">Notification</MenuItem>
                            <MenuItem value="HABIT">Habit / Muscle Memory</MenuItem>
                            <MenuItem value="PROCRASTINATION">Procrastination</MenuItem>
                        </Select>
                    </FormControl>

                    <Box>
                        <Typography gutterBottom>Productivity Impact ({productivity}/10)</Typography>
                        <Slider
                            value={productivity}
                            onChange={(e, v) => setProductivity(v)}
                            min={1} max={10} step={1}
                            marks
                        />
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Log Session
                    </Button>

                    {insight && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold">AI Insight:</Typography>
                            {insight}
                        </Alert>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default UsageLogger;
