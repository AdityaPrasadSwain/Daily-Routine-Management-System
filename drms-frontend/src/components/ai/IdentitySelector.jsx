import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';
import { Spa, Bolt, Balance, Shield } from '@mui/icons-material';
import api from '../../api/axiosConfig';

const archetypes = [
    { id: 'BALANCED_BUILDER', label: 'Balanced Builder', icon: <Balance />, desc: 'Steady, sustainable growth.' },
    { id: 'HIGH_ACHIEVER', label: 'High Achiever', icon: <Bolt />, desc: 'Maximum efficiency and speed.' },
    { id: 'ESSENTIALIST', label: 'Essentialist', icon: <Spa />, desc: 'Less but better. Focus on core.' },
    { id: 'ZEN_MASTER', label: 'Zen Master', icon: <Shield />, desc: 'Mindfulness and flow state.' },
];

const IdentitySelector = () => {
    const [selected, setSelected] = useState('BALANCED_BUILDER');

    const handleSelect = async (id) => {
        setSelected(id);
        try {
            await api.post(`/ai/productivity/identity?archetype=${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Identity Engine</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Choose your productivity archetype. The AI will adapt its coaching style to match.
                </Typography>

                <Grid container spacing={2}>
                    {archetypes.map((type) => (
                        <Grid item xs={6} md={3} key={type.id}>
                            <Button
                                variant={selected === type.id ? "contained" : "outlined"}
                                fullWidth
                                sx={{ height: '100%', pt: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
                                onClick={() => handleSelect(type.id)}
                            >
                                {type.icon}
                                <Box>
                                    <Typography variant="subtitle2">{type.label}</Typography>
                                    <Typography variant="caption" display="block" sx={{ lineHeight: 1.2, mt: 0.5, opacity: 0.8 }}>
                                        {type.desc}
                                    </Typography>
                                </Box>
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default IdentitySelector;
