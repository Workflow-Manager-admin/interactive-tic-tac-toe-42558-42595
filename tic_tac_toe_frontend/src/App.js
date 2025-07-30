import React, { useState, useEffect } from 'react';
import './App.css';
import './ttt.css';

/**
 * Returns the winning line, or null if there is no winner.
 * @param {Array} squares 1D array of the board cells.
 * @returns {Array|Null} The array [a,b,c] if winning line, null if none.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return [a, b, c];
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Board cell component, styled according to highlight and value.
 * @param {*} props
 * @returns
 */
function Cell({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-cell${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `cell ${value}` : 'empty cell'}
      tabIndex={0}
      type="button"
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main App - Contains game board and controls.
 */
function App() {
  // The theme toggle logic is retained.
  const [theme, setTheme] = useState('light');
  // Board is a 9-cell array: "X", "O", or null.
  const [squares, setSquares] = useState(Array(9).fill(null));
  // true: X's turn; false: O's turn.
  const [xIsNext, setXIsNext] = useState(true);
  // Winner array: null if no win, [a,b,c] if win, or "draw"
  const winnerLine = calculateWinner(squares);
  const isDraw = squares.every(Boolean) && !winnerLine;
  const winner = winnerLine ? squares[winnerLine[0]] : null;

  // Sync theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleCellClick = (i) => {
    if (winner || squares[i]) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // Flexible colors; fall back to style guide colors
  const colors = {
    accent: '#ea4335',
    primary: '#1a73e8',
    secondary: '#34a853',
  };

  return (
    <div className="App" style={{ minHeight: '100vh', width: '100vw' }}>
      <header className="App-header" style={{ minHeight: 'auto', padding: 0, background: 'var(--bg-secondary)' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 className="ttt-title" style={{ color: colors.primary, margin: '2rem 0 0.5rem' }}>Tic Tac Toe</h1>
        <div className="ttt-board-container">
          <div className="ttt-board">
            {squares.map((cell, i) => (
              <Cell
                key={i}
                value={cell}
                highlight={winnerLine?.includes(i)}
                onClick={() => handleCellClick(i)}
              />
            ))}
          </div>
        </div>
        <div className="ttt-status-area">
          {winner ? (
            <div className="ttt-status">
              <span className="ttt-winner">Winner: <span style={{ color: colors.accent, fontWeight: 700 }}>{winner}</span></span>
            </div>
          ) : isDraw ? (
            <div className="ttt-status">
              <span className="ttt-draw" style={{ color: colors.secondary, fontWeight: 600 }}>It's a draw!</span>
            </div>
          ) : (
            <div className="ttt-status">
              <span className="ttt-turn">Current turn:&nbsp;
                <span style={{
                  color: xIsNext ? colors.primary : colors.accent,
                  fontWeight: 600,
                }}
                >
                  {xIsNext ? 'X' : 'O'}
                </span>
              </span>
            </div>
          )}
        </div>
        <button className="ttt-reset-btn" onClick={handleReset} tabIndex={0}>Reset Game</button>
        <div style={{ marginTop: 32, fontSize: 13, opacity: 0.5 }}>
          <span style={{ color: '#888' }}>Modern, minimalistic Tic Tac Toe &mdash; React, KAVIA UI</span>
        </div>
      </header>
    </div>
  );
}

export default App;
