import React, { useState } from 'react';
import { Paper, Typography, Button, TextField, CircularProgress, Container, Grid, IconButton } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';

const RightTranslateContent: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText) {
      return;
    }

    setLoading(true);

    try {
        const apiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: sourceText,
          source: 'en',
          target: 'ja',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslation(data.data.translations[0].translatedText);
      } else {
        console.error('翻訳エラー:', response.statusText);
      }
    } catch (error) {
      console.error('翻訳エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'white', minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h5" align="center" gutterBottom>
          English to Japanese Translation
        </Typography>
        <TextField
          label="英文を入力してください"
          variant="outlined"
          fullWidth
          rows={8}
          multiline
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
        />
        <IconButton aria-label="Translate" color="primary" onClick={handleTranslate}>
          <TranslateIcon />
        </IconButton>
        {loading && <CircularProgress />}
        {translation && (
          <div>
            <Typography variant="h6" align="center" gutterBottom>
              翻訳結果
            </Typography>
            <Typography variant="body1" gutterBottom>
              {translation}
            </Typography>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default RightTranslateContent;
