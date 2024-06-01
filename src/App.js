import React, { useState, useEffect } from 'react';
import { CssBaseline, Container, Typography, IconButton, Paper, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark', // Set the theme to dark
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [expression, setExpression] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [message, setMessage] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    generateExpression(level);
  }, [level]);

  const generateExpression = (level) => {
    const num1 = Math.floor(Math.random() * (2 * level)) + 1;
    const num2 = Math.floor(Math.random() * (2 * level)) + 1;
    const operators = ['+', '-'];
    let operator = operators[Math.floor(Math.random() * operators.length)];

    // Ensure no negative results
    if (operator === '-' && num1 < num2) {
      operator = '+';
    }

    const correctResult = operator === '+' ? num1 + num2 : num1 - num2;
    const isCorrect = Math.random() < 0.5;

    let displayedResult;
    if (isCorrect) {
      displayedResult = correctResult;
    } else {
      displayedResult = correctResult + Math.floor(Math.random() * 3) + 1; // Add some offset to make it incorrect
    }

    setExpression(`${num1} ${operator} ${num2} = ${displayedResult}`);
    setCorrectAnswer(isCorrect);
    setMessage('');
  };

  const handleAnswer = (isUserCorrect) => {
    if (isUserCorrect === correctAnswer) {
      setMessage('Rätt!');
      setCorrectCount(correctCount + 1);
      setLevel(level + 1);
    } else {
      const newHistory = [...history, { timestamp: new Date().toLocaleString(), score: correctCount }];
      setHistory(newHistory);
      setMessage(`Fel, försök igen. Du hade ${correctCount} rätta svar denna gång.`);
      setLevel(1);
      setCorrectCount(0);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Box display="flex" justifyContent="space-between">
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', flex: 1, marginRight: '10px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Mattespel
            </Typography>
            <Typography variant="h6" gutterBottom>
              Korrekt: {correctCount}
            </Typography>
            <Typography variant="h5" gutterBottom style={{ marginTop: '20px', textAlign: 'center' }}>
              Är detta korrekt?
            </Typography>
            <Typography variant="h5" gutterBottom style={{ marginTop: '20px', textAlign: 'center' }}>
              {expression}
            </Typography>
            <Box mb={2} display="flex" justifyContent="space-around">
              <IconButton style={{ color: 'green', fontSize: 40 }} onClick={() => handleAnswer(true)}>
                <CheckCircleIcon style={{ fontSize: 40 }} />
              </IconButton>
              <IconButton color="secondary" style={{ fontSize: 40 }} onClick={() => handleAnswer(false)}>
                <CancelIcon style={{ fontSize: 40 }} />
              </IconButton>
            </Box>
            {message && (
              <Typography variant="body1" color={message.startsWith('Rätt!') ? 'primary' : 'secondary'} style={{ marginTop: '20px' }}>
                {message}
              </Typography>
            )}
          </Paper>
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', width: '250px' }}>
            <Typography variant="h6" gutterBottom>
              Historia
            </Typography>
            {history.map((entry, index) => (
              <Typography key={index} variant="body2">
                {entry.timestamp}: {entry.score} rätta svar
              </Typography>
            ))}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
