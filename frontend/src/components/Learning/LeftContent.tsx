import React, { useState } from 'react';
import { Paper, Typography, InputBase, IconButton, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchField = () => {
  const [url, setUrl] = useState<string>(''); // URLを管理する状態

  // Enterキーが押されたときの処理
  const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Enterが押されたらURLを表示
      alert(`入力されたURL: ${url}`);
    }
  };

  return (
    <div style={{ 
      backgroundImage: 'linear-gradient(#e0f2e9, #aed581)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center' 
    }}>
      <div>
        <Typography variant="h2" align="center" gutterBottom>
          Omnia
        </Typography>
        <Paper elevation={3} style={{ padding: '10px', backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
          <IconButton aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="OmniaでURLを入力"
            fullWidth
            inputProps={{ 'aria-label': 'search' }}
            style={{ flex: 1, minWidth: '300px' }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyUp={handleEnterKeyPress} 
          />
          <Divider orientation="vertical" flexItem />
          <IconButton aria-label="clear">
            <ClearIcon />
          </IconButton>
        </Paper>
      </div>
    </div>
  );
};

export default SearchField;
