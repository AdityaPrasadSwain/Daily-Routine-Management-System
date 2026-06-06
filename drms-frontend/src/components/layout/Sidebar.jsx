import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TodayIcon from '@mui/icons-material/Today';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Swal from 'sweetalert2';

const drawerWidth = 260;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Goals', icon: <BusinessCenterIcon />, path: '/goals' },
    { text: 'Tasks', icon: <AssignmentIcon />, path: '/tasks' },
    { text: 'Daily Review', icon: <AssessmentIcon />, path: '/review' },
    { text: 'Daily Focus', icon: <TodayIcon />, path: '/tasks/daily' },
    { text: 'Analytics', icon: <DashboardIcon />, path: '/analytics' },
];

const settingsItems = [
    { text: 'Routine Planner', icon: <AccessTimeIcon />, path: '/tasks/routine' },
    { text: 'Alarms', icon: <AccessTimeIcon />, path: '/alarms' },
    { text: 'Upcoming', icon: <CalendarMonthIcon />, path: '/tasks/upcoming' },
    { text: 'Calendar', icon: <CalendarMonthIcon />, path: '/calendar' },
    { text: 'History', icon: <AssessmentIcon />, path: '/history' },
];

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [settingsOpen, setSettingsOpen] = React.useState(false);

    const glassBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    const textColor = isDark ? '#fff' : '#1e293b';
    const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const iconColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)';

    const handleSettingsClick = () => {
        setSettingsOpen(!settingsOpen);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout',
            text: "Are you sure you want to logout?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        });
    };

    const drawerContent = (
        <>
            <Toolbar sx={{ height: 80, display: 'flex', alignItems: 'center', px: 3 }}>
                <Box
                    component="img"
                    src="/drms-logo.svg"
                    alt="DRMS Logo"
                    sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        filter: 'drop-shadow(0 2px 8px rgba(79, 70, 229, 0.2))'
                    }}
                />
                <Typography variant="h5" noWrap component="div" sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    DRMS
                </Typography>
            </Toolbar>

            <Box sx={{ overflow: 'auto', px: 2, py: 2 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                onClick={onDrawerToggle}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                    color: textColor,
                                    '&.active': {
                                        background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                                        '& .MuiListItemIcon-root': {
                                            color: 'white',
                                        },
                                    },
                                    '&:hover:not(.active)': {
                                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(79, 70, 229, 0.05)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: iconColor }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}

                    {/* Settings Menu */}
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton onClick={handleSettingsClick} sx={{ borderRadius: '12px', py: 1.5, color: textColor }}>
                            <ListItemIcon sx={{ minWidth: 40, color: iconColor }}>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} />
                            {settingsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {settingsItems.map((item) => (
                                <ListItemButton
                                    key={item.text}
                                    component={NavLink}
                                    to={item.path}
                                    onClick={onDrawerToggle}
                                    sx={{
                                        pl: 4,
                                        borderRadius: '12px',
                                        py: 1,
                                        color: textColor,
                                        '&.active': {
                                            color: 'primary.main',
                                            fontWeight: 'bold',
                                            '& .MuiListItemIcon-root': {
                                                color: 'primary.main',
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: iconColor }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <Divider sx={{ my: 3, mx: 1, borderColor: borderColor }} />

                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: '12px',
                                py: 1.5,
                                color: 'error.main',
                                '&:hover': { bgcolor: 'error.lighter', color: 'error.dark' }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </>
    );

    return (
        <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
            {/* Mobile & Tablet Drawer (Temporary) */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: `1px solid ${borderColor}`,
                        background: glassBg,
                        backdropFilter: 'blur(10px)',
                        color: textColor
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer (Permanent) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: `1px solid ${borderColor}`,
                        background: glassBg,
                        backdropFilter: 'blur(10px)',
                        color: textColor
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
