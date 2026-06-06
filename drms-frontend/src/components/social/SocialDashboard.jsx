import React, { useState } from 'react';
import { Grid, Box, Typography, Alert } from '@mui/material';
import UsageLogger from './UsageLogger';
import BudgetTracker from './BudgetTracker';
import ScrollReplacement from './ScrollReplacement';

const SocialDashboard = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleLogSubmit = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
                Awareness is the first step to freedom. Use this tool to track your digital diet without guilt.
            </Alert>

            <Grid container spacing={3}>
                {/* Emergency Stop Scrolling Section */}
                <Grid item xs={12}>
                    <ScrollReplacement />
                </Grid>

                {/* Left Col: Budget & Stats */}
                <Grid item xs={12} md={6}>
                    <BudgetTracker refreshTrigger={refreshKey} />
                </Grid>

                {/* Right Col: Logger */}
                <Grid item xs={12} md={6}>
                    <UsageLogger onLogSubmit={handleLogSubmit} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default SocialDashboard;
