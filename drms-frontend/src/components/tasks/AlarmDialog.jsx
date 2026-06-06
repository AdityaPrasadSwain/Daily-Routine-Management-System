import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, RadioGroup, FormControlLabel, Radio, TextField, Box, IconButton, Typography, CircularProgress, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Select, MenuItem, InputLabel } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import Swal from 'sweetalert2';
import api from '../../api/axiosConfig';

const AlarmDialog = ({ open, handleClose, task }) => {
    const [alarms, setAlarms] = useState([]);
    const [remindBefore, setRemindBefore] = useState(15);
    const [alarmSound, setAlarmSound] = useState('default');
    const [voiceType, setVoiceType] = useState('TTS'); // TTS or RECORDED
    const [voiceText, setVoiceText] = useState('Time to check your task!');
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        if (open && task) {
            fetchAlarms();
        }
    }, [open, task]);

    const fetchAlarms = async () => {
        try {
            setFetching(true);
            const response = await api.get(`/tasks/${task.id}/alarms`);
            setAlarms(response.data);
        } catch (error) {
            console.error("Failed to fetch alarms", error);
        } finally {
            setFetching(false);
        }
    };

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            Swal.fire('Error', 'Microphone access denied or not available', 'error');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const handleDeleteRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
    };

    const handlePlayRecording = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    const handleAddAlarm = async () => {
        // Validate
        if (voiceType === 'TTS' && !voiceText.trim()) {
            Swal.fire('Validation', 'Please enter text for voice message', 'warning');
            return;
        }
        if (voiceType === 'RECORDED' && !audioBlob) {
            Swal.fire('Validation', 'Please record a voice message', 'warning');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();

            const requestData = {
                remindBeforeMinutes: remindBefore,
                alarmSound: alarmSound,
                voiceType: voiceType,
                voiceText: voiceType === 'TTS' ? voiceText : null
            };

            formData.append('alarm', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));

            if (voiceType === 'RECORDED' && audioBlob) {
                // Determine extension based on blob type, usually webm for MediaRecorder
                formData.append('file', audioBlob, 'recording.webm');
            }

            // POST to /tasks/{taskId}/alarms
            // Note: Backend endpoint is defined as /api/tasks/{taskId}/alarms in TaskAlarmController
            // Assuming api instance has base URL configured or relative path
            await api.post(`/tasks/${task.id}/alarms`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({
                icon: 'success',
                title: 'Alarm Added!',
                timer: 1000,
                showConfirmButton: false
            });

            // Reset form
            setAudioBlob(null);
            setAudioUrl(null);
            setAlarmSound('default');
            setVoiceType('TTS');
            setVoiceText('Time to check your task!');

            // Refresh list
            fetchAlarms();
        } catch (error) {
            console.error('Failed to set alarm', error);

            // Extract error message from backend
            let errorMessage = 'Failed to set alarm';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 409) {
                errorMessage = 'Cannot create alarm for this task status';
            }

            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAlarm = async (alarmId) => {
        try {
            const result = await Swal.fire({
                title: 'Delete Alarm?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await api.delete(`/tasks/alarms/${alarmId}`);
                fetchAlarms();
                Swal.fire(
                    'Deleted!',
                    'Your alarm has been deleted.',
                    'success'
                )
            }
        } catch (error) {
            console.error("Failed to delete alarm", error);
            Swal.fire('Error', 'Failed to delete alarm', 'error');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Manage Task Alarms</DialogTitle>
            <DialogContent dividers>
                {/* Existing Alarms List */}
                <Box mb={3}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Existing Alarms
                    </Typography>
                    {fetching ? (
                        <Box display="flex" justifyContent="center"><CircularProgress size={20} /></Box>
                    ) : alarms.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            No alarms set for this task.
                        </Typography>
                    ) : (
                        <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                            {alarms.map((alarm) => (
                                <ListItem key={alarm.id} divider>
                                    <ListItemText
                                        primary={`${alarm.remindBeforeMinutes} minutes before`}
                                        secondary={alarm.voiceType === 'TTS' ? `TTS: "${alarm.voiceText}"` : 'Recorded Audio'}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDeleteAlarm(alarm.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Add New Alarm Form */}
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Add New Alarm
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        Remind me before:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        {[5, 15, 30, 60].map(mins => (
                            <Button
                                key={mins}
                                variant={remindBefore === mins ? "contained" : "outlined"}
                                onClick={() => setRemindBefore(mins)}
                                size="small"
                                sx={{ borderRadius: 2 }}
                            >
                                {mins} Min
                            </Button>
                        ))}
                        <TextField
                            type="number"
                            label="Custom"
                            size="small"
                            variant="outlined"
                            sx={{ width: 80 }}
                            value={remindBefore}
                            onChange={(e) => setRemindBefore(parseInt(e.target.value) || 0)}
                        />
                    </Box>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="alarm-sound-label">Alarm Sound</InputLabel>
                        <Select
                            labelId="alarm-sound-label"
                            id="alarm-sound-select"
                            value={alarmSound}
                            label="Alarm Sound"
                            onChange={(e) => setAlarmSound(e.target.value)}
                        >
                            <MenuItem value="default">Default</MenuItem>
                            <MenuItem value="beep">Beep</MenuItem>
                            <MenuItem value="bell">Bell</MenuItem>
                            <MenuItem value="digital">Digital</MenuItem>
                            <MenuItem value="siren">Siren</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>Voice Type:</Typography>
                        <RadioGroup row value={voiceType} onChange={(e) => setVoiceType(e.target.value)}>
                            <FormControlLabel value="TTS" control={<Radio />} label="Text to Speech" />
                            <FormControlLabel value="RECORDED" control={<Radio />} label="Recorded Voice" />
                        </RadioGroup>
                    </FormControl>

                    {voiceType === 'TTS' && (
                        <TextField
                            label="Message to Speak"
                            fullWidth
                            multiline
                            rows={2}
                            value={voiceText}
                            onChange={(e) => setVoiceText(e.target.value)}
                            variant="outlined"
                        />
                    )}

                    {voiceType === 'RECORDED' && (
                        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, textAlign: 'center' }}>
                            {!audioBlob ? (
                                <Box>
                                    <IconButton
                                        color={recording ? "error" : "primary"}
                                        onClick={recording ? handleStopRecording : handleStartRecording}
                                        sx={{ border: '2px solid', p: 2 }}
                                    >
                                        {recording ? <StopIcon /> : <MicIcon />}
                                    </IconButton>
                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                        {recording ? "Recording... (Click to Stop)" : "Click Mic to Record"}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                    <IconButton color="primary" onClick={handlePlayRecording}>
                                        <PlayArrowIcon />
                                    </IconButton>
                                    <Typography variant="body2">Voice Note Recorded</Typography>
                                    <IconButton color="error" onClick={handleDeleteRecording}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button
                    onClick={handleAddAlarm}
                    variant="contained"
                    disabled={loading}
                    startIcon={<AddAlarmIcon />}
                >
                    {loading ? <CircularProgress size={24} /> : 'Add Alarm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlarmDialog;
