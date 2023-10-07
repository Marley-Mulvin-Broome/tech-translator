import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import RightTranslateContent from './RightTranslateContent';
import RightQuiz from './RightQuiz';

const RightContent: React.FC = () => {
  return (
    <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
      <RightTranslateContent />
      <hr /> {/* 横線で分割 */}
      <RightQuiz />
    </Paper>
  );
};

export default RightContent;
