import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Link, InputAdornment, IconButton, useTheme } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Upload, UserPlus } from 'lucide-react';
import api from '../../api/axiosConfig';
import { ThemeContext } from '../../context/ThemeContext';

const Register = () => {
    const navigate = useNavigate();
    const { mode } = useContext(ThemeContext);
    const theme = useTheme();
    const isDark = mode === 'dark';

    const [formData, setFormData] = useState({
        name: '', // Changed from fullName
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        profilePhoto: null
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [0, window.innerHeight], [5, -5]);
    const rotateY = useTransform(x, [0, window.innerWidth], [-5, 5]);

    const handleMouseMove = (event) => {
        x.set(event.clientX);
        y.set(event.clientY);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profilePhoto') {
            setFormData({ ...formData, profilePhoto: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Mismatch',
                text: 'Passwords do not match',
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: isDark ? '#fff' : '#1e293b'
            });
            return;
        }

        try {
            const registerResponse = await api.post('/auth/register', {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // Auto-login to upload photo
            const loginResponse = await api.post('/auth/login', {
                usernameOrEmail: formData.username,
                password: formData.password
            });
            const token = loginResponse.data.accessToken;

            if (formData.profilePhoto) {
                const photoData = new FormData();
                photoData.append('file', formData.profilePhoto);
                await api.post('/users/photo', photoData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            await Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'Account created! Redirecting to login...',
                timer: 2000,
                showConfirmButton: false,
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: isDark ? '#fff' : '#1e293b',
                iconColor: '#4cc9f0'
            });
            navigate('/login');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.message || 'Something went wrong!',
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

    const inputInputStyles = {
        color: textColor,
        bgcolor: inputBg,
        borderRadius: 2,
        '&:hover': { bgcolor: inputHoverBg },
        '& fieldset': { border: 'none' },
        '& input': { color: textColor }
    };

    return (
        <Box
            onMouseMove={handleMouseMove}
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                perspective: 1000,
                py: 4
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
                        maxWidth: 550,
                        background: cardBg,
                        backdropFilter: 'blur(20px)',
                        borderRadius: 4,
                        border: `1px solid ${cardBorder}`,
                        boxShadow: cardShadow,
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Box textAlign="center" mb={3}>
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
                                    background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    mb: 2,
                                    boxShadow: '0 0 20px rgba(58, 12, 163, 0.5)'
                                }}
                            >
                                <UserPlus color="white" size={30} />
                            </Box>
                        </motion.div>
                        <Typography variant="h4" fontWeight="800" sx={{ color: textColor, mb: 1 }}>
                            Create Account
                        </Typography>
                        <Typography variant="body2" sx={{ color: subTextColor }}>
                            Join us and start managing your journey
                        </Typography>
                    </Box>

                    <form onSubmit={handleRegister}>
                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                            <TextField
                                fullWidth
                                placeholder="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                InputProps={{ sx: inputInputStyles }}
                            />
                            <TextField
                                fullWidth
                                placeholder="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                InputProps={{ sx: inputInputStyles }}
                            />
                        </Box>

                        <Box mb={3}>
                            <TextField
                                fullWidth
                                placeholder="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Mail color={iconColor} size={20} />
                                        </InputAdornment>
                                    ),
                                    sx: inputInputStyles
                                }}
                            />
                        </Box>

                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                            <TextField
                                fullWidth
                                placeholder="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <EyeOff color={iconColor} size={20} /> : <Eye color={iconColor} size={20} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: inputInputStyles
                                }}
                            />
                            <TextField
                                fullWidth
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                {showConfirmPassword ? <EyeOff color={iconColor} size={20} /> : <Eye color={iconColor} size={20} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: inputInputStyles
                                }}
                            />
                        </Box>

                        <Box mb={4}>
                            <Button
                                component="label"
                                fullWidth
                                sx={{
                                    color: textColor,
                                    border: `1px dashed ${isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    '&:hover': { border: '1px solid #4cc9f0', bgcolor: isDark ? 'rgba(76, 201, 240, 0.1)' : 'rgba(76, 201, 240, 0.05)' }
                                }}
                            >
                                <Upload size={20} style={{ marginRight: 8, color: textColor }} />
                                {formData.profilePhoto ? formData.profilePhoto.name : "Upload Profile Photo (Optional)"}
                                <input
                                    type="file"
                                    hidden
                                    name="profilePhoto"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                            </Button>
                        </Box>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    background: 'linear-gradient(45deg, #4361ee 0%, #3a0ca3 100%)',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 15px rgba(58, 12, 163, 0.4)'
                                }}
                            >
                                Get Started
                            </Button>
                        </motion.div>
                    </form>

                    <Box mt={4} textAlign="center">
                        <Typography variant="body2" sx={{ color: subTextColor }}>
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" sx={{ color: '#4cc9f0', fontWeight: 'bold', textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </motion.div>
        </Box >
    );
};

export default Register;
