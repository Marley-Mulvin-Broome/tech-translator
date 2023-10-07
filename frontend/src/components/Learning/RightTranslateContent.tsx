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
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: sourceText }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslation(data.translation);
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
          English Translation
        </Typography>
        <TextField
          label="英文を入力"
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
