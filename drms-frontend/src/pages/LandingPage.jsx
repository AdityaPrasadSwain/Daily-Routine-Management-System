import React from 'react';
import { Box, Button, Container, Grid, Typography, useTheme, Card, CardContent } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Zap, Target, BarChart3, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
    const theme = useTheme();
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, type: 'spring' }}
            whileHover={{ y: -10, scale: 1.02 }}
        >
            <Card
                sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                    overflow: 'visible',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: `0 20px 40px -10px ${theme.palette.primary.main}40`,
                        borderColor: theme.palette.primary.main,
                    }
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            boxShadow: `0 8px 16px -4px ${theme.palette.primary.main}60`
                        }}
                    >
                        <Icon color="white" size={24} />
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                        {title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <Box sx={{
            minHeight: '100vh',
            background: '#0f0c29',
            backgroundImage: `
        radial-gradient(at 0% 0%, rgba(89, 28, 135, 0.3) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(219, 39, 119, 0.3) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(15, 23, 42, 1) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(56, 189, 248, 0.2) 0px, transparent 50%)
      `,
            overflow: 'hidden',
            color: 'white',
            pb: 10
        }}>
            {/* Navbar Placeholder */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, mx: 'auto' }}>
                <Typography variant="h5" fontWeight="900" sx={{ background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    DRMS.<span style={{ color: theme.palette.primary.main }}>AI</span>
                </Typography>
                <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', borderRadius: 50, px: 3 }} onClick={() => navigate('/login')}>
                    Sign In
                </Button>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 15 }, pb: 10, position: 'relative' }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ zIndex: 2 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Box sx={{
                                display: 'inline-block',
                                px: 2, py: 0.5,
                                borderRadius: 50,
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                mb: 3
                            }}>
                                <Typography variant="caption" fontWeight="bold" sx={{ color: theme.palette.secondary.light, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Zap size={14} fill="currentColor" /> NEW: AI-POWERED PRODUCTIVITY
                                </Typography>
                            </Box>
                            <Typography variant="h1" fontWeight="800" sx={{
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                lineHeight: 1.1,
                                mb: 3,
                                textShadow: '0 20px 80px rgba(0,0,0,0.5)'
                            }}>
                                Master Your Routine <br />
                                <span style={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    With AI Intelligence
                                </span>
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, maxWidth: 500, lineHeight: 1.6 }}>
                                The world's most advanced daily routine management system. Stop managing tasks. Start engineering your life with predictive AI.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        borderRadius: 50,
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        boxShadow: `0 10px 40px -10px ${theme.palette.primary.main}80`,
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 20px 50px -10px ${theme.palette.primary.main}`
                                        }
                                    }}
                                >
                                    Get Started Free
                                </Button>
                                <Button
                                    size="large"
                                    sx={{ color: 'white', borderRadius: 50, px: 3 }}
                                    endIcon={<ChevronRight />}
                                >
                                    Watch Demo
                                </Button>
                            </Box>
                            <Box sx={{ mt: 6, display: 'flex', gap: 4 }}>
                                {[
                                    { label: 'Active Users', value: '10k+' },
                                    { label: 'Tasks Completed', value: '1.2M+' },
                                    { label: 'Focus Hours', value: '500k+' }
                                ].map((stat, index) => (
                                    <Box key={index}>
                                        <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* 3D Dashboard Visualization */}
                    <Grid item xs={12} md={6} sx={{ position: 'relative', height: 600, display: { xs: 'none', md: 'block' } }}>
                        <motion.div style={{ y: y1, position: 'absolute', right: 0, top: 50, zIndex: 1 }}>
                            <Box
                                component={motion.div}
                                animate={{
                                    y: [0, -20, 0],
                                    rotateX: [10, 15, 10],
                                    rotateY: [-10, -5, -10]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                sx={{
                                    width: 450,
                                    height: 300,
                                    background: 'rgba(22, 27, 46, 0.9)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 4,
                                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.7)',
                                    perspective: 1000,
                                    transformStyle: 'preserve-3d',
                                    p: 3
                                }}
                            >
                                {/* Fake Dashboard UI */}
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#334155' }} />
                                    <Box>
                                        <Box sx={{ width: 120, height: 10, borderRadius: 2, bgcolor: '#334155', mb: 1 }} />
                                        <Box sx={{ width: 80, height: 8, borderRadius: 2, bgcolor: '#1e293b' }} />
                                    </Box>
                                </Box>
                                <Grid container spacing={2}>
                                    {[1, 2, 3].map(i => (
                                        <Grid item xs={4} key={i}>
                                            <Box sx={{ height: 80, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }} />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ mt: 3, height: 100, borderRadius: 2, background: 'linear-gradient(90deg, #38bdf820 0%, #818cf820 100%)', position: 'relative' }}>
                                    <motion.div
                                        animate={{ width: ['30%', '70%', '50%'] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        style={{ height: '100%', borderBottom: '2px solid #38bdf8', position: 'absolute', bottom: 0, left: 0 }}
                                    />
                                </Box>
                            </Box>
                        </motion.div>

                        {/* Floating Elements */}
                        <motion.div style={{ y: y2, position: 'absolute', left: 0, bottom: 100, zIndex: 2 }}>
                            <Box
                                component={motion.div}
                                animate={{ y: [0, 30, 0] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: 'rgba(15, 23, 42, 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    minWidth: 200
                                }}
                            >
                                <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', p: 1, borderRadius: '50%' }}>
                                    <CheckCircle2 color="#10b981" size={20} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Task Completed</Typography>
                                    <Typography variant="body2" fontWeight="bold">Project Deployment</Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="overline" sx={{ color: theme.palette.primary.light, letterSpacing: 2, fontWeight: 'bold' }}>
                            POWERFUL FEATURES
                        </Typography>
                        <Typography variant="h2" fontWeight="800" sx={{ mb: 2 }}>
                            Everything you need to <br />
                            <span style={{ color: '#94a3b8' }}>optimize your workflow</span>
                        </Typography>
                    </motion.div>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <FeatureCard
                            icon={Brain}
                            title="Smart Priority Engine"
                            description="Our AI analyzes deadlines, habits, and focus history to dynamically rank your day."
                            delay={0}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FeatureCard
                            icon={Target}
                            title="Focus Sessions"
                            description="Deep work timers with distraction tracking and automated break scheduling."
                            delay={0.2}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FeatureCard
                            icon={BarChart3}
                            title="Burnout Detection"
                            description="Predictive analytics warn you when you're overloading your schedule."
                            delay={0.4}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default LandingPage;
