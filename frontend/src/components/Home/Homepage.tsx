import React from 'react';
import { Container, Typography, Grid, Paper, Box, Fab, Button } from '@mui/material';
import { InfoOutlined, LibraryBooksOutlined, SchoolOutlined, EditOutlined, VpnKeyOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; 

const Homepage = () => {
  const navigate = useNavigate(); 
  const handleNewsClick = () => {
    navigate('/news'); 
  };

  const handleVocabularyClick = () => {
    navigate('/vocabulary'); 
  };

  const handleLearningClick = () => {
    navigate('/learning'); 
  };

  const handleLogout = () => {

    console.log("ログアウトしました");
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '40px' }}>
      
      <Typography variant="h3" align="left" gutterBottom>
        Omnia
        <Typography variant="subtitle1" align="left" gutterBottom>
          あらゆるコンテンツを英語教材に変えるアプリ
        </Typography>
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} onClick={handleNewsClick}> 
            <Paper elevation={3} sx={{':hover': { boxShadow: 20, }}} style={{ cursor: "pointer", padding: '20px', backgroundColor: '#FF8C00', height: '100%' }}>
            <InfoOutlined style={{ fontSize: 50, color: '#fff', marginBottom: '20px' }} /> 
            <Typography variant="h5" align="center" gutterBottom style={{color: '#fff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                Latest News
            </Typography>
            <Typography variant="subtitle2" align="center" style={{ color: '#fff' }}>
                Check out the latest news
            </Typography>
            </Paper>
        </Grid>
        <Grid item xs={12} sm={4} onClick={handleVocabularyClick}> 
            <Paper elevation={3} sx={{':hover': { boxShadow: 20, }}} style={{ cursor: "pointer", padding: '20px', backgroundColor: '#4CAF50', height: '100%' }}>
            <LibraryBooksOutlined style={{ fontSize: 50, color: '#fff', marginBottom: '20px' }} /> 
            <Typography variant="h5" align="center" gutterBottom style={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                Vocabulary Management
            </Typography>
            <Typography variant="subtitle2" align="center" style={{ color: '#fff' }}>
                Master your vocabulary effectively
            </Typography>
            </Paper>
        </Grid>
        <Grid item xs={12} sm={4} onClick={handleLearningClick}>
            <Paper elevation={3} sx={{':hover': { boxShadow: 20, }}} style={{ cursor: "pointer", padding: '20px', backgroundColor: '#2196F3', height: '100%' }}>
            <SchoolOutlined style={{ fontSize: 50, color: '#fff', marginBottom: '20px' }} /> 
            <Typography variant="h5" align="center" gutterBottom style={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                Site Selection Learning
            </Typography>
            <Typography variant="subtitle2" align="center" style={{ color: '#fff' }}>
                Learn from websites
            </Typography>
            </Paper>
        </Grid>
        </Grid>

      <Box display="flex" justifyContent="center" alignItems="center" marginTop="80px">
        <Fab variant="extended" color="default" size="large" style={{ width: '250px', justifyContent: 'center', alignItems: 'center' }}>
            Edit Profile
            <EditOutlined sx={{ ml: 1, mr: -1 }} />
        </Fab>
        <Box marginLeft="20px" marginRight="20px"> 
            <Fab variant="extended" color="default" size="large" style={{ width: '250px', justifyContent: 'center', alignItems: 'center' }}>
            Change Password
            <VpnKeyOutlined sx={{ ml: 1, mr: -1 }} />
            </Fab>
        </Box>
        <Button variant="contained" onClick={handleLogout} style={{ backgroundColor: 'gray', color: '#fff' }}>LogOut</Button>
      </Box>

    </Container>
  );
};

export default Homepage;
