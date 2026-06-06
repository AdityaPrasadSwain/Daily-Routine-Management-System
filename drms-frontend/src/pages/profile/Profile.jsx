import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
    Grid,
    TextField,
    Divider,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    CircularProgress,
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    PhotoCamera as PhotoCameraIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import api from '../../api/axiosConfig';
import Swal from 'sweetalert2';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data);
            setEditedUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user', error);
            Swal.fire('Error', 'Failed to load profile data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'File size must be less than 5MB', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            Swal.fire('Error', 'Please upload an image file', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const response = await api.post('/users/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(response.data);
            setEditedUser(response.data);
            Swal.fire('Success', 'Profile photo updated successfully', 'success');
        } catch (error) {
            console.error('Upload failed', error);
            Swal.fire('Error', error.response?.data || 'Failed to upload photo', 'error');
        }
    };

    const handleEdit = () => {
        setEditMode(true);
        setEditedUser({ ...user });
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditedUser({ ...user });
    };

    const handleSave = async () => {
        try {
            const response = await api.put('/users/me', {
                name: editedUser.name,
                username: editedUser.username
            });
            setUser(response.data);
            setEditedUser(response.data);
            setEditMode(false);
            Swal.fire('Success', 'Profile updated successfully', 'success');
        } catch (error) {
            console.error('Update failed', error);
            Swal.fire('Error', error.response?.data || 'Failed to update profile', 'error');
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire('Error', 'New passwords do not match', 'error');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            Swal.fire('Error', 'Password must be at least 6 characters', 'error');
            return;
        }

        try {
            await api.post('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            Swal.fire('Success', 'Password changed successfully', 'success');
        } catch (error) {
            Swal.fire('Error', error.response?.data || 'Failed to change password', 'error');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="700" sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    My Profile
                </Typography>
                <Chip
                    label={user?.role || 'USER'}
                    color="primary"
                    sx={{ fontWeight: 600, px: 2 }}
                />
            </Box>

            <Grid container spacing={3}>
                {/* Left Column - Profile Info */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                        {/* Avatar Section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={user?.profilePhoto ? `http://localhost:8083/uploads/profiles/${user.profilePhoto}` : null}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        border: '4px solid',
                                        borderColor: 'primary.main',
                                        boxShadow: 3
                                    }}
                                >
                                    {user?.name?.charAt(0) || user?.username?.charAt(0)}
                                </Avatar>
                                <IconButton
                                    component="label"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        boxShadow: 2
                                    }}
                                >
                                    <PhotoCameraIcon fontSize="small" />
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />
                                </IconButton>
                            </Box>
                            <Box sx={{ ml: 3, flex: 1 }}>
                                <Typography variant="h5" fontWeight="700">
                                    {user?.name || user?.username}
                                </Typography>
                                <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                    <EmailIcon fontSize="small" />
                                    {user?.email}
                                </Typography>
                                <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                    <CalendarIcon fontSize="small" />
                                    Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </Typography>
                            </Box>
                            {!editMode && (
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={handleEdit}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Profile Fields */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={editMode ? editedUser.name || '' : user?.name || ''}
                                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                    disabled={!editMode}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={editMode ? editedUser.username || '' : user?.username || ''}
                                    onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                                    disabled={!editMode}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                @
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={user?.email || ''}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    helperText="Email cannot be changed"
                                />
                            </Grid>
                        </Grid>

                        {/* Action Buttons */}
                        {editMode && (
                            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancel}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Right Column - Security & Stats */}
                <Grid item xs={12} md={4}>
                    {/* Account Stats */}
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom>
                            Account Statistics
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                                <CardContent>
                                    <Typography color="text.secondary" variant="body2">
                                        Member Since
                                    </Typography>
                                    <Typography variant="h6" fontWeight="600">
                                        {new Date(user?.createdAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card variant="outlined" sx={{ bgcolor: 'success.50' }}>
                                <CardContent>
                                    <Typography color="text.secondary" variant="body2">
                                        Account Status
                                    </Typography>
                                    <Typography variant="h6" fontWeight="600" color="success.main">
                                        Active
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Paper>

                    {/* Change Password */}
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom>
                            Change Password
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                type={showPassword.current ? 'text' : 'password'}
                                label="Current Password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                                edge="end"
                                            >
                                                {showPassword.current ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                type={showPassword.new ? 'text' : 'password'}
                                label="New Password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                                edge="end"
                                            >
                                                {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                type={showPassword.confirm ? 'text' : 'password'}
                                label="Confirm New Password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                                edge="end"
                                            >
                                                {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handlePasswordChange}
                                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                sx={{ textTransform: 'none', mt: 1 }}
                            >
                                Update Password
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
