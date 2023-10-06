import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Link, Card, CardContent, CardActions, Checkbox, FormControlLabel } from '@mui/material';

interface LoginProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(email, password, rememberMe);
  };

  return (
    <div style={{ 
      backgroundImage: 'linear-gradient(#e0f2e9, #aed581)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center' 
    }}>
      <Container maxWidth="xs">
        <Card style={{ marginTop: '-30px' }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Omnia
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="メールアドレス"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                label="パスワード"
                type="password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label="ログイン状態を保存する"
              />
              <Button type="submit" variant="contained" color="success" fullWidth>
                ログイン
              </Button>
            </form>
          </CardContent>
          <CardActions>
            <Typography variant="body2" align="left">
              <Link href="/password-reset">パスワードをお忘れですか？</Link>
            </Typography>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
