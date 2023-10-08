import { Box, Button } from "@mui/material";
import { QuizProps } from "./TangoQuiz";
import LinearProgressWithLabel from "../shared/LinearProgressWithLabel";
import SentenceQuizQuestion from "./SentenceQuizQuestion";
import React from "react";
import { getAllCardsInCollectionRequest, setSentenceCardRequest } from "../../server/requests";
import { SentenceCard } from "../../server/models";
import { getUserToken } from "../../server/login";
import CenteredCircularProgress from "../shared/CenteredCircularProgress";
import { getQuizableCards } from "../../shared/util";
import { doCardCorrect, doCardIncorrect } from "./cardOperations";
import FinishedDeck from "./FinishedDeck";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function SentenceQuiz({ deck, onReturnClick}: QuizProps) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [cardsToReview, setCardsToReview] = React.useState<SentenceCard[]>([]);
    const [selectedCardIndex, setSelectedCardIndex] = React.useState(0);

    const fetchAllCards = async () => {
        setIsLoading(true);
        let cards = await getAllCardsInCollectionRequest<SentenceCard[]>(getUserToken() as string, deck.container_id);

        setCardsToReview(getQuizableCards(cards) as SentenceCard[]);

        setIsLoading(false);
    }

    const getCurrentCard = () => {
        if (cardsToReview.length === 0) {
            return null;
        }

        if (selectedCardIndex >= cardsToReview.length) {
            setCardsToReview(getQuizableCards(cardsToReview) as SentenceCard[]);
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
        setSentenceCardRequest(getUserToken() as string, deck.container_id, cardReference).then(() => {
            console.log(`${cardReference.english}を更新しました`)
        }).catch((error) => {
            console.log(`${cardReference.english}の更新に失敗しました\n${error}`);
        });

        setSelectedCardIndex(selectedCardIndex + 1);
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await fetchAllCards();
        }

        fetchData();
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
            <SentenceQuizQuestion card={currentCard} onItemSelected={onItemSelected}/>
        </Box>
    )
}