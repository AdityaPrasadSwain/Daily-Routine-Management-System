import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { mode, toggleTheme } = useContext(ThemeContext);

    return (
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
                onClick={toggleTheme}
                color="inherit"
                sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'rotate(180deg)',
                    },
                }}
            >
                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;
