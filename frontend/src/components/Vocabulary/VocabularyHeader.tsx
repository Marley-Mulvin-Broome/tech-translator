import { Paper, Typography } from "@mui/material";

export default function VocabularyHeader() {
    return (
        <div style={{paddingTop: '25px', paddingBottom: '50px'}}>
            <Paper style={{backgroundColor: '#4CAF50', paddingTop: '20px',justifyContent: 'flex-start', alignContent: 'center' }}>

                    <Typography variant="h1" align="center" color='white' >
                        Your Decks
                    </Typography>
            </Paper>
            
        </div>
        
    );
}