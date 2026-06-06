import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, CircularProgress, Fade } from '@mui/material';
import AiInsightCard from './AiInsightCard';
import { fetchDailySuggestions, fetchWeeklySuggestions } from '../../api/aiApi';

const AiInsightList = ({ type = 'DAILY' }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSuggestions();
    }, [type]);

    const loadSuggestions = async () => {
        try {
            setLoading(true);
            let data;
            if (type === 'WEEKLY') {
                data = await fetchWeeklySuggestions();
            } else {
                data = await fetchDailySuggestions();
            }
            // Sort by date desc (if needed, or assume backend order)
            // Assuming backend returns latest first or we reverse
            setSuggestions(data.reverse());
        } catch (err) {
            console.error("Failed to load AI insights", err);
            setError("AI insights will appear after your routine is analyzed.");
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = (id) => {
        // Optimistic UI update
        setSuggestions(prev => prev.filter(s => s.id !== id));
        // Ideally call backend to mark as read/dismissed
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        // Friendly empty state messages are better than errors? 
        // But prompt said "Friendly message" on failure.
        if (suggestions.length === 0) {
            return (
                <Box p={2}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {error || "No insights available yet."}
                    </Typography>
                </Box>
            );
        }
    }

    if (suggestions.length === 0) {
        return (
            <Box p={2}>
                <Typography variant="body2" color="text.secondary" align="center">
                    AI insights will appear after your routine is analyzed.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} px={1}>
                <Typography variant="h6" component="h2">
                    {type === 'WEEKLY' ? 'Weekly Insights' : 'Daily AI Insights'}
                </Typography>
            </Box>

            {suggestions.slice(0, 5).map((suggestion) => (
                <Fade in={true} key={suggestion.id}>
                    <Box>
                        <AiInsightCard suggestion={suggestion} onDismiss={handleDismiss} />
                    </Box>
                </Fade>
            ))}
        </Box>
    );
};

export default AiInsightList;
