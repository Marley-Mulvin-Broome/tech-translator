import { Button, Paper, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NewsHeader() {
    return (
        <div style={{paddingTop: '25px', paddingBottom: '50px'}}>
            <Paper style={{backgroundColor: '#FF8C00', paddingTop: '20px',justifyContent: 'flex-start', alignContent: 'center' }}>

                    <Typography variant="h1" align="center" color='white' >
                        News
                    </Typography>
            </Paper>
            
        </div>
        
    );
}