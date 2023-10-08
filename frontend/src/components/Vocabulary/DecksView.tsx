import { Box, Paper, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { CardContainer } from "../../server/models";
import React from "react";
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { getAllCardCollectionsRequest, getAllTodoCardsCountInCollectionRequest } from "../../server/requests";
import { getUserToken } from "../../server/login";
import CenteredCircularProgress from "../shared/CenteredCircularProgress";
import AddDeckButton from "./AddDeckButton";

export interface DecksViewProps {
    onDeckClick: (deck: CardContainer) => void;
    hasAddButton?: boolean;
}

export default function DecksView({ onDeckClick, hasAddButton }: DecksViewProps) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [collections, setCollections] = React.useState<CardContainer[]>([]);
    const [isAddButtonVisible, setIsAddButtonVisible] = React.useState(hasAddButton ?? true);
    
    const [collectionsTodoCardsCount, setCollectionsTodoCardsCount] = React.useState<number[]>([]);

    const fetchCollections = async () => {
        setIsLoading(true);
        const request = await getAllCardCollectionsRequest(getUserToken() as string);
    
        setCollectionsTodoCardsCount(await Promise.all(request.containers.map(
            async (collection) => {
                return await getAllTodoCardsCountInCollectionRequest(getUserToken() as string, collection.container_id);
            }
        )));

        setCollections(request.containers);
        setIsLoading(false);
    };
    
    React.useEffect(() => {
        const collectionsFetch = async () => {
            await fetchCollections();
        };
    
        collectionsFetch();
    }, []);

    if (isLoading) {
        return <CenteredCircularProgress />
    }

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {
                collections.map((collection, index) => {
                    return (
                    <Card key={index}>
                        <CardActionArea onClick={() => onDeckClick(collection) }>
                        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                            <CardContent sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '10px', justifyContent: 'space-between'}}>
                                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px'}}>
                                    <Typography variant="h6">
                                    {collection.name}
                                    </Typography>
                                    <Typography variant="body1" color="gray">
                                    {collection.is_sentence ? 'Sentence Deck' : 'Word Deck'}
                                    </Typography>
                                </Box>
                                <Box display='flex' flexDirection='row'>
                                    <Typography mr='5px' variant="subtitle1" color="green">
                                        {collectionsTodoCardsCount[index]}
                                    </Typography>
                                    <ArrowForwardOutlinedIcon />
                                </Box>
                            </CardContent>
                        </Box>
                        </CardActionArea>
                    
                    </Card>
                    );
                })
                }
            </Box>

            {isAddButtonVisible ? <AddDeckButton /> : <></>}
            
        </React.Fragment>
        
    );
}