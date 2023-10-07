import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Container,
  Typography,
  Button,
  Checkbox,
  LinearProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  FormGroup,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';

interface Choice {
  text: string;
}

const RightQuiz: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [shouldRestartQuiz, setShouldRestartQuiz] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isRainingStars, setIsRainingStars] = useState<boolean>(false);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    generateQuestion();
  };

  const handleRestartQuiz = () => {
    setShouldRestartQuiz(false);
    setQuestionCount(0);
    setScore(0);
    setOpenDialog(false);
    generateQuestion();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNextQuestion = () => {
    if (questionCount < 10) {
      generateQuestion();
    } else {
      setOpenDialog(true);
    }
  };

  const generateQuestion = async () => {
    setLoading(true);
    try {
      // 問題を生成するAPIコールを行う
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const prompt = 'Generate a quiz question in English:';

      const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 30,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data.choices[0] && data.choices[0].text) {
        const generatedQuestion = data.choices[0].text;

        // 問題文をセット
        setQuestion(generatedQuestion);

        // 問題に対する正しい回答を取得するAPIコールを行う
        const correctAnswerPrompt = `What is the answer to this question: ${generatedQuestion}`;
        const correctAnswerResponse = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: correctAnswerPrompt,
            max_tokens: 10,
            temperature: 0.7,
          }),
        });

        const correctAnswerData = await correctAnswerResponse.json();
        const correctAnswerText = correctAnswerData.choices[0]?.text || 'No answer found';

        // 正解をセット
        setCorrectAnswers([correctAnswerText]);

        // 回答選択肢を生成するAPIコールを行う
        const answerOptionsPrompt = `Generate answer choices for this question: ${generatedQuestion}`;
        const answerOptionsResponse = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: answerOptionsPrompt,
            max_tokens: 30,
            temperature: 0.7,
          }),
        });

        const answerOptionsData = await answerOptionsResponse.json();
        const answerOptionsList = answerOptionsData.choices.map((choice: Choice) => choice.text);

        // 選択肢をシャッフルしてセット
        const shuffledOptions = shuffleArray(answerOptionsList);
        setAnswerOptions(shuffledOptions);

        setSelectedAnswers([]);
        setShowResult(false);
        setIsCorrect(false);
        setIsRainingStars(false);
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
    const value = event.target.value;
    const isChecked = selectedAnswers.includes(value);
    if (isChecked) {
      // 既に選択されていた場合、選択を解除
      setSelectedAnswers(selectedAnswers.filter((answer) => answer !== value));
    } else {
      // 選択されていなかった場合、選択
      setSelectedAnswers([...selectedAnswers, value]);
    }
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
    const isAnswerCorrect = arraysEqual(selectedAnswers.sort(), correctAnswers.sort());
    if (isAnswerCorrect) {
      setIsCorrect(true);
      setScore(score + 1);
      setIsRainingStars(true);
    }
    setQuestionCount(questionCount + 1);
  };

  const arraysEqual = (arr1: string[], arr2: string[]) => {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
  };

  const shuffleArray = (array: string[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
    if (!quizStarted && !shouldRestartQuiz) {
      setOpenDialog(false);
    }
  }, [quizStarted, shouldRestartQuiz]);

  useEffect(() => {
    if (!quizStarted) {
      setShouldRestartQuiz(false);
    }
  }, [quizStarted]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" gutterBottom>
        Quiz
      </Typography>

      {!quizStarted && !shouldRestartQuiz && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartQuiz}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          >
            クイズを始める
          </Button>
        </Box>
      )}

      {quizStarted && loading && (
        <Typography variant="body1" align="center" gutterBottom>
          問題を生成中...
        </Typography>
      )}

      {quizStarted && !loading && !shouldRestartQuiz && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body1" gutterBottom>
            以下の問題に回答してください：
          </Typography>
          <Typography variant="body1" gutterBottom>
            {question}
          </Typography>
          <Typography variant="body1" gutterBottom>
            (正解は複数選択可)
          </Typography>
          <FormGroup>
            <Grid container spacing={1}>
              {answerOptions.map((option, index) => (
                <Grid item xs={3} key={index}>
                  <Checkbox
                    value={option}
                    color="primary"
                    checked={selectedAnswers.includes(option)}
                    onChange={handleAnswerChange}
                  />
                  {option}
                </Grid>
              ))}
            </Grid>
          </FormGroup>
          {!showResult && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckAnswer}
              startIcon={<CheckIcon />}
              style={{ marginTop: '20px', marginBottom: '20px' }}
            >
              回答する
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
                  不正解です。正解は {correctAnswers.join(', ')} です。
                </Typography>
              )}
              <LinearProgress
                variant="determinate"
                value={(score / 10) * 100}
                style={{ marginTop: '20px', marginBottom: '20px' }}
              />
              {isRainingStars && (
                <div className="stars-container">
                  {/* 星アイコンを表示する */}
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                </div>
              )}
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextQuestion}
            disabled={!showResult}
            endIcon={<ArrowForwardIcon />}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          >
            {questionCount === 9 ? '結果を表示' : '次の問題へ'}
          </Button>
        </Box>
      )}

      {quizStarted && shouldRestartQuiz && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleRestartQuiz}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          >
            新しいクイズを解く
          </Button>
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="quiz-dialog-title"
      >
        <DialogTitle id="quiz-dialog-title">クイズ結果</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`正解数: ${score} / 10`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RightQuiz;
