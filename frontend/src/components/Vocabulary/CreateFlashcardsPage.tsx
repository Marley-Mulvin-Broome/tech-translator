import React, { useState } from 'react';
import {
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  Paper,
  CardContent,
  Card,
  CardActions,
  Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface Flashcard {
  english: string;
  japanese: string;
}

interface Vocabulary {
  title: string;
  flashcards: Flashcard[];
}

const CreateFlashcardsPage: React.FC = () => {
  const [vocabularyTitle, setVocabularyTitle] = useState('');
  const [englishFlashcard, setEnglishFlashcard] = useState('');
  const [japaneseFlashcard, setJapaneseFlashcard] = useState('');
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [currentVocabularyIndex, setCurrentVocabularyIndex] = useState<number | null>(null);
  const [showJapanese, setShowJapanese] = useState<{ [key: number]: boolean }>({});

  const handleSaveVocabulary = () => {
    if (vocabularyTitle) {
      const newVocabulary: Vocabulary = { title: vocabularyTitle, flashcards: [] };
      setVocabularies([...vocabularies, newVocabulary]);
      setVocabularyTitle('');
    }
  };

  const handleSaveFlashcard = () => {
    if (currentVocabularyIndex !== null && englishFlashcard && japaneseFlashcard) {
      const newFlashcard: Flashcard = { english: englishFlashcard, japanese: japaneseFlashcard };
      const updatedVocabularies = [...vocabularies];
      updatedVocabularies[currentVocabularyIndex].flashcards.push(newFlashcard);
      setVocabularies(updatedVocabularies);
      setEnglishFlashcard('');
      setJapaneseFlashcard('');
    }
  };

  const toggleShowJapanese = (index: number) => {
    setShowJapanese((prevShowJapanese) => ({
      ...prevShowJapanese,
      [index]: !prevShowJapanese[index],
    }));
  };

  return (
    <Container maxWidth="md">
      {currentVocabularyIndex === null ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Create Vocabulary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vocabulary Title"
                variant="outlined"
                value={vocabularyTitle}
                onChange={(e) => setVocabularyTitle(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveVocabulary}
            style={{ marginTop: '20px' }}
          >
            Save Vocabulary
          </Button>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Saved Vocabularies:
          </Typography>
          <ul>
            {vocabularies.map((vocabulary, index) => (
              <li key={index}>
                <strong>{vocabulary.title}</strong>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setCurrentVocabularyIndex(index)}
                >
                  Open Vocabulary
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Create Flashcard
          </Typography>
          <IconButton
            onClick={() => setCurrentVocabularyIndex(null)}
            style={{ marginBottom: '20px' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="English"
                  variant="outlined"
                  value={englishFlashcard}
                  onChange={(e) => setEnglishFlashcard(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Japanese"
                  variant="outlined"
                  value={japaneseFlashcard}
                  onChange={(e) => setJapaneseFlashcard(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveFlashcard}
              style={{ marginTop: '20px' }}
            >
              Save Flashcard
            </Button>
          </Paper>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Flashcards in {vocabularies[currentVocabularyIndex].title}:
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {vocabularies[currentVocabularyIndex].flashcards.map((flashcard, index) => (
              <Card
                key={index}
                style={{
                  width: 'calc(33.33% - 20px)',
                  margin: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => toggleShowJapanese(index)}
              >
                <CardContent>
                  <Box display="flex" flexDirection="row" justifyContent="space-between">
                    <Typography variant="body1">{flashcard.english}</Typography>
                    {showJapanese[index] && (
                      <Typography variant="body1">{flashcard.japanese}</Typography>
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  {showJapanese[index] ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </CardActions>
              </Card>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default CreateFlashcardsPage;
