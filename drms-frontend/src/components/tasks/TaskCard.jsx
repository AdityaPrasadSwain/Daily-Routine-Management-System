import React, { useState } from 'react';
import { Card, CardContent, Box, Chip, IconButton, Typography, LinearProgress, Menu, MenuItem, ListItemIcon, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { format } from 'date-fns';
import UpdateProgressDialog from './UpdateProgressDialog';
import Swal from 'sweetalert2';
import api from '../../api/axiosConfig';

import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AlarmDialog from './AlarmDialog';
import ReviewModal from './ReviewModal';
import RescheduleModal from './RescheduleModal';
import RateReviewIcon from '@mui/icons-material/RateReview';
import RestoreIcon from '@mui/icons-material/Restore';

const TaskCard = ({ task, onTaskUpdated, onEdit }) => {
    const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
    const [isAlarmDialogOpen, setIsAlarmDialogOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        if (event) event.stopPropagation();
        setAnchorEl(null);
    };

    const handleEdit = (event) => {
        handleMenuClose(event);
        if (onEdit) onEdit(task);
    };

    const handleDelete = async (event) => {
        handleMenuClose(event);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/tasks/${task.id}`);
                    Swal.fire('Deleted!', 'Task has been deleted.', 'success');
                    if (onTaskUpdated) onTaskUpdated();
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete task', 'error');
                }
            }
        });
    };

    const handleProgressClick = (e) => {
        if (e) e.stopPropagation();
        handleMenuClose(e);
        setIsProgressDialogOpen(true);
    };

    const handleAlarmClick = (e) => {
        if (e) e.stopPropagation();
        handleMenuClose(e);
        setIsAlarmDialogOpen(true);
    };

    return (
        <>
            <Card sx={{
                mb: 2,
                position: 'relative',
                '&:hover': { boxShadow: task.status === 'COMPLETED' ? 1 : 3 },
                opacity: task.status === 'COMPLETED' ? 0.85 : 1,
                pointerEvents: task.status === 'COMPLETED' ? 'auto' : 'auto' // Keep menu accessible
            }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip
                            label={task.priority}
                            size="small"
                            color={task.priority === 'HIGH' ? 'error' : task.priority === 'MEDIUM' ? 'warning' : 'success'}
                        />
                        {task.status !== 'COMPLETED' && (
                            <IconButton size="small" onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{task.title}</Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                        {task.description || 'No description'}
                    </Typography>

                    {/* Progress Bar Section - Clickable for TODO and IN_PROGRESS tasks */}
                    <Box
                        sx={{
                            mb: 1,
                            cursor: (task.status === 'TODO' || task.status === 'IN_PROGRESS') ? 'pointer' : 'default',
                            opacity: task.status === 'COMPLETED' ? 0.7 : 1
                        }}
                        onClick={(task.status === 'TODO' || task.status === 'IN_PROGRESS') ? handleProgressClick : undefined}
                        title={(task.status === 'TODO' || task.status === 'IN_PROGRESS') ? "Click to update progress" : "Progress locked"}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">Progress</Typography>
                            <Typography variant="caption" fontWeight="bold">{task.progress || 0}%</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={task.progress || 0}
                            color={task.progress === 100 ? 'success' : 'primary'}
                            sx={{ height: 6, borderRadius: 1 }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Due: {task.plannedEnd || task.dueDate ? format(new Date(task.plannedEnd || task.dueDate), 'MMM dd') : 'No date'}
                        </Typography>

                        <Chip
                            label={task.status}
                            size="small"
                            variant="outlined"
                            color={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'primary' : 'default'}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                    </Box>

                    {/* Review Button for COMPLETED tasks */}
                    {task.status === 'COMPLETED' && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<RateReviewIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log('Review button clicked for task:', task.id);
                                    console.log('Task review status:', task.taskReview);
                                    setIsReviewModalOpen(true);
                                }}
                                disabled={task.taskReview && task.taskReview.id}
                            >
                                {(task.taskReview && task.taskReview.id) ? 'Review Submitted' : 'Review Task'}
                            </Button>
                        </Box>
                    )}
                </CardContent>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* PENDING Status: Keep original behavior */}
                    {task.status === 'PENDING' && (
                        <>
                            <MenuItem onClick={handleEdit}>
                                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                                Edit
                            </MenuItem>
                            <MenuItem onClick={handleProgressClick}>
                                <ListItemIcon><AssessmentIcon fontSize="small" /></ListItemIcon>
                                Set Progress
                            </MenuItem>
                            <MenuItem onClick={handleAlarmClick}>
                                <ListItemIcon><AccessAlarmIcon fontSize="small" /></ListItemIcon>
                                Manage Alarms
                            </MenuItem>
                            <MenuItem onClick={() => { handleMenuClose(); setIsRescheduleModalOpen(true); }}>
                                <ListItemIcon><RestoreIcon fontSize="small" /></ListItemIcon>
                                Reschedule 🔁
                            </MenuItem>
                            <MenuItem onClick={() => { handleMenuClose(); if (onEdit) onEdit(task, 'FOCUS'); }}>
                                <ListItemIcon><AccessAlarmIcon fontSize="small" sx={{ color: 'primary.main' }} /></ListItemIcon>
                                Focus Mode ⏱️
                            </MenuItem>
                            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                                <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                                Delete
                            </MenuItem>
                        </>
                    )}

                    {/* IN_PROGRESS Status: Progress + Time/Focus control (4 actions) */}
                    {task.status === 'IN_PROGRESS' && (
                        <>
                            <MenuItem onClick={handleProgressClick}>
                                <ListItemIcon><AssessmentIcon fontSize="small" /></ListItemIcon>
                                Update Progress
                            </MenuItem>
                            <MenuItem onClick={handleAlarmClick}>
                                <ListItemIcon><AccessAlarmIcon fontSize="small" /></ListItemIcon>
                                Edit Alarm
                            </MenuItem>
                            <MenuItem onClick={() => { handleMenuClose(); if (onEdit) onEdit(task, 'FOCUS'); }}>
                                <ListItemIcon><AccessAlarmIcon fontSize="small" sx={{ color: 'primary.main' }} /></ListItemIcon>
                                Reschedule Focus ⏱️
                            </MenuItem>
                            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                                <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                                Delete Task
                            </MenuItem>
                        </>
                    )}

                    {/* COMPLETED Status: No menu items - handled outside menu */}
                </Menu>
            </Card>

            <UpdateProgressDialog
                open={isProgressDialogOpen}
                handleClose={() => setIsProgressDialogOpen(false)}
                entity={task}
                type="task"
                onProgressUpdated={onTaskUpdated}
            />

            <AlarmDialog
                open={isAlarmDialogOpen}
                handleClose={() => setIsAlarmDialogOpen(false)}
                task={task}
                onAlarmSet={() => {
                    if (onTaskUpdated) onTaskUpdated();
                }}
            />

            <ReviewModal
                open={isReviewModalOpen}
                handleClose={() => setIsReviewModalOpen(false)}
                task={task}
                onReviewSubmitted={onTaskUpdated}
            />

            <RescheduleModal
                open={isRescheduleModalOpen}
                handleClose={() => setIsRescheduleModalOpen(false)}
                taskId={task.id}
                taskTitle={task.title}
                onRescheduled={() => {
                    if (onTaskUpdated) onTaskUpdated();
                }}
            />
        </>
    );
};

export default TaskCard;
