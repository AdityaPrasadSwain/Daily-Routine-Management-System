import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControl, Select, MenuItem, InputLabel, Box, Switch, FormControlLabel, Typography, Divider, Tabs, Tab, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, useMediaQuery, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddAlarmIcon from '@mui/icons-material/AlarmAdd';
import Swal from 'sweetalert2';
import axios from '../../api/axiosConfig';

const TaskModal = ({ open, handleClose, initialDate, onTaskCreated, initialGoalId, taskToEdit, initialScheduledDate }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Basic form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [category, setCategory] = useState('WORK');
    const [plannedStart, setPlannedStart] = useState('');
    const [plannedEnd, setPlannedEnd] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [recurrencePattern, setRecurrencePattern] = useState('');

    // Goal state
    const [goals, setGoals] = useState([]);
    const [goalId, setGoalId] = useState(initialGoalId || '');

    // Alarm state
    const [alarmEnabled, setAlarmEnabled] = useState(false);
    const [remindBeforeMinutes, setRemindBeforeMinutes] = useState(15);
    const [voiceType, setVoiceType] = useState('TTS');
    const [voiceText, setVoiceText] = useState('');
    const [voiceFilePath, setVoiceFilePath] = useState('');

    // Tab and alarm list state
    const [tabValue, setTabValue] = React.useState(0);
    const [localAlarms, setLocalAlarms] = useState([]); // For creating new task
    const [existingAlarms, setExistingAlarms] = useState([]); // For editing task

    // Helper function to handle file upload for recorded audio
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axios.post('/alarms/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setVoiceFilePath(response.data);
            } catch (error) {
                console.error('File upload failed', error);
                Swal.fire('Error', 'Failed to upload audio file', 'error');
            }
        }
    };

    // Fetch goals for the goal dropdown
    const fetchGoals = async () => {
        try {
            const response = await axios.get('/goals');
            setGoals(response.data);
        } catch (error) {
            console.error('Failed to fetch goals', error);
        }
    };

    // Fetch alarms for editing existing task
    const fetchAlarms = async (taskId) => {
        try {
            const response = await axios.get(`/tasks/${taskId}/alarms`);
            setExistingAlarms(response.data);
        } catch (error) {
            console.error('Failed to fetch alarms', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    React.useEffect(() => {
        if (open) {
            fetchGoals();
            if (taskToEdit) {
                // ... existing edit logic
                setTitle(taskToEdit.title);
                setDescription(taskToEdit.description);
                setPriority(taskToEdit.priority);
                setCategory(taskToEdit.category);
                setPlannedStart(taskToEdit.plannedStart ? taskToEdit.plannedStart.slice(0, 16) : '');
                setPlannedEnd(taskToEdit.plannedEnd ? taskToEdit.plannedEnd.slice(0, 16) : '');
                setScheduledDate(taskToEdit.scheduledDate || '');
                setRecurrencePattern(taskToEdit.recurrencePattern || '');
                setGoalId(taskToEdit.goalId || '');

                fetchAlarms(taskToEdit.id);
            } else {
                // Reset form
                setTitle('');
                setDescription('');
                setPriority('MEDIUM');
                setCategory('WORK');
                setPlannedStart('');
                setPlannedEnd('');
                setLocalAlarms([]);
                setExistingAlarms([]);

                // Prioritize explicit string date, then Date obj, then Today
                if (initialScheduledDate) {
                    setScheduledDate(initialScheduledDate);
                } else if (initialDate) {
                    setScheduledDate(initialDate.toISOString().slice(0, 10));
                } else {
                    setScheduledDate(new Date().toISOString().slice(0, 10));
                }

                setRecurrencePattern('');
                setGoalId(initialGoalId || '');
            }
            setTabValue(0);
        }
    }, [open, initialGoalId, taskToEdit, initialDate, initialScheduledDate]);

    const handleSubmit = async () => {
        try {
            const taskData = {
                title,
                description,
                priority,
                category,
                goalId: goalId || null,
                recurrencePattern: recurrencePattern || null,
                dueDate: scheduledDate, // Send the YYYY-MM-DD string directly to match backend LocalDate
                plannedStart: plannedStart ? new Date(plannedStart).toISOString() : null,
                plannedEnd: plannedEnd ? new Date(plannedEnd).toISOString() : null,
            };

            let savedTaskId;
            if (taskToEdit) {
                await axios.put(`/tasks/${taskToEdit.id}`, taskData);
                savedTaskId = taskToEdit.id;
            } else {
                const response = await axios.post('/tasks', taskData);
                savedTaskId = response.data.id;

                // Save local alarms for new task
                for (const alarm of localAlarms) {
                    // API: Multipart/form-data expects 'alarm' part
                    const formData = new FormData();
                    formData.append('alarm', new Blob([JSON.stringify(alarm)], { type: "application/json" }));
                    await axios.post(`/tasks/${savedTaskId}/alarms`, formData);
                }
            }

            onTaskCreated();
            handleClose();
            Swal.fire('Success', `Task ${taskToEdit ? 'updated' : 'created'} successfully`, 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', `Failed to ${taskToEdit ? 'update' : 'create'} task`, 'error');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            fullScreen={fullScreen}
        >
            <DialogTitle>{taskToEdit ? 'Edit Task' : 'Create Task'}</DialogTitle>
            <DialogContent sx={{ pt: 2, minHeight: { xs: 'auto', sm: '400px' } }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="General" />
                    <Tab label="Alarms" />
                </Tabs>

                {tabValue === 0 && (
                    <Box>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Title"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={priority}
                                    label="Priority"
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <MenuItem value="LOW">Low</MenuItem>
                                    <MenuItem value="MEDIUM">Medium</MenuItem>
                                    <MenuItem value="HIGH">High</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={category}
                                    label="Category"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <MenuItem value="WORK">Work</MenuItem>
                                    <MenuItem value="STUDY">Study</MenuItem>
                                    <MenuItem value="HEALTH">Health</MenuItem>
                                    <MenuItem value="PERSONAL">Personal</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                label="Planned Start"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={plannedStart}
                                onChange={(e) => setPlannedStart(e.target.value)}
                                sx={{
                                    '& input::-webkit-calendar-picker-indicator': {
                                        cursor: 'pointer',
                                        filter: 'invert(0.4) sepia(1) saturate(3) hue-rotate(220deg) brightness(0.9)',
                                    }
                                }}
                            />
                            <TextField
                                label="Planned End"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={plannedEnd}
                                onChange={(e) => setPlannedEnd(e.target.value)}
                                sx={{
                                    '& input::-webkit-calendar-picker-indicator': {
                                        cursor: 'pointer',
                                        filter: 'invert(0.4) sepia(1) saturate(3) hue-rotate(220deg) brightness(0.9)',
                                    },
                                    '& input': {
                                        fontWeight: 500
                                    }
                                }}
                            />
                        </Box>
                        <TextField
                            label="Scheduled Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            // Disable past dates
                            inputProps={{
                                min: new Date().toISOString().split('T')[0]
                            }}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Recurrence</InputLabel>
                            <Select
                                value={recurrencePattern}
                                label="Recurrence"
                                onChange={(e) => setRecurrencePattern(e.target.value)}
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="DAILY">Daily</MenuItem>
                                <MenuItem value="WEEKLY">Weekly</MenuItem>
                                <MenuItem value="WEEKDAY">Every Weekday (Mon-Fri)</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Goal (Optional)</InputLabel>
                            <Select
                                value={goalId}
                                label="Goal (Optional)"
                                onChange={(e) => setGoalId(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {goals.map((goal) => (
                                    <MenuItem key={goal.id} value={goal.id}>
                                        {goal.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box>
                        {!plannedStart ? (
                            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                                Please set a Planned Start time in the General tab first.
                            </Typography>
                        ) : (
                            <>
                                <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>Add New Alarm</Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Remind Before</InputLabel>
                                            <Select
                                                value={remindBeforeMinutes}
                                                label="Remind Before"
                                                onChange={(e) => setRemindBeforeMinutes(e.target.value)}
                                            >
                                                <MenuItem value={5}>5 minutes</MenuItem>
                                                <MenuItem value={10}>10 minutes</MenuItem>
                                                <MenuItem value={15}>15 minutes</MenuItem>
                                                <MenuItem value={30}>30 minutes</MenuItem>
                                                <MenuItem value={60}>1 hour</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Voice Type</InputLabel>
                                            <Select
                                                value={voiceType}
                                                label="Voice Type"
                                                onChange={(e) => setVoiceType(e.target.value)}
                                            >
                                                <MenuItem value="TTS">Text-to-Speech</MenuItem>
                                                <MenuItem value="RECORDED">Recorded Audio</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    {voiceType === 'TTS' && (
                                        <TextField
                                            label="Voice Text"
                                            fullWidth
                                            size="small"
                                            multiline
                                            rows={2}
                                            value={voiceText}
                                            onChange={(e) => setVoiceText(e.target.value)}
                                            placeholder="Enter text..."
                                            sx={{ mb: 2 }}
                                        />
                                    )}
                                    {voiceType === 'RECORDED' && (
                                        <Box sx={{ mb: 2 }}>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                onChange={handleFileChange}
                                                style={{ fontSize: '0.9rem' }}
                                            />
                                            {voiceFilePath && (
                                                <Typography variant="caption" display="block" color="success.main">
                                                    Uploaded: {voiceFilePath}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    <Button
                                        variant="outlined"
                                        startIcon={<AddAlarmIcon />}
                                        fullWidth
                                        onClick={async () => {
                                            const newAlarm = {
                                                remindBeforeMinutes,
                                                voiceType,
                                                voiceText,
                                                voiceFilePath
                                            };
                                            if (taskToEdit) {
                                                try {
                                                    // API: Multipart/form-data expects 'alarm' part
                                                    const formData = new FormData();
                                                    formData.append('alarm', new Blob([JSON.stringify(newAlarm)], { type: "application/json" }));
                                                    // Note: File is already uploaded separately, so we just send the path in JSON
                                                    await axios.post(`/tasks/${taskToEdit.id}/alarms`, formData);
                                                    fetchAlarms(taskToEdit.id);
                                                    setVoiceText('');
                                                    setVoiceFilePath('');
                                                    Swal.fire('Success', 'Alarm added', 'success');
                                                } catch (err) {
                                                    console.error(err);
                                                    Swal.fire('Error', 'Failed to add alarm', 'error');
                                                }
                                            } else {
                                                setLocalAlarms([...localAlarms, newAlarm]);
                                                setVoiceText('');
                                                setVoiceFilePath('');
                                            }
                                        }}
                                    >
                                        Add Alarm
                                    </Button>
                                </Box>

                                <List dense>
                                    {(taskToEdit ? existingAlarms : localAlarms).map((alarm, index) => (
                                        <ListItem
                                            key={index}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={async () => {
                                                    if (taskToEdit) {
                                                        try {
                                                            await axios.delete(`/tasks/alarms/${alarm.id}`); // Check ID usage
                                                            fetchAlarms(taskToEdit.id);
                                                        } catch (err) {
                                                            console.error(err);
                                                        }
                                                    } else {
                                                        setLocalAlarms(localAlarms.filter((_, i) => i !== index));
                                                    }
                                                }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={`${alarm.remindBeforeMinutes} min before`}
                                                secondary={alarm.voiceType === 'TTS' ? `TTS: ${alarm.voiceText || 'Default'}` : 'Recorded Audio'}
                                            />
                                        </ListItem>
                                    ))}
                                    {(taskToEdit ? existingAlarms : localAlarms).length === 0 && (
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            No alarms set.
                                        </Typography>
                                    )}
                                </List>
                            </>
                        )}
                    </Box>
                )}

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">{taskToEdit ? 'Save Changes' : 'Create'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskModal;
