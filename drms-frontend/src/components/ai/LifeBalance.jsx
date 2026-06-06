import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { Balance } from '@mui/icons-material';
import api from '../../api/axiosConfig';

const LifeBalance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/ai/life-balance');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <CircularProgress />;

    if (!data || !data.distribution) return null;

    const chartData = Object.keys(data.distribution).map((key, index) => ({
        id: index,
        value: data.distribution[key],
        label: key
    }));

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" display="flex" alignItems="center" gap={1} mb={2}>
                    <Balance /> Life Balance Analysis
                </Typography>

                <Box height={200} display="flex" justifyContent="center">
                    <PieChart
                        series={[
                            {
                                data: chartData,
                                innerRadius: 30,
                                outerRadius: 80,
                                paddingAngle: 5,
                                cornerRadius: 5,
                            },
                        ]}
                        width={400}
                        height={200}
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                    {data.analysis}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LifeBalance;
