import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('Password reset link has been sent to your email (simulated in server console).');
            Swal.fire({
                icon: 'success',
                title: 'Link Sent',
                text: 'Check the server console for the reset link!',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link.');
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
        }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="700" textAlign="center" mb={3} sx={{ color: '#4f46e5' }}>
                    Forgot Password
                </Typography>

                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            bgcolor: '#4f46e5',
                            '&:hover': { bgcolor: '#4338ca' },
                            py: 1.5
                        }}
                    >
                        Send Reset Link
                    </Button>

                    <Box textAlign="center">
                        <Link to="/login" style={{ textDecoration: 'none', color: '#6b7280', fontSize: '0.9rem' }}>
                            Back to Login
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;
