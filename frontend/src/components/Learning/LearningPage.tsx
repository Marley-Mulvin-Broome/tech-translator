import React from 'react';
import { Container, Grid } from '@mui/material';
import LeftContent from './LeftContent';
import RightContent from './RightContent';

const LearningPage = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <LeftContent />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RightContent />
      </Grid>
    </Grid>
  );
};

export default LearningPage;
