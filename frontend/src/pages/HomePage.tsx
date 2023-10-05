import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme, Container } from '@mui/material';
import WordList from '../components/WordList';
import WordForm from '../components/WordForm';

const theme = createTheme();

const HomePage: React.FC = () => {
  const [words, setWords] = useState<string[]>(['apple', 'banana', 'cherry']);

  const addWord = (word: string) => {
    setWords([...words, word]);
  };

  const editWord = (index: number, editedWord: string) => {
    const updatedWords = [...words];
    updatedWords[index] = editedWord;
    setWords(updatedWords);
  };

  const deleteWord = (index: number) => {
    const updatedWords = [...words];
    updatedWords.splice(index, 1);
    setWords(updatedWords);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <WordForm onAddWord={addWord} />
        <WordList
          words={words}
          onEditWord={(index, editedWord) => editWord(index, editedWord)}
          onDeleteWord={(index) => deleteWord(index)}
        />
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
