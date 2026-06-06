import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress, Alert, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { AutoAwesome, Lightbulb, Spa } from '@mui/icons-material';
import api from '../../api/axiosConfig';

const AiCoach = () => {
    const [loading, setLoading] = useState(false);
    const [routineData, setRoutineData] = useState(null);
    const [reflection, setReflection] = useState(null);

    const fetchCoaching = async () => {
        setLoading(true);
        try {
            const res = await api.get('/ai/routine/coach');
            setRoutineData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReflection = async () => {
        try {
            const res = await api.get('/ai/reflection/question');
            setReflection(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReflection();
    }, []);

    return (
        <Box>
            {reflection && (
                <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.dark', color: 'primary.contrastText' }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Spa fontSize="small" />
                        <Typography variant="overline">Daily Reflection</Typography>
                    </Box>
                    <Typography variant="h6" fontStyle="italic">"{reflection.question}"</Typography>
                </Paper>
            )}

            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                            <AutoAwesome color="secondary" /> Routine Coach
                        </Typography>
                        <Button variant="outlined" onClick={fetchCoaching} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Analyze Routine'}
                        </Button>
                    </Box>

                    {routineData && (
                        <Box>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold">Best Focus Hours:</Typography>
                                {routineData.bestHours}
                            </Alert>

                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Patterns Detected:</Typography>
                            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                                {routineData.patterns.map((p, i) => (
                                    <Chip key={i} label={p} color="info" variant="outlined" />
                                ))}
                            </Box>

                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f0f9ff', borderColor: '#bae6fd' }}>
                                <Box display="flex" gap={1}>
                                    <Lightbulb color="warning" />
                                    <Typography variant="body1" fontWeight="500">
                                        {routineData.advice}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AiCoach;
