import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import { Whatshot } from '@mui/icons-material';
import api from '../../api/axiosConfig';
import ModeSelector from './ModeSelector';

const BudgetTracker = ({ refreshTrigger }) => {
    const [status, setStatus] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newLimit, setNewLimit] = useState(60);
    const [loading, setLoading] = useState(false);

    const fetchStatus = async () => {
        try {
            const res = await api.get('/social/budget/status');
            setStatus(res.data);
            setNewLimit(res.data.dailyLimitMinutes);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [refreshTrigger]);

    const handleSaveLimit = async () => {
        setLoading(true);
        try {
            await api.post(`/social/budget/set?minutes=${newLimit}`);
            setOpenDialog(false);
            fetchStatus();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleModeChange = async (newMode) => {
        // Optimistic update
        setStatus(prev => ({ ...prev, controlMode: newMode }));
        try {
            await api.post(`/social/mode/set?mode=${newMode}`);
            fetchStatus();
        } catch (err) {
            console.error(err);
            fetchStatus(); // Revert on error
        }
    };

    if (!status) return <LinearProgress />;

    const progress = Math.min((status.usedMinutes / status.dailyLimitMinutes) * 100, 100);
    const color = status.isOverLimit ? 'error' : 'primary';

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                    Daily Budget
                    {status.currentStreakDays > 0 && (
                        <Chip icon={<Whatshot />} label={`${status.currentStreakDays} Day Streak`} color="warning" size="small" sx={{ ml: 'auto' }} />
                    )}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{status.usedMinutes} mins used</Typography>
                        <Typography variant="body2">{status.dailyLimitMinutes} mins limit</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={progress} color={color} sx={{ height: 10, borderRadius: 5 }} />
                    <Typography variant="caption" color={status.isOverLimit ? 'error' : 'textSecondary'} sx={{ mt: 1, display: 'block' }}>
                        {status.motivationMessage}
                    </Typography>
                </Box>

                <ModeSelector
                    mode={status.controlMode || 'SOFT_CONTROL'}
                    onChange={handleModeChange}
                />

                <Button variant="outlined" size="small" fullWidth onClick={() => setOpenDialog(true)} sx={{ mt: 1 }}>
                    Adjust Limit
                </Button>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Set Daily Limit</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Minutes per day"
                            type="number"
                            fullWidth
                            value={newLimit}
                            onChange={(e) => setNewLimit(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleSaveLimit} disabled={loading}>Save</Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default BudgetTracker;
