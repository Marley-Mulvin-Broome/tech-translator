import React, { useState, useRef, useEffect } from 'react';
import {
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UserIcon from '@mui/icons-material/AccountCircle'; // ユーザーアイコン
import AiIcon from '@mui/icons-material/Android'; // AIアイコン

const RightQuiz = () => {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; ai: string }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // OpenAI APIのアクセスキー
  const openaiApiKey = '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';

  // ユーザーの最初のメッセージ
  const userMessage = "こんにちは、あなたの名前は何ですか？";

  // 初期のAIの応答
  const initialAiResponse = "私の名前はAIです。どのようにお手伝いできますか？";

  // チャットが開始された状態
  const [conversation, setConversation] = useState<{ user: string; ai: string }[]>([
    { user: userMessage, ai: initialAiResponse },
  ]);

  const callOpenAI = async (userMessage: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          prompt: conversation.map(({ user, ai }) => `${user}\n${ai}`).join('\n') + `\n ${userMessage}\n`,
          max_tokens: 10, // 応答の最大トークン数
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      return data.choices[0].text; // APIからの応答テキストを取得
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return 'AI response error';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage = inputText;

    // OpenAI APIを呼び出してAIの応答を取得
    const aiResponse = await callOpenAI(userMessage);

    // チャット履歴にユーザーとAIのメッセージを追加
    setConversation((prevConversation) => [
      ...prevConversation,
      { user: `User: ${userMessage}`, ai: `AI: ${aiResponse}` },
    ]);
    setInputText('');
  };

  // チャットが更新されたら自動的にスクロール
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <Container maxWidth="xl" style={{ marginTop: '20px', width: '100%' }}>
        <Typography variant="h5">Chat with kAI</Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          mt={2}
        >
          <div
            ref={chatContainerRef}
            style={{
              overflowY: 'auto',
              maxHeight: '180px', // チャットコンテナの最大高さ
              marginBottom: '20px',
              width: '100%', // チャット画面全体の幅を100%に設定
            }}
          >
            {conversation.map((message, index) => (
              <Grid container key={index}>
                <Grid item xs={6}>
                  {message.ai && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                      <Avatar style={{ marginRight: '4px', width: '24px', height: '24px' }}>
                        <AiIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body1" paragraph style={{ textAlign: 'left' }}>
                        {message.ai}
                      </Typography>
                    </div>
                  )}
                </Grid>
                <Grid item xs={6}>
                  {message.user && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                      <Typography variant="body1" paragraph style={{ textAlign: 'right' }}>
                        {message.user}
                      </Typography>
                      <Avatar style={{ marginLeft: '4px', width: '24px', height: '24px' }}>
                        <UserIcon fontSize="small" />
                      </Avatar>
                    </div>
                  )}
                </Grid>
              </Grid>
            ))}
          </div>
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            fullWidth
            label="Type a message..."
            variant="outlined"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <IconButton color="primary" aria-label="send" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
    </Container>
  );
};

export default RightQuiz;
