import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, CircularProgress, TextField } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axios from '../../api/axiosConfig';

const AiInsights = () => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('How can I optimize my daily routine?');

    const fetchInsight = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/ai/insight', {
                params: { query: prompt }
            });
            setInsight(response.data.insight);
        } catch (error) {
            setInsight('Failed to fetch AI insight. Ensure Ollama is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ mt: 3, bgcolor: 'background.paper' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">AI Coach</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask for advice..."
                    />
                    <Button variant="contained" onClick={fetchInsight} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Ask'}
                    </Button>
                </Box>

                {insight && (
                    <Typography variant="body2" sx={{
                        whiteSpace: 'pre-wrap',
                        p: 2,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}>
                        {insight}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default AiInsights;
