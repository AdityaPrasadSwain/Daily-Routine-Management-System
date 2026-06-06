import React, { useEffect, useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import api from '../../api/axiosConfig';
import Swal from 'sweetalert2';

const drawerWidth = 260;

const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const checkAlarms = async () => {
            try {
                const response = await api.get('/alarms/active');
                const alarms = response.data;

                if (alarms.length > 0) {
                    alarms.forEach(alarm => {
                        triggerAlarm(alarm);
                    });
                }
            } catch (error) {
                console.error('Error checking alarms', error);
            }
        };

        const interval = setInterval(checkAlarms, 60000); // Check every minute
        checkAlarms(); // Initial check

        return () => clearInterval(interval);
    }, []);

    const triggerAlarm = (alarm) => {
        // Audio Playback
        if (alarm.voiceType === 'TTS' && alarm.voiceText) {
            const utterance = new SpeechSynthesisUtterance(alarm.voiceText);
            window.speechSynthesis.speak(utterance);
        } else if (alarm.voiceType === 'RECORDED' && alarm.voiceFilePath) {
            const apiBase = api.defaults.baseURL || 'http://localhost:8080/api';
            const origin = apiBase.replace(/\/api\/?$/, '');
            const audioPath = alarm.voiceFilePath.startsWith('/uploads/')
                ? alarm.voiceFilePath
                : `/uploads/${alarm.voiceFilePath}`;
            const audio = new Audio(`${origin}${audioPath}`);
            audio.play().catch(e => console.error("Audio play failed", e));
        }

        // Visual Notification
        Swal.fire({
            title: 'Task Reminder! 🔔',
            text: `Time for task: ${alarm.taskTitle}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Dismiss',
            cancelButtonText: 'Snooze'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await api.post(`/alarms/${alarm.id}/dismiss`);
            }
        });
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <TopNavbar onDrawerToggle={handleDrawerToggle} />
            <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    width: { xs: '100%', lg: `calc(100% - ${drawerWidth}px)` },
                    height: '100vh',
                    overflow: 'auto',
                    bgcolor: 'transparent',
                    scrollBehavior: 'smooth',
                    // Custom Scrollbar
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
                    '.dark-mode &::-webkit-scrollbar-thumb': { background: '#475569' },
                    '.dark-mode &::-webkit-scrollbar-thumb:hover': { background: '#64748b' }
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
