import React from 'react';
import ChessboardComponent from '../Chessboard/Chessboard';
import './ChessPuzzlesSection.css';

const ChessPuzzlesSection = () => {
  return (
    <section className="puzzles-section">
      <h2>Solve Chess Puzzles</h2>
      <div className="puzzle-container">
        <ChessboardComponent />
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
    </section>
  );
};

export default ChessPuzzlesSection; 