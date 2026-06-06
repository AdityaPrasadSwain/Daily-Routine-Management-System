import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Rating, Button, Container } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from '../../api/axiosConfig';

const History = () => {
    const [filter, setFilter] = useState('WEEKLY');
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, [filter]);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('/tasks/history', {
                params: { filter }
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'IN_PROGRESS': return 'warning';
            case 'TODO': return 'default';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
            {/* Professional Header Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Activity History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Review your completed tasks and track your progress over time
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            sx={{ borderRadius: '10px' }}
                        >
                            <MenuItem value="DAILY">Last 24 Hours</MenuItem>
                            <MenuItem value="WEEKLY">Last 7 Days</MenuItem>
                            <MenuItem value="MONTHLY">Last 30 Days</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        sx={{ borderRadius: '10px' }}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'background.default' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Task</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Review</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No history found
                                    </Typography>
                                    <Typography variant="body2" color="text.disabled">
                                        No tasks found for this time period
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task) => (
                                <TableRow
                                    key={task.id}
                                    sx={{
                                        '&:hover': { bgcolor: 'action.hover' },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {new Date(task.scheduledDate || task.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {task.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {task.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.category}
                                            size="small"
                                            variant="outlined"
                                            sx={{ borderRadius: '6px' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.status}
                                            color={getStatusColor(task.status)}
                                            size="small"
                                            sx={{ borderRadius: '6px', fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {task.reviewRating ? (
                                            <Rating value={task.reviewRating} readOnly size="small" />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">
                                                No review
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {(task.status === 'TODO' || task.status === 'IN_PROGRESS' || task.status === 'MISSED') && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: '8px' }}
                                                onClick={async () => {
                                                    const tomorrow = new Date();
                                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                                    const dateStr = tomorrow.toISOString().split('T')[0];

                                                    try {
                                                        await axios.post(`/tasks/${task.id}/reschedule`, null, {
                                                            params: { newDate: dateStr }
                                                        });
                                                        fetchHistory();
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                            >
                                                Move to Tomorrow
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default History;
