import { Link } from 'react-router-dom'; 
import {
  Grid,
  Typography,
  Paper,
  IconButton,
  Container,
  Box,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import BookIcon from '@mui/icons-material/Book';

const VocabularyPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Box mb={4}>
          <Typography variant="h2" align="center" gutterBottom style={{ paddingTop: '120px' }}>
            Vocabulary Management
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center" style={{ marginTop: '80px' }}>
          <Grid item xs={12} sm={6}>
          <Link to="/create-flashcards" style={{ textDecoration: 'none' }}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
              <Box display="flex" justifyContent="center" alignItems="center" height="120px">
                  <IconButton
                    color="primary"
                    aria-label="Create Vocabulary"
                    component="span"
                    style={{ fontSize: 60 }}
                  >
                    <CreateIcon fontSize="inherit" />
                  </IconButton>             
              </Box>
              <Typography variant="h5" align="center" style={{ marginTop: '10px' }}>
                Create Flashcards
              </Typography>
              <Typography variant="body1" align="center" style={{ marginTop: '10px' }}>
                You can create new flashcards by yourself.
              </Typography>
            </Paper>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6}>
          <Link to="/study-with-flashcards" style={{ textDecoration: 'none' }}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
              <Box display="flex" justifyContent="center" alignItems="center" height="120px">
                  <IconButton
                    color="primary"
                    aria-label="View Existing Vocabulary"
                    component="span"
                    style={{ fontSize: 60 }}
                  >
                    <BookIcon fontSize="inherit" />
                  </IconButton>
              </Box>
              <Typography variant="h5" align="center" style={{ marginTop: '10px' }}>
                Study with Flashcards
              </Typography>
              <Typography variant="body1" align="center" style={{ marginTop: '10px' }}>
                Let's study with the created flashcards.
              </Typography>
            </Paper>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default VocabularyPage;
