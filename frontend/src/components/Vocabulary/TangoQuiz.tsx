import React from "react";
import { getUserToken } from "../../server/login";
import { CardContainer, TangoCard } from "../../server/models";
import { getAllCardsInCollectionRequest, setTangoCardRequest } from "../../server/requests";
import CenteredCircularProgress from "../shared/CenteredCircularProgress";
import TangoQuizQuestion from "./TangoQuizQuestion";
import { Box, Button } from "@mui/material";
import LinearProgressWithLabel from "../shared/LinearProgressWithLabel";
import { getQuizableCards } from "../../shared/util";
import { doCardCorrect, doCardIncorrect } from "./cardOperations";
import FinishedDeck from "./FinishedDeck";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface QuizProps {
    deck: CardContainer;
    onReturnClick: () => void;
}

export default function TangoQuiz({ deck, onReturnClick }: QuizProps) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [cardsToReview, setCardsToReview] = React.useState<TangoCard[]>([]);
    const [selectedCardIndex, setSelectedCardIndex] = React.useState(0);

    const fetchAllCards = async () => {
        setIsLoading(true);
        let cards = await getAllCardsInCollectionRequest<TangoCard[]>(getUserToken() as string, deck.container_id);


        cards = getQuizableCards(cards) as TangoCard[];

        setCardsToReview(cards);
        setIsLoading(false);
    }

    const getCurrentCard = () => {
        if (cardsToReview.length === 0) {
            return null;
        }

        if (selectedCardIndex >= cardsToReview.length) {
            setCardsToReview(getQuizableCards(cardsToReview) as TangoCard[]);
            setSelectedCardIndex(0);
        }

        return cardsToReview[selectedCardIndex];
    }

    const onItemSelected = (correct: boolean) => {
        let cardReference = cardsToReview[selectedCardIndex];

        if (correct) {
            cardReference = doCardCorrect(cardReference);
        } else {
            cardReference = doCardIncorrect(cardReference);
        }

        // サーバーに送信
        setTangoCardRequest(getUserToken() as string, deck.container_id, cardReference).then(() => {
            console.log(`${cardReference.english}を更新しました`)
        }).catch((error) => {
            console.log(`${cardReference.english}の更新に失敗しました\n${error}`)
        });

        setSelectedCardIndex(selectedCardIndex + 1);
    }

    React.useEffect(() => {
        const cardsFetch = async () => {
            await fetchAllCards();
        };

        cardsFetch();
    }, []);

    if (isLoading) {
        return (
            <CenteredCircularProgress />
        )
    }

    const currentCard = getCurrentCard();

    if (currentCard === null) {
        return (
            <FinishedDeck onReturnClick={onReturnClick} />
        )
    }

    const progressPercentage = (selectedCardIndex / cardsToReview.length) * 100;


    return (
        <Box display='flex' sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <LinearProgressWithLabel value={progressPercentage} label={`${selectedCardIndex}/${cardsToReview.length}`} >
                <Button onClick={onReturnClick} >
                    <ArrowBackIcon />
                </Button>
            </LinearProgressWithLabel>
            <TangoQuizQuestion  card={currentCard} otherCards={cardsToReview} onItemSelected={onItemSelected} />
            
        </Box>

    )
}