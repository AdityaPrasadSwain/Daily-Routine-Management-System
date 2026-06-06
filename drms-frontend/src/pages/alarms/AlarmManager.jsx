import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Switch, IconButton, Fab, Dialog, DialogContent, TextField, MenuItem, Button, Select, FormControl, InputLabel } from '@mui/material';

import { Plus, Trash2, Clock, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axiosConfig';

const AlarmManager = () => {
    const [alarms, setAlarms] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAlarm, setNewAlarm] = useState({
        time: '07:00',
        label: 'Morning Alarm',
        sound: 'digital',
        enabled: true,
        loop: true
    });

    useEffect(() => {
        fetchAlarms();
    }, []);

    const fetchAlarms = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/alarms');
            setAlarms(res.data);
        } catch (err) {
            console.error('Failed to fetch alarms:', err);
            setError(err.response?.data?.message || 'Failed to load alarms. Please ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            // Format the alarm data correctly for backend
            const alarmData = {
                time: newAlarm.time, // Backend expects "HH:mm" format which matches input type="time"
                label: newAlarm.label,
                sound: newAlarm.sound,
                enabled: newAlarm.enabled,
                loop: newAlarm.loop
            };

            await api.post('/alarms', alarmData);
            setOpen(false);
            setError(null);
            fetchAlarms();
        } catch (err) {
            console.error('Failed to create alarm:', err);
            const errorMsg = err.response?.data?.message || err.response?.data || 'Failed to create alarm';
            setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/alarms/${id}`);
            fetchAlarms();
        } catch (err) {
            setError('Failed to delete alarm');
        }
    };

    const handleToggle = async (id) => {
        try {
            await api.patch(`/alarms/${id}/toggle`);
            fetchAlarms();
        } catch (err) {
            setError('Failed to toggle alarm');
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" fontWeight="bold" mb={3}>Alarms</Typography>

            {error && (
                <Box mb={3} p={2} bgcolor="error.light" borderRadius={2}>
                    <Typography color="error.dark">{error}</Typography>
                </Box>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <Typography variant="body1" color="text.secondary">Loading alarms...</Typography>
                </Box>
            ) : alarms.length === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="200px">
                    <Clock size={64} color="#999" style={{ marginBottom: 16 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No alarms yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Click the + button to create your first alarm
                    </Typography>
                </Box>
            ) : (
                <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={3}>
                    {alarms.map((alarm) => (
                        <motion.div key={alarm.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Card sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h3" fontWeight="bold" color={alarm.enabled ? 'text.primary' : 'text.disabled'}>
                                        {alarm.time}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {alarm.label} • {alarm.sound}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Switch checked={alarm.enabled} onChange={() => handleToggle(alarm.id)} />
                                    <IconButton color="error" onClick={() => handleDelete(alarm.id)}>
                                        <Trash2 size={20} />
                                    </IconButton>
                                </Box>
                            </Card>
                        </motion.div>
                    ))}
                </Box>
            )}

            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 30, right: 30 }}
                onClick={() => setOpen(true)}
            >
                <Plus />
            </Fab>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <Typography variant="h5" fontWeight="bold" mb={3} sx={{ px: 3, pt: 3 }}>New Alarm</Typography>
                <DialogContent>
                    <TextField
                        fullWidth type="time" label="Time"
                        value={newAlarm.time}
                        onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Alarm Label"
                        fullWidth
                        value={newAlarm.label}
                        onChange={(e) => setNewAlarm({ ...newAlarm, label: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Sound</InputLabel>
                        <Select
                            value={newAlarm.sound}
                            label="Sound"
                            onChange={(e) => setNewAlarm({ ...newAlarm, sound: e.target.value })}
                        >
                            <MenuItem value="digital">Digital Beep</MenuItem>
                            <MenuItem value="musicbox">Music Box</MenuItem>
                            <MenuItem value="siren">Siren</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" fullWidth size="large" onClick={handleCreate}>
                        Save Alarm
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AlarmManager;
