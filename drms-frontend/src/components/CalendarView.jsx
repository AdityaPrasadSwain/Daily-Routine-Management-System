import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, Paper, useTheme, Typography, Alert, Snackbar } from '@mui/material';
import axios from '../api/axiosConfig';
import HistoryModal from './tasks/HistoryModal';
import TaskModal from './tasks/TaskModal'; // Assuming this is the create modal
import Swal from 'sweetalert2';

import './CalendarView.css'; // We might need some custom CSS

const CalendarView = () => {
    const theme = useTheme();
    const [tasks, setTasks] = useState([]);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedCreateDate, setSelectedCreateDate] = useState(null);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/tasks');
            // Transform tasks to events
            const events = response.data.map(task => ({
                id: task.id,
                title: task.title,
                start: task.scheduledDate || task.plannedStart, // Prefer scheduledDate as main display
                // If it has a time component (plannedStart), use it, otherwise it's all day if just date
                allDay: !task.plannedStart || task.plannedStart.length === 10,
                backgroundColor: getEventColor(task.status, theme),
                borderColor: getEventColor(task.status, theme),
                extendedProps: { ...task }
            }));
            setTasks(events);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    const getEventColor = (status, theme) => {
        switch (status) {
            case 'COMPLETED': return theme.palette.success.main;
            case 'IN_PROGRESS': return theme.palette.info.main;
            case 'MISSED': return theme.palette.error.main;
            default: return theme.palette.primary.main;
        }
    };

    const handleDateClick = (arg) => {
        const clickedDate = new Date(arg.dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Normalize clickedDate to start of day for comparison
        // arg.dateStr from FullCalendar (month view) is YYYY-MM-DD
        const clickedDateOnly = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (clickedDateOnly < todayOnly) {
            // Past Date
            setSelectedHistoryDate(arg.dateStr);
            setHistoryModalOpen(true);
        } else {
            // Today or Future
            setSelectedCreateDate(clickedDateOnly);
            setCreateModalOpen(true);
        }
    };

    const handleEventClick = (info) => {
        const task = info.event.extendedProps;
        const taskDate = new Date(task.scheduledDate || task.plannedStart);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (taskDate < today) {
            Swal.fire({
                title: task.title,
                text: 'This task is in the past and is read-only history.',
                icon: 'info',
                confirmButtonColor: theme.palette.primary.main
            });
        } else {
            // Future enhancement: Edit Modal
            Swal.fire({
                title: task.title,
                text: task.description || 'No description',
                footer: `Status: ${task.status}`,
                confirmButtonText: 'Close'
            });
        }
    };

    const handleTaskCreated = () => {
        fetchTasks();
        setToastMessage('Task created successfully');
        setToastOpen(true);
    };

    function renderEventContent(eventInfo) {
        return (
            <Box sx={{
                px: 1,
                py: 0.5,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#fff'
            }}>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </Box>
        )
    }

    return (
        <Box className="custom-calendar-root" p={3} sx={{
            height: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',

            // --- CSS Variables for Theming ---

            // HEADER TITLE
            '--fc-header-toolbar-title-color': theme.palette.mode === 'dark' ? '#ffffff' : '#000000',

            // INACTIVE BUTTONS (Month/Week/Day when not selected)
            '--fc-button-bg-color': theme.palette.mode === 'dark' ? '#424242' : '#ffffff',
            '--fc-button-text-color': theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            '--fc-button-border-color': theme.palette.mode === 'dark' ? '#616161' : '#e0e0e0',

            // HOVER STATE
            '--fc-button-hover-bg-color': theme.palette.mode === 'dark' ? '#616161' : '#f5f5f5',
            '--fc-button-hover-border-color': theme.palette.mode === 'dark' ? '#757575' : '#bdbdbd',

            // ACTIVE BUTTONS (Selected Tab)
            '--fc-button-active-bg-color': theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2', // Blue
            '--fc-button-active-border-color': theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
            '--fc-button-active-text-color': theme.palette.mode === 'dark' ? '#000000' : '#ffffff', // High contrast on blue

            // EVENTS
            '--fc-event-bg-color': theme.palette.primary.main,
            '--fc-event-border-color': theme.palette.primary.main,

            // TODAY HIGHLIGHT
            '--fc-today-color': '#6366f1', // Custom Purple/Indigo
            '--fc-today-text-color': '#ffffff',
            '--fc-today-bg-color': theme.palette.action.selected,

            // GENERAL TEXT
            '--fc-text-color': theme.palette.text.primary,
            '--fc-page-bg-color': theme.palette.background.paper,
            '--fc-neutral-bg-color': theme.palette.action.hover,
            '--fc-border-color': theme.palette.divider,
        }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
                Smart Calendar
            </Typography>
            <Paper elevation={0} sx={{
                p: 2,
                flexGrow: 1,
                borderRadius: 3,
                boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                border: '1px solid #eee',
                overflow: 'hidden'
            }}>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    events={tasks}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventContent={renderEventContent}
                    height="100%"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day'
                    }}
                    dayCellClassNames={(arg) => {
                        if (arg.date < new Date().setHours(0, 0, 0, 0)) {
                            return 'past-date-cell';
                        }
                        return '';
                    }}
                    dayMaxEvents={true}
                />
            </Paper >

            <HistoryModal
                open={historyModalOpen}
                handleClose={() => setHistoryModalOpen(false)}
                date={selectedHistoryDate}
            />

            <TaskModal
                open={createModalOpen}
                handleClose={() => setCreateModalOpen(false)}
                initialDate={selectedCreateDate}
                onTaskCreated={handleTaskCreated}
            />

            <Snackbar
                open={toastOpen}
                autoHideDuration={6000}
                onClose={() => setToastOpen(false)}
            >
                <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box >
    );
};

export default CalendarView;
