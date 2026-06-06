import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slider, Typography, Box } from '@mui/material';
import axios from '../../api/axiosConfig';
import Swal from 'sweetalert2';

const UpdateProgressDialog = ({ open, handleClose, entity, type = 'task', onProgressUpdated }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (entity) {
            setProgress(entity.progress || 0);
        }
    }, [entity, open]);

    const handleSliderChange = (event, newValue) => {
        setProgress(newValue);
    };

    const handleSubmit = async () => {
        try {
            const endpoint = type === 'goal' ? `/goals/${entity.id}/progress` : `/tasks/${entity.id}/progress`;
            await axios.patch(endpoint, null, {
                params: { progress: progress }
            });
            onProgressUpdated();
            handleClose();
            Swal.fire({
                icon: 'success',
                title: 'Progress Updated',
                text: `${type === 'goal' ? 'Goal' : 'Task'} progress set to ${progress}%`,
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Failed to update progress', error);
            Swal.fire('Error', 'Failed to update progress', 'error');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Update Progress</DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                        {progress}%
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        {progress === 0 && 'Not Started'}
                        {progress > 0 && progress < 100 && 'In Progress'}
                        {progress === 100 && 'Completed'}
                    </Typography>
                </Box>
                <Slider
                    value={progress}
                    onChange={handleSliderChange}
                    aria-label="Progress"
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateProgressDialog;
