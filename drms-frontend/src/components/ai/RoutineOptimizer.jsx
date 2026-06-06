import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemIcon, ListItemText, CircularProgress, Alert } from '@mui/material';
import { AutoFixHigh, CheckCircle } from '@mui/icons-material';
import api from '../../api/axiosConfig';

const RoutineOptimizer = () => {
    const [suggestions, setSuggestions] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOptimize = async () => {
        setLoading(true);
        try {
            const res = await api.post('/ai/productivity/routine/optimize');
            setSuggestions(res.data.suggestions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Routine Auto-Optimizer</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    AI analyzes your last 7 days to suggest improvements.
                </Typography>

                {!suggestions ? (
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AutoFixHigh />}
                        onClick={handleOptimize}
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Optimize My Routine'}
                    </Button>
                ) : (
                    <List>
                        {suggestions.map((sug, i) => (
                            <ListItem key={i}>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText primary={sug} />
                            </ListItem>
                        ))}
                    </List>
                )}

                {suggestions && (
                    <Button sx={{ mt: 2 }} variant="text" onClick={() => setSuggestions(null)}>
                        Run Again
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default RoutineOptimizer;
