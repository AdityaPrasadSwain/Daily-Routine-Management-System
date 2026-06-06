import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Alert } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import axios from '../../api/axiosConfig';

const AiSuggestions = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axios.get('/ai/suggestions');
                setSuggestions(response.data);
            } catch (error) {
                console.error("Failed to fetch AI suggestions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    if (loading) return <Typography>Loading AI Insights...</Typography>;

    return (
        <Card sx={{ mt: 3, mb: 3, background: 'linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%)' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AutoAwesomeIcon sx={{ color: 'secondary.main', mr: 1 }} />
                    <Typography variant="h5" fontWeight="bold">AI Routine Insights</Typography>
                </Box>

                {suggestions.length === 0 ? (
                    <Typography>No sufficient data to generate insights yet. Keep tracking your tasks!</Typography>
                ) : (
                    <List>
                        {suggestions.map((suggestion, index) => (
                            <ListItem key={suggestion.id || index}>
                                <ListItemIcon>
                                    <LightbulbIcon color="warning" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={suggestion.suggestion}
                                    secondary={suggestion.category}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default AiSuggestions;
