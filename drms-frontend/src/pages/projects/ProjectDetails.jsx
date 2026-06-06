import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';
import TaskBoard from '../tasks/TaskBoard';


const ProjectDetails = () => {
    const { projectId } = useParams();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const TabPanel = ({ children, value, index, ...other }) => (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Project {projectId}</Typography>
                <Typography color="text.secondary">Project description goes here.</Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="project tabs">
                    <Tab label="Tasks" />
                    <Tab label="Members" />
                    <Tab label="Activity" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <TaskBoard />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Typography variant="h6">Team Members</Typography>
                {/* Members list */}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <Typography variant="h6">Recent Activity</Typography>
                {/* Activity log */}
            </TabPanel>
        </Box>
    );
};

export default ProjectDetails;
