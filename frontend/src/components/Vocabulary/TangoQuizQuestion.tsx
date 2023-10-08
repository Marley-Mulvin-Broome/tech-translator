import { Box, Grid, Typography } from "@mui/material";
import { TangoCard } from "../../server/models";
import QuizButton from "./QuizButton";
import { randomItemInArray, shuffleArray } from "../../shared/util";
import React from "react";



export interface TangoQuizQuestionProps {
    card: TangoCard;
    otherCards: TangoCard[];
    onItemSelected: (correct: boolean) => void;
}

export default function TangoQuizQuestion({ card, otherCards, onItemSelected }: TangoQuizQuestionProps) {

    const randomAnswers = [ card, randomItemInArray(otherCards), randomItemInArray(otherCards), randomItemInArray(otherCards) ]

        // randomize the order of the answers
    const answers = shuffleArray(randomAnswers);

    const correctIndexes = answers.map((answer, index) => {
            if (answer.japanese === card.japanese) {
                return index;
            }
            return -1;
        }).filter((index) => index !== -1);



    const itemSelected = (index: number) => {
        const isCorrect = correctIndexes.includes(index);

        console.log(isCorrect ? "正解" : "不正解");

        onItemSelected(isCorrect);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h2" align="center">
                {card.english}
            </Typography>

            <Typography variant="body1" align="center" sx={{ py: '40px' }}>
                Choose the correct Japanese translation
            </Typography>

            <Grid container spacing={2} justifyContent='flex-end'>

                {answers.map((answer, index) => {
                    return (
                        <Grid key={index} item xs={5}>
                            <QuizButton correctness={"unanswered"} numpadNumber={index + 1} onSelected={() => { itemSelected(index) }}>
                                {answer.japanese}
                            </QuizButton>
                        </Grid>
                    )
                })}
            </Grid> 
        </Box>
    )
}