import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthLayout from '../components/layout/AuthLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import Goals from '../pages/goals/Goals';
import GoalDetails from '../pages/goals/GoalDetails';
import TaskBoard from '../pages/tasks/TaskBoard';
import DailyTasks from '../pages/tasks/DailyTasks';
import UpcomingTasks from '../pages/tasks/UpcomingTasks';
import RoutinePlanner from '../pages/tasks/RoutinePlanner';
import Profile from '../pages/profile/Profile';
import Calendar from '../pages/calendar/Calendar';
import AnalyticsDashboard from '../pages/analytics/AnalyticsDashboard';
import History from '../pages/history/History';
import GrowthDashboard from '../pages/dashboard/GrowthDashboard';
import AlarmManager from '../pages/alarms/AlarmManager';
import ReviewPage from '../pages/review/ReviewPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Dashboard Routes (Protected) */}
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                <Route path="/goals/:goalId" element={<ProtectedRoute><GoalDetails /></ProtectedRoute>} />
                <Route path="/tasks" element={
                    <ProtectedRoute>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>All Tasks</Typography>
                            <TaskBoard />
                        </Box>
                    </ProtectedRoute>
                } />
                <Route path="/tasks/daily" element={<ProtectedRoute><DailyTasks /></ProtectedRoute>} />
                <Route path="/tasks/upcoming" element={<ProtectedRoute><UpcomingTasks /></ProtectedRoute>} />
                <Route path="/tasks/routine" element={<ProtectedRoute><RoutinePlanner /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/growth" element={<ProtectedRoute><GrowthDashboard /></ProtectedRoute>} />
                <Route path="/alarms" element={<ProtectedRoute><AlarmManager /></ProtectedRoute>} />
                <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
            </Route>

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
