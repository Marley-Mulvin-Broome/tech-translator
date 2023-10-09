import React from "react";
import { CardContainer, SentenceCard, TangoCard } from "../../server/models";
import { getAllCardsInCollectionRequest } from "../../server/requests";
import { getUserToken } from "../../server/login";
import CenteredCircularProgress from "../shared/CenteredCircularProgress";
import { Box, Button, ButtonGroup } from "@mui/material";
import CardView from "./CardView";

export interface CardsViewProps {
    selectedCollection: CardContainer;
    onReturnClick: () => void;
}

export default function CardsViews({ selectedCollection, onReturnClick }: CardsViewProps) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [cards, setCards] = React.useState<TangoCard[] | SentenceCard[]>([]);

    const fetchCards = async () => {
        setIsLoading(true);

        const request = await getAllCardsInCollectionRequest(getUserToken() as string, selectedCollection.container_id);

        request.sort((a, b) => {
            return a.due_timestamp - b.due_timestamp;
        });

        setCards(request);

        setIsLoading(false);
    }

    React.useEffect(() => {
        const cardsFetch = async () => {
            await fetchCards();
        };

        cardsFetch();
    }, []);

    if (isLoading) {
        return (
            <CenteredCircularProgress />
        )
    }

    return (
        <React.Fragment>
            <Box display={'flex'} flexDirection={'column'} gap="10px">
                {cards.map((card, index) => {
                    return (
                        <CardView key={index}  card={card} />
                    )
                })}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px'}}>
                <ButtonGroup variant="text" aria-label="outlined primary button group">
                    <Button color="info" onClick={onReturnClick}>Return</Button>
                    <Button color="success">Add Card</Button>
                </ButtonGroup>
            </Box>
            
        </React.Fragment>
        
    )
}