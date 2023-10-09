import React from 'react'
import { CardContainer } from '../../server/models'
import { Container, } from '@mui/material'
import ChooseDeck from './ChooseDeck'
import TangoQuiz from './TangoQuiz'
import SentenceQuiz from './SentenceQuiz'

const StudyWithFlashcardsPage = () => {
  const [selectedDeck, setSelectedDeck] = React.useState<CardContainer | null>(null);

  const onReturnClick = () => {
    setSelectedDeck(null);
  }

  const onDeckSelected = (deck: CardContainer) => {
    setSelectedDeck(deck);
  }

  const chooseQuiz = () => {
    if (selectedDeck === null) {
      throw new Error('No deck selected');
    }

    if (selectedDeck.is_sentence) {
      return <SentenceQuiz deck={selectedDeck} onReturnClick={onReturnClick} />
    }

    return <TangoQuiz deck={selectedDeck} onReturnClick={onReturnClick} />
  }

  return (
    <Container maxWidth="md" sx={{ pt: '100px' }}>
      {selectedDeck === null ? <ChooseDeck onDeckSelected={onDeckSelected}/> : chooseQuiz()}
    </Container>
  )
}

export default StudyWithFlashcardsPage