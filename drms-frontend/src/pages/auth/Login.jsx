import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Link, InputAdornment, IconButton, useTheme } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import api from '../../api/axiosConfig';
import { ThemeContext } from '../../context/ThemeContext';

const Login = () => {
    const navigate = useNavigate();
    const { mode } = useContext(ThemeContext);
    const theme = useTheme();
    const isDark = mode === 'dark';

    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    // 3D Tilt Effect Variables
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [0, window.innerHeight], [5, -5]);
    const rotateY = useTransform(x, [0, window.innerWidth], [-5, 5]);

    const handleMouseMove = (event) => {
        x.set(event.clientX);
        y.set(event.clientY);
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!credentials.usernameOrEmail || !credentials.password) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Input',
                text: 'Please enter both username/email and password.',
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: isDark ? '#fff' : '#1e293b'
            });
            return;
        }

        const payload = {
            usernameOrEmail: credentials.usernameOrEmail.trim(),
            password: credentials.password
        };
        console.log("Sending Login Payload:", payload);

        try {
            const response = await api.post('/auth/login', payload);
            console.log("Login Response Data:", response.data);
            localStorage.setItem('token', response.data.accessToken);

            await Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: 'Successfully logged in.',
                timer: 1500,
                showConfirmButton: false,
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: isDark ? '#fff' : '#1e293b',
                iconColor: '#4cc9f0'
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Login Error:", error);
            console.error("Error Response:", error.response?.data);

            let errorMessage = 'Invalid credentials.';
            if (error.response?.status === 400 && error.response?.data) {
                // Handle validation errors (Map<String, String>)
                if (typeof error.response.data === 'object' && !error.response.data.message) {
                    errorMessage = Object.values(error.response.data).join('\n');
                } else {
                    errorMessage = error.response.data.message || JSON.stringify(error.response.data);
                }
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorMessage,
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: isDark ? '#fff' : '#1e293b'
            });
        }
    };

    // Dynamic Styles based on Theme
    const cardBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)';
    const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)';
    const cardShadow = isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 20px 40px -10px rgba(0, 0, 0, 0.1)';
    const textColor = isDark ? '#fff' : '#1e293b';
    const subTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
    const inputBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
    const inputHoverBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    const iconColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

    return (
        <Box
            onMouseMove={handleMouseMove}
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                perspective: 1000
            }}
        >
            <motion.div
                style={{ rotateX, rotateY, z: 100 }}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Box
                    sx={{
                        p: 5,
                        width: '100%',
                        maxWidth: 420,
                        background: cardBg,
                        backdropFilter: 'blur(20px)',
                        borderRadius: 4,
                        border: `1px solid ${cardBorder}`,
                        boxShadow: cardShadow,
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Box textAlign="center" mb={4}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        >
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    mb: 2,
                                    boxShadow: '0 0 20px rgba(67, 97, 238, 0.5)'
                                }}
                            >
                                <LogIn color="white" size={30} />
                            </Box>
                        </motion.div>
                        <Typography variant="h4" fontWeight="800" sx={{ color: textColor, mb: 1 }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" sx={{ color: subTextColor }}>
                            Enter your credentials to access your workspace
                        </Typography>
                    </Box>

                    <form onSubmit={handleLogin}>
                        <Box mb={3}>
                            <TextField
                                fullWidth
                                placeholder="Username or Email"
                                name="usernameOrEmail"
                                value={credentials.usernameOrEmail}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User color={iconColor} size={20} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        color: textColor,
                                        bgcolor: inputBg,
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: inputHoverBg },
                                        '& fieldset': { border: 'none' },
                                        '& input': { color: textColor }
                                    }
                                }}
                            />
                        </Box>

                        <Box mb={4}>
                            <TextField
                                fullWidth
                                placeholder="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color={iconColor} size={20} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ?
                                                    <EyeOff color={iconColor} size={20} /> :
                                                    <Eye color={iconColor} size={20} />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        color: textColor,
                                        bgcolor: inputBg,
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: inputHoverBg },
                                        '& fieldset': { border: 'none' },
                                        '& input': { color: textColor }
                                    }
                                }}
                            />
                            <Box textAlign="right" mt={1}>
                                <Link component={RouterLink} to="/forgot-password" sx={{ color: '#4cc9f0', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                    Forgot Password?
                                </Link>
                            </Box>
                        </Box>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    background: 'linear-gradient(45deg, #4cc9f0 0%, #4361ee 100%)',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 15px rgba(67, 97, 238, 0.4)'
                                }}
                            >
                                Sign In
                            </Button>
                        </motion.div>
                    </form>

                    <Box mt={4} textAlign="center">
                        <Typography variant="body2" sx={{ color: subTextColor }}>
                            New to DRMS?{' '}
                            <Link component={RouterLink} to="/register" sx={{ color: '#4cc9f0', fontWeight: 'bold', textDecoration: 'none' }}>
                                Create Account
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </motion.div>
        </Box>
    );
};

export default Login;
