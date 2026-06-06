import React, { useContext } from 'react';
import { Dialog, DialogContent, Typography, Button, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Bell, Clock, XCircle } from 'lucide-react';
import { AlarmContext } from '../../context/AlarmContext';

const AlarmModal = () => {
    const { ringingAlarm, dismissAlarm, snoozeAlarm } = useContext(AlarmContext);
    const theme = useTheme();

    if (!ringingAlarm) return null;

    return (
        <Dialog
            open={!!ringingAlarm}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                style: {
                    borderRadius: 20,
                    padding: 0,
                    background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }
            }}
        >
            <DialogContent sx={{ textAlign: 'center', py: 5 }}>
                <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                >
                    <Box sx={{
                        width: 80, height: 80, borderRadius: '50%',
                        bgcolor: theme.palette.error.main,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto', mb: 3,
                        boxShadow: `0 0 30px ${theme.palette.error.main}`
                    }}>
                        <Bell size={40} color="white" />
                    </Box>
                </motion.div>

                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {ringingAlarm.time}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    {ringingAlarm.label || "Alarm"}
                </Typography>

                <Box mt={4} display="flex" flexDirection="column" gap={2}>
                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        onClick={dismissAlarm}
                        startIcon={<XCircle />}
                        sx={{ borderRadius: 3, py: 1.5, fontSize: '1.1rem' }}
                    >
                        Stop Alarm
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={snoozeAlarm}
                        startIcon={<Clock />}
                        sx={{ borderRadius: 3, py: 1.5 }}
                    >
                        Snooze 5m
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AlarmModal;
