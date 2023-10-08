import { Button } from "@mui/material";
import React from "react";

export type QuizButtonCorrectness = "correct" | "incorrect" | "unanswered";

export interface QuizButtonProps {
    children?: React.ReactNode;
    numpadNumber: number;
    onSelected: (numpadNumber: number) => void;
    correctness: QuizButtonCorrectness;
}

export default function QuizButton({ children, numpadNumber, onSelected, correctness }: QuizButtonProps) {
    React.useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === numpadNumber.toString() && onSelected) {
                onSelected(numpadNumber);
            }
        }

        document.addEventListener('keydown', handler);

        return () => {
            document.removeEventListener('keydown', handler);
        };
    });

    const correctnessStyling = () => {
        switch (correctness) {
            case 'correct':
                return 'success';
            case 'incorrect':
                return 'error';
            default:
                return 'primary';
        }
    }

    return (
        <Button color={correctnessStyling()} onClick={() => onSelected(numpadNumber)} sx={{ pr: '25px', fontSize: '25px' }} size="large" variant="contained">
            <span style={{ backgroundColor: '#002984', paddingRight: '5px', paddingLeft: '5px', width: '20px', height: '35px', borderRadius: '5px', fontSize: '20px', marginRight: '5px'}}>{numpadNumber}</span> {children}
        </Button>
    )
}