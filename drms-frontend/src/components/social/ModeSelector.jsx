import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box, Typography, Tooltip } from '@mui/material';
import { Spa, School, Psychology, Security, SelfImprovement } from '@mui/icons-material';

const ModeSelector = ({ mode, onChange, disabled }) => {

    const handleAlignment = (event, newMode) => {
        if (newMode !== null) {
            onChange(newMode);
        }
    };

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
                Control Mode
            </Typography>
            <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleAlignment}
                aria-label="control mode"
                fullWidth
                size="small"
                color="primary"
                disabled={disabled}
                sx={{ display: 'flex', flexWrap: 'wrap' }}
            >
                <ToggleButton value="SOFT_CONTROL" aria-label="soft control">
                    <Tooltip title="Soft Control: Gentle nudges (Default)">
                        <Spa fontSize="small" sx={{ mr: 1 }} />
                    </Tooltip>
                    Soft
                </ToggleButton>

                <ToggleButton value="STRONG_DISCIPLINE" aria-label="strong discipline">
                    <Tooltip title="Strong Discipline: Strict warnings">
                        <Security fontSize="small" sx={{ mr: 1 }} />
                    </Tooltip>
                    Strict
                </ToggleButton>

                <ToggleButton value="AI_PSYCHOLOGY" aria-label="ai psychology">
                    <Tooltip title="AI Psychology: Deep analysis of motives">
                        <Psychology fontSize="small" sx={{ mr: 1 }} />
                    </Tooltip>
                    Psycho
                </ToggleButton>

                <ToggleButton value="STUDENT_FOCUS" aria-label="student focus">
                    <Tooltip title="Student Focus: Academic reminders">
                        <School fontSize="small" sx={{ mr: 1 }} />
                    </Tooltip>
                    Study
                </ToggleButton>

                <ToggleButton value="SOCIAL_DETOX" aria-label="social detox">
                    <Tooltip title="Social Detox: Minimalist, offline focus">
                        <SelfImprovement fontSize="small" sx={{ mr: 1 }} />
                    </Tooltip>
                    Detox
                </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {mode === 'SOFT_CONTROL' && "Gentle reminders to keep you aware."}
                {mode === 'STRONG_DISCIPLINE' && "Direct feedback when limits are crossed."}
                {mode === 'AI_PSYCHOLOGY' && "Helps you understand WHY you scroll."}
                {mode === 'STUDENT_FOCUS' && "Optimized for exam preparation."}
                {mode === 'SOCIAL_DETOX' && "Encourages complete disconnection."}
            </Typography>
        </Box>
    );
};

export default ModeSelector;
