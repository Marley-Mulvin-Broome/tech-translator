import { Box, Button, Grid, IconButton, Tooltip, Typography } from "@mui/material"
import { SentenceCard } from "../../server/models";
import QuizButton from "./QuizButton";
import React from "react";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export interface SentenceQuizQuestionProps {
    card: SentenceCard;
    onItemSelected: (correct: boolean) => void;
}


export default function SentenceQuizQuestion({ card, onItemSelected }: SentenceQuizQuestionProps) {
    const [isAnswerRevealed, setIsAnswerRevealed] = React.useState(false);
    const [explanationVisible, setExplanationVisible] = React.useState(false);

    const toggleAnswerRevealed = () => {
        setIsAnswerRevealed(!isAnswerRevealed);
    }

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                toggleAnswerRevealed();
            }

            if (event.code === 'Digit3') {
                setExplanationVisible(!explanationVisible);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    })

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}>
                <Typography variant="h2" align="center" sx={{ ':hover': { cursor: 'pointer' } }} onClick={() => toggleAnswerRevealed()}>
                    {isAnswerRevealed ? card.japanese : card.english}
                    
                </Typography>
                <Tooltip title="View explanation">
                    <IconButton onClick={() => setExplanationVisible(!explanationVisible)}>
                        <HelpOutlineIcon sx={{ fontSize: 30, ml: '10px' }}/>
                    </IconButton>
                </Tooltip>
            </Box>
            

            <Typography variant="subtitle1" color='gray' align="center">
                Press spacebar or click the sentence to reveal the answer
            </Typography>

            {explanationVisible && (<Typography variant="body1" align="center">{card.explanation}</Typography>)}


            <Typography variant="body1" align="center" sx={{ py: '40px' }}>
                Did you remember this sentence?
            </Typography>

            

            <Grid container spacing={2} justifyContent='flex-end'>
                <Grid item xs={5}>
                    <QuizButton correctness={"unanswered"} numpadNumber={1} onSelected={() => { onItemSelected(false) }}>
                        I didn't
                    </QuizButton>
                </Grid>
                <Grid item xs={5}>
                    <QuizButton correctness={"unanswered"} numpadNumber={2} onSelected={() => { onItemSelected(true) }}>
                        I did!
                    </QuizButton>
                </Grid>
            </Grid> 
        </Box>
    )
}