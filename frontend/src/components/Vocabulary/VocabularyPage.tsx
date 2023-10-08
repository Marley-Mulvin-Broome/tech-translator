import React from 'react';
import { CardContainer } from '../../server/models';
import { getAllCardCollectionsRequest, getAllCardsInCollectionRequest } from '../../server/requests';
import { getUserToken } from '../../server/login';
import VocabularyLayout from './VocabularyLayout';
import DecksView from './DecksView';
import CenteredCircularProgress from '../shared/CenteredCircularProgress';
import CardsViews from './CardsView';

const VocabularyPage = () => {
  const [isViewingCards, setIsViewingCards] = React.useState(false);
  const [selectedCollection, setSelectedCollection] = React.useState<CardContainer | null>(null);


  return (
    <VocabularyLayout>
      {isViewingCards ? <CardsViews onReturnClick={() => setIsViewingCards(false)} selectedCollection={selectedCollection as CardContainer}  /> : <DecksView onDeckClick={(deck) => { setIsViewingCards(true); setSelectedCollection(deck) }}/>}
    </VocabularyLayout>
  );
};

export default VocabularyPage;
