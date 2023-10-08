import React from 'react';
import { CardContainer } from '../../server/models';
import VocabularyLayout from './VocabularyLayout';
import DecksView from './DecksView';
import CardsViews from './CardsView';

const CreateFlashcardsPage = () => {
  const [isViewingCards, setIsViewingCards] = React.useState(false);
  const [selectedCollection, setSelectedCollection] = React.useState<CardContainer | null>(null);

  return (
    <VocabularyLayout>
      {isViewingCards ? <CardsViews onReturnClick={() => setIsViewingCards(false)} selectedCollection={selectedCollection as CardContainer}  /> : <DecksView onDeckClick={(deck) => { setIsViewingCards(true); setSelectedCollection(deck) }}/>}
    </VocabularyLayout>
  );
}

export default CreateFlashcardsPage;
