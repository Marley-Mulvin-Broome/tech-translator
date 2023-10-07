import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Typography, Button, RadioGroup, FormControlLabel, Radio, LinearProgress } from '@mui/material';

interface Choice {
  text: string;
}

const RightQuiz: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const generateQuestion = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const prompt = 'Generate a quiz question:';

      const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt, // プロンプトを指定
          max_tokens: 30, // 最大トークン数を調整
          temperature: 0.7, // ランダム性を調整
        }),
      });

      const data = await response.json();
      if (data.choices[0] && data.choices[0].text) {
        setQuestion(data.choices[0].text);

        // 正しい回答を取得
        const correctAnswerResponse = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: `What is the answer to this question: ${data.choices[0].text}`,
            max_tokens: 10,
            temperature: 0.7,
          }),
        });
        const correctAnswerData = await correctAnswerResponse.json();
        const correctAnswerText = correctAnswerData.choices[0]?.text || 'No answer found';

        setCorrectAnswer(correctAnswerText);

        // 回答選択肢を生成
        const answerOptionsResponse = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: `Generate answer choices for this question: ${data.choices[0].text}`,
            max_tokens: 30,
            temperature: 0.7,
          }),
        });
        const answerOptionsData = await answerOptionsResponse.json();
        const answerOptionsList = answerOptionsData.choices.map((choice: Choice) => choice.text);

        setAnswerOptions(answerOptionsList);

        setSelectedAnswer('');
        setShowResult(false);
        setIsCorrect(false);
      } else {
        console.error('問題の生成に失敗しました:', data);
      }
    } catch (error) {
      console.error('問題の生成に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
    if (selectedAnswer === correctAnswer) {
      setIsCorrect(true);
    }
  };

  const handleGenerateQuestion = () => {
    setInitialLoad(false);
    generateQuestion();
  };

  useEffect(() => {
    if (!initialLoad) {
      // 初回のレンダリング時以外に問題を生成
      generateQuestion();
    }
  }, [initialLoad]);

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
      <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
        {answerOptions.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio color="primary" />}
            label={option}
            labelPlacement="end"
          />
        ))}
      </RadioGroup>
      {!initialLoad && !showResult && (
        <Button variant="contained" color="primary" onClick={handleCheckAnswer}>
          回答を確認
        </Button>
      )}
      {!showResult && (
        <Button variant="contained" color="primary" onClick={handleGenerateQuestion}>
          問題を解く
        </Button>
      )}
      {showResult && (
        <div>
          {isCorrect ? (
            <Typography variant="body1" color="primary" gutterBottom>
              正解です！
            </Typography>
          ) : (
            <Typography variant="body1" color="error" gutterBottom>
              不正解です。
            </Typography>
          )}
          <LinearProgress
            variant="determinate"
            value={isCorrect ? 100 : 0}
          />
        </div>
      )}
      {loading && (
        <Typography variant="body1" align="center" gutterBottom>
          問題を生成中...
        </Typography>
      )}
    </Container>
  );
};

export default RightQuiz;
