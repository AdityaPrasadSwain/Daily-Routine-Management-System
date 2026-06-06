import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import axios from '../../api/axiosConfig';

const RescheduleModal = ({ open, handleClose, taskId, taskTitle, onRescheduled }) => {
    const [newStartTime, setNewStartTime] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!newStartTime) {
            Swal.fire('Error', 'Please select a new start time', 'error');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                newStartTime: newStartTime
                // newEndTime is optional, backend handles duration
            };

            await axios.post(`/tasks/${taskId}/reschedule`, payload);

            Swal.fire({
                icon: 'success',
                title: 'Task Rescheduled',
                text: 'A new copy of the task has been created!',
                timer: 1500,
                showConfirmButton: false
            });

            if (onRescheduled) onRescheduled();
            handleClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to reschedule task', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Reschedule Task: {taskTitle}</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    This will mark the current task as SKIPPED/MISSED and create a new copy for the selected time.
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="New Start Time"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                        sx={{
                            '& input::-webkit-calendar-picker-indicator': {
                                cursor: 'pointer',
                                filter: 'invert(0.4) sepia(1) saturate(3) hue-rotate(220deg) brightness(0.9)',
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RescheduleModal;
