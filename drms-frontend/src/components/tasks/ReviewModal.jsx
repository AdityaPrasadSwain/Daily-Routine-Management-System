import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, Rating, TextField,
    ToggleButton, ToggleButtonGroup, Slider, Chip
} from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import api from '../../api/axiosConfig';
import Swal from 'sweetalert2';

const customIcons = {
    1: { icon: <SentimentVeryDissatisfiedIcon color="error" />, label: 'TIRED' },
    2: { icon: <SentimentDissatisfiedIcon color="error" />, label: 'STRESSED' },
    3: { icon: <SentimentSatisfiedIcon color="warning" />, label: 'NEUTRAL' },
    4: { icon: <SentimentSatisfiedAltIcon color="success" />, label: 'HAPPY' },
    5: { icon: <SentimentVerySatisfiedIcon color="success" />, label: 'ACCOMPLISHED' },
};

const IconContainer = (props) => {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
};

const ReviewModal = ({ open, handleClose, task, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [moodValue, setMoodValue] = useState(3);
    const [effortLevel, setEffortLevel] = useState('MEDIUM');
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        if (!rating) {
            Swal.fire('Error', 'Please provide a star rating!', 'error');
            return;
        }

        const moodMap = {
            1: 'TIRED',
            2: 'STRESSED',
            3: 'NEUTRAL',
            4: 'HAPPY',
            5: 'ACCOMPLISHED'
        };

        const payload = {
            taskId: String(task.id), // Convert UUID to string
            rating,
            comment,
            effortLevel,
            mood: moodMap[moodValue] || 'NEUTRAL'
        };

        try {
            await api.post('/reviews', payload);
            Swal.fire('Success', 'Review submitted! Great job.', 'success');
            onReviewSubmitted();
            handleClose();
        } catch (error) {
            console.error('Review submission error:', error);
            const errorMsg = error.response?.data?.message || error.response?.data || 'Failed to submit review.';
            Swal.fire('Error', typeof errorMsg === 'string' ? errorMsg : 'Failed to submit review.', 'error');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Review Task</DialogTitle>
            <DialogContent dividers>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {task?.title}
                </Typography>

                {/* Star Rating */}
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="legend">How well did it go?</Typography>
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        size="large"
                    />
                </Box>

                {/* Mood Selection */}
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="legend" gutterBottom>How do you feel?</Typography>
                    <Rating
                        name="highlight-selected-only"
                        value={moodValue}
                        IconContainerComponent={IconContainer}
                        getLabelText={(value) => customIcons[value].label}
                        highlightSelectedOnly
                        onChange={(event, newValue) => {
                            setMoodValue(newValue);
                        }}
                        max={5}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>
                        {customIcons[moodValue]?.label}
                    </Typography>
                </Box>

                {/* Effort Level */}
                <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Effort Level</Typography>
                    <ToggleButtonGroup
                        value={effortLevel}
                        exclusive
                        onChange={(e, newEffort) => {
                            if (newEffort !== null) setEffortLevel(newEffort);
                        }}
                        fullWidth
                        size="small"
                        color="primary"
                    >
                        <ToggleButton value="LOW">Low</ToggleButton>
                        <ToggleButton value="MEDIUM">Medium</ToggleButton>
                        <ToggleButton value="HIGH">High</ToggleButton>
                        <ToggleButton value="VERY_HIGH">Very High</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Comment */}
                <TextField
                    label="Reflection / Notes"
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit Review
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewModal;
