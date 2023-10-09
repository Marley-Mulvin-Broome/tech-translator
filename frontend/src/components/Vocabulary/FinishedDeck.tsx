import { Box, Button, Typography } from "@mui/material";
import React from "react";

import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';


export default function FinishedDeck({ onReturnClick }: { onReturnClick: () => void}) {
    return (
        <React.Fragment>
            <Box mt='200px' display='flex' justifyContent='center' alignContent='baseline' flexDirection='row'>
                <Typography variant="h3" align="center" >
                    You're all done for today!
                </Typography>
                <LibraryAddCheckIcon color='success' style={{ fontSize: 50 }}/>
            </Box>
            <Box display='flex' justifyContent='center' >
                <Button size="large" style={{ }} variant="contained" onClick={onReturnClick} sx={{ mt: '20px' }}>Head back</Button>

            </Box>
        </React.Fragment>
    );
}