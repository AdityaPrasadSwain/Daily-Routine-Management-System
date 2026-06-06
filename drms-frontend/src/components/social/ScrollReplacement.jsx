import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress, Chip, Fade } from '@mui/material';
import { PanTool, Psychology, DirectionsRun } from '@mui/icons-material';
import api from '../../api/axiosConfig';

const ScrollReplacement = () => {
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState(null);
    const [trigger, setTrigger] = useState('bored');

    const triggers = ['Bored', 'Stressed', 'Sad', 'Tired', 'Procrastinating'];

    const getReplacement = async (selectedTrigger) => {
        setLoading(true);
        setTrigger(selectedTrigger);
        try {
            const res = await api.get(`/social/replacement/task?trigger=${selectedTrigger}`);
            setSuggestion(res.data.replacementTask);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                    <PanTool /> Stop Scrolling!
                </Typography>
                <Typography variant="body2" mb={2}>
                    Feeling the urge? Tell me why, and I'll give you a dopamine-friendly alternative.
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {triggers.map(t => (
                        <Chip
                            key={t}
                            label={t}
                            onClick={() => getReplacement(t)}
                            clickable
                            color="default"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }}
                        />
                    ))}
                </Box>

                {loading && <CircularProgress color="inherit" size={24} />}

                {suggestion && !loading && (
                    <Fade in>
                        <Box sx={{ bgcolor: 'rgba(0,0,0,0.1)', p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                                <DirectionsRun /> Do this instead:
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" mt={1}>
                                {suggestion}
                            </Typography>
                        </Box>
                    </Fade>
                )}
            </CardContent>
        </Card>
    );
};

export default ScrollReplacement;
