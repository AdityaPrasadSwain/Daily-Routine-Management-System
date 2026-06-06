import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Container, Paper, IconButton, Tooltip, Card, CardContent, Divider, Chip, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../api/axiosConfig';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';
import { format, parseISO, isToday } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';



const RoutinePlanner = () => {
    const [routineData, setRoutineData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollContainerRef = useRef(null);


    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350; // Approx card width
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleWheel = (e) => {
        if (scrollContainerRef.current) {
            // If deltaY is present (vertical scroll), translate to horizontal scroll
            if (e.deltaY !== 0) {
                // Prevent default scrolling only if we are scrolling horizontally 
                // in this specific container. 
                // However, blocking default might block page scroll if needed.
                // Usually for horizontal lists, we just scrollLeft.
                scrollContainerRef.current.scrollLeft += e.deltaY;
            }
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tasks/routine/next-7-days');
            setRoutineData(response.data);
        } catch (error) {
            console.error('Error fetching routine data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setSelectedDate(null);
        setIsTaskModalOpen(true);
    };

    const handleAddTask = (date) => {
        setEditingTask(null);
        // Pass string directly or Today's string
        const dateStr = date || format(new Date(), 'yyyy-MM-dd');
        setSelectedDate(dateStr);
        setIsTaskModalOpen(true);
    };

    const handleTaskUpdated = () => {
        fetchData();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Routine Planner
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Your 7-day outlook. Plan your week effectively.
                    </Typography>
                </Box>
                <TextField
                    placeholder="Search tasks..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        width: { xs: '100%', sm: '300px' },
                        bgcolor: 'background.paper',
                        borderRadius: 2
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Scrollable Container Wrapper with Controls */}
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {/* Left Scroll Button */}
                <IconButton
                    onClick={() => scroll('left')}
                    sx={{
                        position: 'absolute',
                        left: -20,
                        zIndex: 2,
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: { xs: 'none', md: 'flex' }, // Hide on mobile where touch works best
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>

                {/* Horizontal Scroll Area */}
                <Box
                    ref={scrollContainerRef}
                    onWheel={handleWheel}
                    sx={{
                        display: 'flex',
                        gap: 3,
                        overflowX: 'auto',
                        pb: 2, // Padding for scrollbar
                        mx: { xs: 0, md: 2 }, // Margin for buttons
                        scrollBehavior: 'smooth',
                        // Hide scrollbar but keep functionality for clean look (optional, keeping styled one for now)
                        '&::-webkit-scrollbar': { height: '8px' },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '4px' },
                        '&::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
                        '.dark-mode &::-webkit-scrollbar-thumb': { background: '#475569' },
                        '.dark-mode &::-webkit-scrollbar-thumb:hover': { background: '#64748b' }
                    }}
                >
                    {routineData?.dailyGroups?.map((group) => {
                        const isTodayDate = isToday(parseISO(group.date));
                        return (
                            <Box
                                key={group.date}
                                sx={{
                                    minWidth: { xs: '300px', md: '350px' },
                                    flex: '0 0 auto'
                                }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        border: isTodayDate ? '2px solid' : '1px solid',
                                        borderColor: isTodayDate ? 'primary.main' : 'divider',
                                        boxShadow: isTodayDate ? '0 4px 20px rgba(33, 150, 243, 0.15)' : 'none',
                                        bgcolor: isTodayDate ? 'action.hover' : 'background.paper',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: 2 } }}>

                                        {/* Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold" color={isTodayDate ? 'primary' : 'textSecondary'}>
                                                    {format(parseISO(group.date), 'EEEE')}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {format(parseISO(group.date), 'MMM do')}
                                                </Typography>
                                            </Box>
                                            {isTodayDate && <Chip label="TODAY" size="small" color="primary" sx={{ fontWeight: 700, borderRadius: 1 }} />}
                                        </Box>

                                        <Divider sx={{ mb: 2 }} />

                                        {/* Tasks List */}
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            maxHeight: '400px', // Scrollable height
                                            overflowY: 'auto',
                                            pr: 1, // Padding for scrollbar
                                            '&::-webkit-scrollbar': { width: '6px' },
                                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                                            '&::-webkit-scrollbar-thumb': { background: '#e0e0e0', borderRadius: '3px' },
                                            '&::-webkit-scrollbar-thumb:hover': { background: '#bdbdbd' }
                                        }}>
                                            {group.tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                                                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4, fontStyle: 'italic', opacity: 0.7 }}>
                                                    {group.tasks.length === 0 ? "No tasks planned" : "No matches found"}
                                                </Typography>
                                            ) : (
                                                group.tasks
                                                    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    .map(task => (
                                                        <TaskCard
                                                            key={task.id}
                                                            task={task}
                                                            onTaskUpdated={handleTaskUpdated}
                                                            onEdit={handleEditTask}
                                                            compact
                                                        />
                                                    ))
                                            )}
                                        </Box>
                                    </CardContent>

                                    {/* Footer Action */}
                                    <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                                        <Tooltip title={`Add task to ${format(parseISO(group.date), 'EEEE')}`}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleAddTask(group.date)}
                                                sx={{
                                                    width: '100%',
                                                    borderRadius: 2,
                                                    '&:hover': { bgcolor: 'action.hover' }
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Card>
                            </Box>
                        );
                    })}
                </Box>

                {/* Right Scroll Button */}
                <IconButton
                    onClick={() => scroll('right')}
                    sx={{
                        position: 'absolute',
                        right: -20,
                        zIndex: 2,
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: { xs: 'none', md: 'flex' },
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Box>



            <TaskModal
                open={isTaskModalOpen}
                handleClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={handleTaskUpdated}
                taskToEdit={editingTask}
                initialScheduledDate={selectedDate}
            />
        </Container >
    );
};

export default RoutinePlanner;
