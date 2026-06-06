import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControl, Select, MenuItem, InputLabel, Box, Rating, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import axios from '../../api/axiosConfig';

const TaskReviewModal = ({ open, handleClose, taskId, taskTitle }) => {
    const [completionStatus, setCompletionStatus] = useState('COMPLETED');
    const [effortRating, setEffortRating] = useState(3);
    const [mood, setMood] = useState('NORMAL');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && taskId) {
            fetchExistingReview();
        }
    }, [open, taskId]);

    const fetchExistingReview = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/reviews/task/${taskId}`);
            const review = response.data;
            if (review) {
                setCompletionStatus(review.completionStatus || 'COMPLETED');
                setEffortRating(review.rating || 3);
                setMood(review.mood || 'NORMAL');
                setComment(review.comment || '');
            }
        } catch (error) {
            // If 404, it means no review yet, which is fine
            if (error.response && error.response.status !== 404) {
                console.error('Failed to fetch review', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const effortLevel =
                effortRating <= 2 ? 'LOW' : effortRating === 3 ? 'MEDIUM' : effortRating === 4 ? 'HIGH' : 'VERY_HIGH';
            const payload = {
                taskId: String(taskId),
                rating: effortRating,
                comment,
                effortLevel,
                mood,
                completionStatus
            };

            await axios.post(`/reviews`, payload);

            Swal.fire({
                icon: 'success',
                title: 'Review Saved',
                text: 'Great job reflecting on your task!',
                timer: 1500,
                showConfirmButton: false
            });
            handleClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to save review', 'error');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Review Task: {taskTitle}</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography component="legend">Effort Rating</Typography>
                    <Rating
                        name="effort-rating"
                        value={effortRating}
                        onChange={(event, newValue) => {
                            setEffortRating(newValue);
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={completionStatus}
                            label="Status"
                            onChange={(e) => setCompletionStatus(e.target.value)}
                        >
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                            <MenuItem value="PARTIALLY_COMPLETED">Partially Completed</MenuItem>
                            <MenuItem value="SKIPPED">Skipped</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Mood</InputLabel>
                        <Select
                            value={mood}
                            label="Mood"
                            onChange={(e) => setMood(e.target.value)}
                        >
                            <MenuItem value="ENERGETIC">Energetic ⚡</MenuItem>
                            <MenuItem value="NORMAL">Normal 🙂</MenuItem>
                            <MenuItem value="TIRED">Tired 😴</MenuItem>
                            <MenuItem value="STRESSED">Stressed 😫</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TextField
                    label="Notes / Reflections"
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="What went well? Why did you skip? Any distractions?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save Review
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskReviewModal;
