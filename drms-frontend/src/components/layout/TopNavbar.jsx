import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Menu, MenuItem, ListItemIcon, Divider, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Logout from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import ThemeToggle from '../common/ThemeToggle';

const drawerWidth = 260;

const TopNavbar = ({ onDrawerToggle }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const open = Boolean(anchorEl);

    // Dynamic Styles
    const glassBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    const textColor = isDark ? '#fff' : '#1e293b';
    const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchUser();
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                width: { xs: '100%', lg: `calc(100% - ${drawerWidth}px)` },
                ml: { xs: 0, lg: `${drawerWidth}px` },
                background: glassBg,
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${borderColor}`,
                color: textColor,
                boxShadow: 'none',
                transition: 'background 0.3s ease, color 0.3s ease'
            }}
        >
            <Toolbar>
                {/* Hamburger Menu - Mobile & Tablet Only */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2, display: { lg: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Dashboard
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <ThemeToggle />
                    <IconButton size="large" color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                        onClick={handleClick}
                    >
                        <Avatar alt={user?.username || "User"} src={user?.profilePhoto ? `http://localhost:8083/uploads/profiles/${user.profilePhoto}` : "/static/images/avatar/1.jpg"} sx={{ border: `2px solid ${isDark ? '#4cc9f0' : '#4f46e5'}` }} />
                        {/* Hide username on mobile */}
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            {user?.username || "Loading..."}
                        </Typography>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={() => navigate('/profile')}>
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavbar;
