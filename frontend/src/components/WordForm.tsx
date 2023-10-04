import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

interface WordFormProps {
  onAddWord: (word: string) => void;
}

const WordForm: React.FC<WordFormProps> = ({ onAddWord }) => {
  const handleAddWord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const word = formData.get('word') as string;
    onAddWord(word);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        新しい英単語を追加
      </Typography>
      <form onSubmit={handleAddWord}>
        <TextField
          name="word"
          label="英単語"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          追加
        </Button>
      </form>
    </Box>
  );
};

export default WordForm;
