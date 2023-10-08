import { Paper, Typography } from "@mui/material";
import React from "react";
import DecksView from "./DecksView";
import { CardContainer } from "../../server/models";

export default function ChooseDeck({ onDeckSelected }: { onDeckSelected: (deck: CardContainer) => void }) {
  return (
  <React.Fragment>
    <Paper sx={{ bgcolor: '#4CAF50', pt: '10px', color: 'white', mb: '20px' }}>
      <Typography variant="h2" align="center" sx={{ padding: '20px' }}>
        Choose a Deck to study
      </Typography>
    </Paper>

    <DecksView onDeckClick={onDeckSelected} hasAddButton={false} />
  </React.Fragment>
  );

}