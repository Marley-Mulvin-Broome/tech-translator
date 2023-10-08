import { Box, Container, TextField } from "@mui/material";
import VocabularyHeader from "./VocabularyHeader";
import { Search } from "@mui/icons-material";

export interface VocabularyLayoutProps {
    children?: React.ReactNode;
}

export default function VocabularyLayout({ children }: VocabularyLayoutProps) {
    return (
        <Container maxWidth="md">
          <VocabularyHeader />

          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', mb: '10px'}}>
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5}}/>
            <TextField sx={{width: '100%'}} id="search-field" label="Search" variant="standard" />
          </Box>

          {children}

        </Container>
    )
}