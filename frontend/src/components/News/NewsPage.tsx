import React from 'react';
import { getRssRequest } from '../../server/requests';
import { getUserToken } from '../../server/login';
import { useNavigate } from 'react-router-dom';
import { RssFeed, RssFeedEntriesModel } from '../../server/models';
import { Card, CircularProgress, Container, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import NewsArticleCard from './NewsArticleCard';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import NewsHeader from './NewsHeader';

const rssUrls = [
  "https://www.theguardian.com/uk/rss"
]

const NewsPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [newsEntries, setNewsEntries] = React.useState<RssFeed[]>([]);
  const navigate = useNavigate();

  const fetchNews = async () => {
    setIsLoading(true);

    const token = getUserToken();

    if (token === null) {
      navigate('/login');
    }

    const response = await getRssRequest(token as string, {
      urls: rssUrls,
      limit: 5,
    });

    const feed: RssFeed[] = [];

    for (let i = 0; i < response.length; i++) {
      for (let j = 0; j < response[i].entries.length; j++) {
        feed.push(response[i].entries[j]);
      }
    }

    setNewsEntries(feed);
    setIsLoading(false);
  }

  React.useEffect(() => {
    const dataFetch = async () => {
      await fetchNews();
    }

    dataFetch();
  }, []);


  if (isLoading) {
    return (

      <Container maxWidth="md" style={{background: ''}}>

        <NewsHeader />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '200px' }}>
          <CircularProgress />
        </div>
      </Container>
      
    );
  }

  return (
    <Container maxWidth="md" style={{background: ''}}>
      <NewsHeader />
      
      
      <div style={{display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap'}}>
        {newsEntries.map((entry, index) => {
            return (
                <NewsArticleCard key={index} {...entry} />
            );
          })}
      </div>
        
    </Container>
    
  );
};

export default NewsPage;
