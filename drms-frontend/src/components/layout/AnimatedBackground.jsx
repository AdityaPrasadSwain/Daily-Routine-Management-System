import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

const AnimatedBackground = () => {
    const { mode } = useContext(ThemeContext);
    const isDark = mode === 'dark';

    // Theme Config
    const bgGradient = isDark
        ? 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0f0f1a 100%)'
        : 'radial-gradient(circle at 50% 50%, #f0f4ff 0%, #e0e7ff 100%)';

    const orbColor = isDark
        ? 'rgba(255, 255, 255, 0.08)' // White faint orbs for dark mode
        : 'rgba(67, 97, 238, 0.15)'; // Blue faint orbs for light mode

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: bgGradient,
                zIndex: -1,
                overflow: 'hidden',
                transition: 'background 0.5s ease'
            }}
        >
            {/* Animated Background Orbs */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                        y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                    }}
                    transition={{
                        duration: 25 + Math.random() * 15,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        width: 250 + Math.random() * 200,
                        height: 250 + Math.random() * 200,
                        borderRadius: '50%',
                        background: orbColor,
                        filter: 'blur(90px)',
                        zIndex: 0
                    }}
                />
            ))}
        </Box>
    );
};

export default AnimatedBackground;
