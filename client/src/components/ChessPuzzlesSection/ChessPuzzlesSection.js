import React, { useState } from 'react';
import ChessboardComponent from '../Chessboard/Chessboard';
import './ChessPuzzlesSection.css';

const ChessPuzzlesSection = () => {
  const [puzzleMessage, setPuzzleMessage] = useState('');

  return (
    <section className="puzzles-section">
      <h2>Solve Chess Puzzles</h2>
      <div className="puzzle-container">
        <ChessboardComponent onPuzzleMessage={setPuzzleMessage} />
        <div className="info-puzzle">
          <div className={`puzzle-status ${
            puzzleMessage.includes('¡Excelente!') ? 'success' : 
            puzzleMessage.includes('¡Correcto!') ? 'correct' :
            puzzleMessage.includes('Incorrecto') ? 'error' : ''
          }`}>
            {puzzleMessage}
          </div>
        </div>
        <div className="puzzle-info">
          <div className="puzzle-quote">
            <p>"Puzzles are the best way to improve pattern recognition, and no site does it better."</p>
            <div className="quote-author">
              <div className="gm-avatar">
                <i className="fas fa-chess-king"></i>
              </div>
              <div className="author-info">
                <span className="gm-title">GM</span>
                <span className="author-name">Hikaru Nakamura</span>
              </div>
            </div>
          </div>
          <button className="btn-solve-puzzles">Solve Puzzles</button>
          <button className="btn-chess-today">Chess Today</button>
        </div>
      </div>
    </section>
  );
};

export default ChessPuzzlesSection; 