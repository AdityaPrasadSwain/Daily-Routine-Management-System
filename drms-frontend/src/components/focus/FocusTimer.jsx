import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress, Fab } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import TimerIcon from '@mui/icons-material/Timer'; // Using Timer as icon for FAB if needed, or check available icons
import axios from '../../api/axiosConfig';

const FocusTimer = ({ open, handleClose, task, onSessionComplete }) => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, seconds]);

    const handleStart = () => setIsActive(true);
    const handlePause = () => setIsActive(false);

    const handleStop = async () => {
        setIsActive(false);
        clearInterval(intervalRef.current);

        if (seconds > 0 && task) {
            try {
                await axios.patch(`/tasks/${task.id}/focus`, null, {
                    params: { seconds }
                });
                if (onSessionComplete) onSessionComplete();
            } catch (error) {
                console.error("Failed to save focus session", error);
            }
        }
        setSeconds(0);
        handleClose();
    };

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle align="center">Focus Mode</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {task ? task.title : 'Focus Session'}
                    </Typography>

                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4, mt: 2 }}>
                        <CircularProgress variant="determinate" value={100} size={150} sx={{ color: '#e0e0e0' }} />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h3" component="div" color="text.secondary">
                                {formatTime(seconds)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {!isActive ? (
                            <Fab color="primary" onClick={handleStart}>
                                <PlayArrowIcon />
                            </Fab>
                        ) : (
                            <Fab color="warning" onClick={handlePause}>
                                <PauseIcon />
                            </Fab>
                        )}
                        <Fab color="error" onClick={handleStop}>
                            <StopIcon />
                        </Fab>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setIsActive(false); handleClose(); }}>Minimize</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FocusTimer;
