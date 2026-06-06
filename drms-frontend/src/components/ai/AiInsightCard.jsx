import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion } from 'framer-motion';

const AiInsightCard = ({ title, description, loading, actions = [], children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                variant="outlined"
                sx={{
                    background: 'linear-gradient(180deg, rgba(237, 247, 255, 0.5) 0%, rgba(255, 255, 255, 1) 100%)',
                    borderColor: 'rgba(33, 150, 243, 0.2)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'visible'
                }}
            >
                {/* AI Icon Badge */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -10,
                        right: 16,
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        p: 0.5,
                        boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <AutoAwesomeIcon fontSize="small" />
                </Box>

                <CardContent sx={{ pt: 3 }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                            {title || 'AI Insight'}
                        </Typography>

                        {loading ? (
                            <Box display="flex" alignItems="center" gap={2} py={1}>
                                <CircularProgress size={20} />
                                <Typography variant="body2" color="text.secondary">
                                    Analyzing...
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    {description}
                                </Typography>
                                {children}
                            </>
                        )}

                        {actions && actions.length > 0 && !loading && (
                            <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                                {actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        size="small"
                                        variant={action.variant || 'outlined'}
                                        color={action.color || 'primary'}
                                        onClick={action.onClick}
                                        startIcon={action.icon}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.8rem' }}
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AiInsightCard;
