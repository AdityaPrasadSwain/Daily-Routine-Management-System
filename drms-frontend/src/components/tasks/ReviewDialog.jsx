import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Rating, TextField, Box, Typography } from '@mui/material';
import api from '../../api/axiosConfig';

const ReviewDialog = ({ open, handleClose, task, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        if (!task) return;
        try {
            await api.post('/reviews', {
                taskId: String(task.id),
                rating,
                comment,
                completionStatus: 'COMPLETED'
            });
            onReviewSubmit();
            handleClose();
        } catch (error) {
            console.error("Failed to submit review", error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Review Task: {task?.title}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                    <Typography component="legend">Rate your focus/performance</Typography>
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        size="large"
                    />
                </Box>
                <TextField
                    autoFocus
                    margin="dense"
                    id="comment"
                    label="Comments (What went well? What didn't?)"
                    type="text"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Skip</Button>
                <Button onClick={handleSubmit} variant="contained">Submit Review</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewDialog;
