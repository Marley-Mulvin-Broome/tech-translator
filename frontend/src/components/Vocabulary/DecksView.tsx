import { Box, Paper, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { CardContainer } from "../../server/models";
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { getAllCardCollectionsRequest } from "../../server/requests";
import { getUserToken } from "../../server/login";
import CenteredCircularProgress from "../shared/CenteredCircularProgress";

export interface DecksViewProps {
    onDeckClick: (deck: CardContainer) => void;
}

export default function DecksView({ onDeckClick }: DecksViewProps) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [collections, setCollections] = React.useState<CardContainer[]>([]);


    const fetchCollections = async () => {
        setIsLoading(true);
        const request = await getAllCardCollectionsRequest(getUserToken() as string);
    
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
                            <ArrowForwardOutlinedIcon />
                            </CardContent>
                        </Box>
                        </CardActionArea>
                    
                    </Card>
                    );
                })
                }
            </Box>

            <Box sx={{py: '20px'}}>
                <Paper sx={{bgcolor: '#4CAF50', display: 'flex', justifyContent: 'center', ':hover': { boxShadow: 10, cursor: 'pointer' }, p: '10px', color: 'white'}}>
                    <AddIcon />
                </Paper>
            </Box>
        </React.Fragment>
        
    );
}