import { Box, Paper } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';


const AddDeckButton = () => {
    return (
        <Box sx={{py: '20px'}}>
            <Paper sx={{bgcolor: '#4CAF50', display: 'flex', justifyContent: 'center', ':hover': { boxShadow: 10, cursor: 'pointer' }, p: '10px', color: 'white'}}>
                <AddIcon />
            </Paper>
        </Box>
    )
}

export default AddDeckButton;