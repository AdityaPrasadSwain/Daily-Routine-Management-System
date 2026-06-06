import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Menu, MenuItem, ListItemIcon, LinearProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment'; // For progress
import Swal from 'sweetalert2';
import api from '../../api/axiosConfig';
import UpdateProgressDialog from '../tasks/UpdateProgressDialog';
import { useNavigate } from 'react-router-dom';

const GoalCard = ({ goal, onUpdate }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);

    // For Edit - we might reuse the parent modal or handle it here. 
    // The prompt says "Open existing edit modal". 
    // In Goals.jsx, the modal is local state. We might need to pass an "onEdit" callback.
    // For now, I'll pass onEdit from parent.

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
        if (onUpdate && onUpdate.onEdit) {
            onUpdate.onEdit(goal);
        }
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
                    await api.delete(`/goals/${goal.id}`);
                    Swal.fire('Deleted!', 'Your goal has been deleted.', 'success');
                    if (onUpdate && onUpdate.onRefresh) onUpdate.onRefresh();
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete goal', 'error');
                }
            }
        });
    };

    const handleProgress = (event) => {
        handleMenuClose(event);
        setIsProgressDialogOpen(true);
    };

    const handleCardClick = () => {
        navigate(`/goals/${goal.id}`);
    };

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    position: 'relative'
                }}
                onClick={handleCardClick}
            >
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                    <IconButton size="small" onClick={handleMenuOpen}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                <CardContent sx={{ p: 0 }}>
                    <Box sx={{
                        p: 2,
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)'
                            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ pr: 3, lineHeight: 1.3 }}>
                            {goal.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography variant="caption" sx={{
                                bgcolor: 'background.paper',
                                px: 1,
                                py: 0.5,
                                borderRadius: '4px',
                                border: '1px solid',
                                borderColor: 'divider',
                                fontWeight: 600,
                                color: 'primary.main'
                            }}>
                                {goal.type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {goal.memberCount} members
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ p: 2 }}>
                        <Typography color="text.secondary" sx={{ mb: 3, fontSize: '0.9rem', minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {goal.description}
                        </Typography>

                        <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>Progress</Typography>
                                <Typography variant="caption" fontWeight="bold" color={goal.progress === 100 ? 'success.main' : 'primary.main'}>
                                    {goal.progress || 0}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={goal.progress || 0}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'grey.100',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: goal.progress === 100 ?
                                            'linear-gradient(90deg, #10b981 0%, #34d399 100%)' :
                                            'linear-gradient(90deg, #4f46e5 0%, #818cf8 100%)'
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </CardContent>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                        Edit
                    </MenuItem>
                    <MenuItem onClick={handleProgress}>
                        <ListItemIcon><AssessmentIcon fontSize="small" /></ListItemIcon>
                        Set Progress
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                        Delete
                    </MenuItem>
                </Menu>
            </Card>

            <UpdateProgressDialog
                open={isProgressDialogOpen}
                handleClose={() => setIsProgressDialogOpen(false)}
                entity={goal}
                type="goal"
                onProgressUpdated={() => {
                    if (onUpdate && onUpdate.onRefresh) onUpdate.onRefresh();
                }}
            />
        </>
    );
};

export default GoalCard;
