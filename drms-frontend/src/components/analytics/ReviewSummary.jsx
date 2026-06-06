import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Chip, CircularProgress } from '@mui/material';
import api from '../../api/axiosConfig';

const ReviewSummary = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/reviews/daily');
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) return <CircularProgress size={20} />;

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Today's Reflections
            </Typography>
            {reviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    No reviews yet specific to today. Review your completed tasks!
                </Typography>
            ) : (
                <List dense>
                    {reviews.map((review) => (
                        <ListItem key={review.id} disableGutters>
                            <ListItemText
                                primary={review.taskTitle}
                                secondary={
                                    <>
                                        <Typography component="span" variant="caption" display="block">
                                            Mood: {review.mood || 'N/A'} • Status: {review.completionStatus || 'N/A'}
                                        </Typography>
                                        {review.comment && (
                                            <Typography component="span" variant="caption" color="text.secondary" noWrap>
                                                "{review.comment}"
                                            </Typography>
                                        )}
                                    </>
                                }
                            />
                            <Chip label={`${review.rating || 0}/5`} size="small" color="primary" variant="outlined" />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default ReviewSummary;
