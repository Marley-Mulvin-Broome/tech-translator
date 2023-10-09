import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { SentenceCard, TangoCard } from "../../server/models";
import EditIcon from '@mui/icons-material/Edit';


export interface CardViewProps {
    card: TangoCard | SentenceCard
}

export default function CardView({card }: CardViewProps) {
    return (

        <Card>
            <CardActionArea>
                <CardContent>
                    <Box display='flex' flexDirection={'row'} gap="5px" justifyContent="space-between">
                        <Box display='flex' flexDirection={'row'} gap="20px">
                            <Typography variant="body1" color='green'>
                                {card.english}
                            </Typography>

                            <Typography variant="subtitle2" mt='2px'>
                                {card.japanese}
                            </Typography>
                        </Box>

                        <EditIcon />
                    </Box>
                </CardContent>
            </CardActionArea>
            
        </Card>
    );
}