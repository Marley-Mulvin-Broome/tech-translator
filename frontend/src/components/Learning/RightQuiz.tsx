import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const RightQuiz: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generateQuestion = async () => {
    setLoading(true);
    try {
      // OpenAI APIを呼び出して問題と選択肢を生成
      const response = await fetch('/api/generate-question', {
        method: 'GET',
        headers: {
          Authorization: '', // OpenAIのAPIキーを指定
        },
      });
      if (response.ok) {
        const questionData = await response.json();
        setQuestion(questionData.question);
        setAnswer(''); // 新しい問題が生成されたら回答をリセット
      } else {
        console.error('問題の生成に失敗しました:', response.statusText);
      }
    } catch (error) {
      console.error('問題の生成に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  useEffect(() => {
    // 初回のレンダリング時に問題を生成
    generateQuestion();
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" gutterBottom>
        問題
      </Typography>
      <Typography variant="body1" gutterBottom>
        以下の問題に回答してください：
      </Typography>
      <Typography variant="body1" gutterBottom>
        {question}
      </Typography>
      <RadioGroup value={answer} onChange={handleAnswerChange}>
        <FormControlLabel
          value="option1"
          control={<Radio color="primary" />}
          label="選択肢 1"
          labelPlacement="end"
        />
        <FormControlLabel
          value="option2"
          control={<Radio color="primary" />}
          label="選択肢 2"
          labelPlacement="end"
        />
      </RadioGroup>
      {loading ? (
        <Typography variant="body1" align="center" gutterBottom>
          問題を生成中...
        </Typography>
      ) : (
        <Button variant="contained" color="primary" onClick={generateQuestion}>
          次の問題へ
        </Button>
      )}
    </Container>
  );
};

export default RightQuiz;
