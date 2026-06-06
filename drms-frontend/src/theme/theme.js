import { createTheme } from '@mui/material/styles';

// Common theme settings shared between light and dark modes
const commonSettings = {
    typography: {
        fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 700,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.01em',
        },
        subtitle1: {
            fontSize: '1rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    padding: '8px 20px',
                    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-3px)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        '&.Mui-focused fieldset': {
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    fontWeight: 500,
                },
            },
        },
    },
};

// Light Theme
export const lightTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'light',
        primary: {
            main: '#4f46e5', // Indigo 600
            light: '#818cf8', // Indigo 400
            dark: '#3730a3', // Indigo 800
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#db2777', // Pink 600
            light: '#f472b6',
            dark: '#be185d',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f3f4f6', // Cool Gray 100
            paper: '#ffffff',
        },
        text: {
            primary: '#111827', // Gray 900
            secondary: '#6b7280', // Gray 500
        },
        success: {
            main: '#10b981', // Emerald 500
        },
        error: {
            main: '#ef4444', // Red 500
        },
        warning: {
            main: '#f59e0b', // Amber 500
        },
        info: {
            main: '#3b82f6', // Blue 500
        },
        divider: 'rgba(0, 0, 0, 0.12)',
    },
    components: {
        ...commonSettings.components,
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: '#9ca3af #f3f4f6',
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        backgroundColor: '#f3f4f6',
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        backgroundColor: '#9ca3af',
                        minHeight: 24,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    ...commonSettings.components.MuiCard.styleOverrides.root,
                    boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.02)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    '&:hover': {
                        ...commonSettings.components.MuiCard.styleOverrides.root['&:hover'],
                        boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.05), 0px 10px 10px -5px rgba(0, 0, 0, 0.02)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                ...commonSettings.components.MuiPaper.styleOverrides,
                elevation1: {
                    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    ...commonSettings.components.MuiTextField.styleOverrides.root,
                    '& .MuiOutlinedInput-root': {
                        ...commonSettings.components.MuiTextField.styleOverrides.root['& .MuiOutlinedInput-root'],
                        '& fieldset': {
                            borderColor: '#e5e7eb',
                        },
                        '&:hover fieldset': {
                            borderColor: '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#4f46e5',
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.03)',
                    borderBottom: '1px solid #f3f4f6',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                },
            },
        },
    },
});

// Dark Theme
export const darkTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'dark',
        primary: {
            main: '#818cf8', // Indigo 400 (lighter for dark mode)
            light: '#a5b4fc', // Indigo 300
            dark: '#6366f1', // Indigo 500
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f472b6', // Pink 400
            light: '#f9a8d4', // Pink 300
            dark: '#ec4899', // Pink 500
            contrastText: '#ffffff',
        },
        background: {
            default: '#0f172a', // Slate 900
            paper: '#1e293b', // Slate 800
        },
        text: {
            primary: '#f1f5f9', // Slate 100
            secondary: '#94a3b8', // Slate 400
        },
        success: {
            main: '#34d399', // Emerald 400
        },
        error: {
            main: '#f87171', // Red 400
        },
        warning: {
            main: '#fbbf24', // Amber 400
        },
        info: {
            main: '#60a5fa', // Blue 400
        },
        divider: 'rgba(148, 163, 184, 0.12)',
    },
    components: {
        ...commonSettings.components,
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: '#475569 #1e293b',
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        backgroundColor: '#1e293b',
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        backgroundColor: '#475569',
                        minHeight: 24,
                    },
                    '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#64748b',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    ...commonSettings.components.MuiCard.styleOverrides.root,
                    boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.3), 0px 2px 4px -1px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    backgroundColor: '#1e293b',
                    '&:hover': {
                        ...commonSettings.components.MuiCard.styleOverrides.root['&:hover'],
                        boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.4), 0px 10px 10px -5px rgba(0, 0, 0, 0.3)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                ...commonSettings.components.MuiPaper.styleOverrides,
                elevation1: {
                    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    ...commonSettings.components.MuiTextField.styleOverrides.root,
                    '& .MuiOutlinedInput-root': {
                        ...commonSettings.components.MuiTextField.styleOverrides.root['& .MuiOutlinedInput-root'],
                        '& fieldset': {
                            borderColor: '#334155',
                        },
                        '&:hover fieldset': {
                            borderColor: '#475569',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#818cf8',
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e293b',
                    color: '#f1f5f9',
                    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
                    borderBottom: '1px solid #334155',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: '1px solid #334155',
                    backgroundColor: '#1e293b',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                ...commonSettings.components.MuiButton.styleOverrides,
                containedPrimary: {
                    background: 'linear-gradient(135deg, #818cf8 0%, #a5b4fc 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                        boxShadow: '0px 4px 6px -1px rgba(129, 140, 248, 0.3), 0px 2px 4px -1px rgba(129, 140, 248, 0.2)',
                    },
                },
            },
        },
    },
});

// Default export for backward compatibility
export default lightTheme;
