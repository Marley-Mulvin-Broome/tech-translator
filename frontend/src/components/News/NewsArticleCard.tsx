import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { RssFeed } from "../../server/models";
import NewsTagsList from "./NewsTagsList";

export default function NewsArticleCard(rssFeed: RssFeed) {
    return (
        <Card sx={{ maxWidth: 390, marginBottom: '20px' }}>
            <CardActionArea>
                <a href={rssFeed.link} target="_blank" rel="noopener noreferrer">
                    <CardMedia
                        component="img"
                        height="140"
                        image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                        alt="green iguana"/>
                </a>
            </CardActionArea>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {rssFeed.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {rssFeed.description}
                </Typography>
                <NewsTagsList tags={rssFeed.tags} />
            </CardContent>
            <CardActions>
                <a href={rssFeed.link} target="_blank" rel="noopener noreferrer">
                    <Button size="medium">
                        Read more
                    </Button>
                </a>
            </CardActions>
        </Card>
    )
}