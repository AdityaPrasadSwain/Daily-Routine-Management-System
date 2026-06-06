import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Alert, Button } from '@mui/material';
import { BatteryAlert, BatteryFull, LocalHospital } from '@mui/icons-material';
import api from '../../api/axiosConfig';

const BurnoutIndicator = () => {
    const [status, setStatus] = useState(null);

    const checkBurnout = async () => {
        try {
            const res = await api.get('/ai/burnout/status');
            setStatus(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        checkBurnout();
    }, []);

    if (!status) return null;

    const isHighRisk = status.riskLevel === 'HIGH';
    const color = isHighRisk ? 'error' : status.riskLevel === 'MEDIUM' ? 'warning' : 'success';

    return (
        <Card sx={{ borderLeft: 6, borderColor: `${color}.main` }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                        {isHighRisk ? <BatteryAlert color="error" /> : <BatteryFull color="success" />}
                        Burnout Risk: {status.riskLevel}
                    </Typography>
                    {isHighRisk && <Chip label="Recovery Mode Active" color="error" icon={<LocalHospital />} />}
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={isHighRisk ? 90 : status.riskLevel === 'MEDIUM' ? 50 : 20}
                    color={color}
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                />

                <Alert severity={isHighRisk ? 'error' : 'info'}>
                    {status.suggestion}
                </Alert>
            </CardContent>
        </Card>
    );
};

export default BurnoutIndicator;
