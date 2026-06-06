import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress, Card, CardContent, List, ListItem, ListItemText, Chip, Divider, Grid } from '@mui/material';
import { FilterList, Bolt } from '@mui/icons-material';
import api from '../../api/axiosConfig';

const TaskPrioritizer = () => {
    const [loadingTop3, setLoadingTop3] = useState(false);
    const [loadingEnergy, setLoadingEnergy] = useState(false);

    const [top3, setTop3] = useState(null);
    const [energyPlan, setEnergyPlan] = useState(null);

    const getTop3 = async () => {
        setLoadingTop3(true);
        try {
            const res = await api.get('/ai/tasks/top3');
            setTop3(res.data.top3Tasks);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingTop3(false);
        }
    };

    const getEnergyPlan = async (level) => {
        setLoadingEnergy(true);
        try {
            const res = await api.post('/ai/tasks/energy-plan', { energyLevel: level });
            setEnergyPlan(res.data.schedule);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingEnergy(false);
        }
    };

    return (
        <Grid container spacing={3}>
            {/* Top 3 Focus */}
            <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                                <FilterList color="primary" /> Decision Fatigue Reducer
                            </Typography>
                            <Button variant="contained" onClick={getTop3} disabled={loadingTop3}>
                                {loadingTop3 ? <CircularProgress size={24} color="inherit" /> : 'Get Top 3'}
                            </Button>
                        </Box>

                        {top3 && (
                            <List>
                                {top3.map((task, i) => (
                                    <React.Fragment key={i}>
                                        <ListItem alignItems="flex-start">
                                            <Box mr={2} mt={0.5}>
                                                <Chip label={`#${i + 1}`} color="error" size="small" />
                                            </Box>
                                            <ListItemText
                                                primary={<Typography variant="subtitle1" fontWeight="bold">Task ID: {task.id}</Typography>}
                                                secondary={task.reason}
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Energy Planner */}
            <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" display="flex" alignItems="center" gap={1} mb={2}>
                            <Bolt color="warning" /> Energy-Based Planner
                        </Typography>

                        <Box display="flex" gap={1} mb={3}>
                            <Button variant="outlined" size="small" onClick={() => getEnergyPlan('MORNING_HIGH')}>Morning Peak</Button>
                            <Button variant="outlined" size="small" onClick={() => getEnergyPlan('EVENING_HIGH')}>Evening Peak</Button>
                        </Box>

                        {loadingEnergy && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}

                        {energyPlan && (
                            <List dense>
                                {energyPlan.map((slot, i) => (
                                    <ListItem key={i}>
                                        <Box width={60} flexShrink={0}>
                                            <Chip label={slot.suggestedTime} size="small" variant="outlined" />
                                        </Box>
                                        <ListItemText
                                            primary={slot.taskId}
                                            secondary={slot.reason}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default TaskPrioritizer;
