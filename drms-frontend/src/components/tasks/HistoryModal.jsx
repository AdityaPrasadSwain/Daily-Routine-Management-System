import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Typography, Box, Chip, Divider } from '@mui/material';
import axios from '../../api/axiosConfig';
import { format } from 'date-fns';

const HistoryModal = ({ open, handleClose, date }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && date) {
            fetchHistory();
        }
    }, [open, date]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // date is a Date object or string? Assuming Date object from FullCalendar or parent
            const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
            const response = await axios.get(`/tasks/history`, {
                params: {
                    date: dateStr,
                    filter: 'DAILY' // Not strictly needed if date is passed, but keeps API happy
                }
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'IN_PROGRESS': return 'info';
            case 'TODO': return 'warning';
            case 'MISSED': return 'error';
            default: return 'default';
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                History for {date ? format(new Date(date), 'MMMM do, yyyy') : ''}
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : tasks.length === 0 ? (
                    <Typography color="text.secondary" align="center">No tasks found for this date.</Typography>
                ) : (
                    <List>
                        {tasks.map((task) => (
                            <React.Fragment key={task.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="subtitle1" component="span" fontWeight="bold">
                                                    {task.title}
                                                </Typography>
                                                <Chip
                                                    label={task.status}
                                                    color={getStatusColor(task.status)}
                                                    size="small"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box mt={1}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {task.description || 'No description'}
                                                </Typography>
                                                {task.completedAt && (
                                                    <Typography variant="caption" display="block" color="success.main" mt={0.5}>
                                                        Completed at: {format(new Date(task.completedAt), 'p')}
                                                    </Typography>
                                                )}
                                                {task.priority && (
                                                    <Typography variant="caption" display="block" color="text.secondary">
                                                        Priority: {task.priority}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default HistoryModal;
