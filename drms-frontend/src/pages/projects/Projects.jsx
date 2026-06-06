import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // Dummy Data
    const [projects, setProjects] = useState([
        { id: 1, name: 'Website Redesign', description: 'Redoing the company website.', members: 4 },
        { id: 2, name: 'Mobile App', description: 'Flutter app development.', members: 3 },
    ]);

    const handleCreate = () => {
        // TODO: Call API
        setProjects([...projects, { id: projects.length + 1, name: 'New Project', description: 'Generated project', members: 1 }]);
        setOpen(false);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Projects</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    New Project
                </Button>
            </Box>

            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: '0.3s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                            }}
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>{project.name}</Typography>
                                <Typography color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>{project.description}</Typography>
                                <Typography variant="body2" color="primary">{project.members} members</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create Project Modal */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Project</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Project Name" fullWidth variant="outlined" sx={{ mb: 2, mt: 1 }} />
                    <TextField margin="dense" label="Description" fullWidth multiline rows={3} variant="outlined" />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Projects;
