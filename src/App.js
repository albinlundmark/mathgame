import React, { useState, useEffect, useCallback } from 'react';
import { CssBaseline, Container, Typography, IconButton, Paper, Box, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { CSSTransition } from 'react-transition-group';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
/* eslint-disable */
function App() {
  const [expression, setExpression] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [message, setMessage] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameActive, setGameActive] = useState(false);
  const [mode, setMode] = useState('medium');
  const [initialTime, setInitialTime] = useState(5);

  useEffect(() => {
    if (gameActive) {
      generateExpression(level);
    }
  }, [level, gameActive]);

  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      handleTimeout();
    }
  }, [timeLeft, gameActive]);

  const handleKeyPress = useCallback(
    (event) => {
      if (gameActive) {
        if (event.key === 'r') {
          handleAnswer(true);
        } else if (event.key === 'f') {
          handleAnswer(false);
        }
      }
    },
    [gameActive, correctAnswer]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

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
    setTimeLeft(initialTime); // Reset timer for each new expression
  };

  const handleAnswer = (isUserCorrect) => {
    if (isUserCorrect === correctAnswer) {
      setMessage('Rätt!');
      setCorrectCount((prevCount) => prevCount + 1);
      setLevel((prevLevel) => prevLevel + 1);
    } else {
      const newHistory = [...history, { timestamp: new Date().toLocaleTimeString('sv-SE'), score: correctCount, mode }];
      setHistory(newHistory);
      setMessage(`Fel, försök igen. Du hade ${correctCount} rätta svar denna gång.`);
      setGameActive(false);
    }
  };

  const handleTimeout = () => {
    const newHistory = [...history, { timestamp: new Date().toLocaleTimeString('sv-SE'), score: correctCount, mode }];
    setHistory(newHistory);
    setMessage(`Tiden är ute! Du hade ${correctCount} rätta svar denna gång.`);
    setGameActive(false);
  };

  const startNewGame = () => {
    setCorrectCount(0);
    setLevel(1);
    setMessage('');
    setGameActive(true);
    setInitialTime(mode === 'easy' ? 7 : mode === 'medium' ? 5 : mode === 'hard' ? 3 : 5);
    setTimeLeft(mode === 'easy' ? 7 : mode === 'medium' ? 5 : mode === 'hard' ? 3 : 5);
    generateExpression(1); // Generate first expression for the new game
  };

  const handleModeChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
    setInitialTime(selectedMode === 'easy' ? 7 : selectedMode === 'medium' ? 5 : selectedMode === 'hard' ? 3 : 5);
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
            <FormControl component="fieldset" style={{ marginBottom: '20px', width: '100%' }} disabled={gameActive}>
              <FormLabel component="legend">Välj svårighetsgrad</FormLabel>
              <RadioGroup row aria-label="mode" name="mode" value={mode} onChange={handleModeChange} style={{ justifyContent: 'space-between' }}>
                <FormControlLabel value="easy" control={<Radio />} label="Lätt (7 s)" />
                <FormControlLabel value="medium" control={<Radio />} label="Medel (5 s)" />
                <FormControlLabel value="hard" control={<Radio />} label="Svår (3 s)" />
              </RadioGroup>
            </FormControl>
            <Typography variant="h6" gutterBottom>
              Korrekt: 
              <CSSTransition
                in={gameActive}
                timeout={300}
                classNames="count"
                key={correctCount}
              >
                <span>{correctCount}</span>
              </CSSTransition>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              (Använd "R" för rätt, "F" för fel)
            </Typography>
            {gameActive && (
              <>
                <Typography variant="h6" gutterBottom>
                  Tid kvar: {timeLeft}s
                </Typography>
                <Typography variant="h5" gutterBottom style={{ marginTop: '20px', textAlign: 'center' }}>
                  Är detta korrekt?
                </Typography>
                <Typography variant="h5" gutterBottom style={{ marginTop: '20px', textAlign: 'center' }}>
                  {expression}
                </Typography>
                <Box mb={2} display="flex" justifyContent="center" gap={2}>
                  <IconButton style={{ color: 'green', fontSize: 40 }} onClick={() => handleAnswer(true)}>
                    <CheckCircleIcon style={{ fontSize: 40 }} />
                  </IconButton>
                  <IconButton color="secondary" style={{ fontSize: 40 }} onClick={() => handleAnswer(false)}>
                    <CancelIcon style={{ fontSize: 40 }} />
                  </IconButton>
                </Box>
              </>
            )}
            {!gameActive && (
              <>
                <Typography variant="body1" color="secondary" style={{ marginTop: '20px' }}>
                  {message}
                </Typography>
                <Box mt={2} display="flex" justifyContent="center">
                  <Button variant="contained" color="primary" onClick={startNewGame}>
                    Starta Nytt Spel
                  </Button>
                </Box>
              </>
            )}
          </Paper>
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', width: '350px' }}>
            <Typography variant="h6" gutterBottom>
              Historia
            </Typography>
            {history.map((entry, index) => (
              <Typography key={index} variant="body2">
                {entry.timestamp}: {entry.score} rätta svar (Mode: {entry.mode})
              </Typography>
            ))}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
