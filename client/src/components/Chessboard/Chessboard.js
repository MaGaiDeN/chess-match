import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { loadPuzzlesFromPGN } from '../../services/puzzleService';
import './Chessboard.css';

const ChessboardComponent = () => {
  const [position, setPosition] = useState('start');
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState('Cargando puzzle...');
  
  // Mantener una referencia del juego
  const gameRef = useRef(new Chess());

  const loadRandomPuzzle = useCallback(async () => {
    try {
      const puzzles = await loadPuzzlesFromPGN();
      
      if (puzzles && puzzles.length > 0) {
        const puzzle = puzzles[0];
        console.log('Cargando puzzle:', puzzle);
        
        // Crear nueva instancia de Chess
        const chess = new Chess();
        chess.clear();
        chess.load(puzzle.fen);
        
        // Actualizar la referencia
        gameRef.current = chess;
        
        // Actualizar estados
        setPosition(puzzle.fen);
        setCurrentPuzzle(puzzle);
        setSolutionIndex(0);
        setIsComplete(false);
        setMessage('Tu turno - Encuentra el mate en dos');
      }
    } catch (error) {
      console.error('Error cargando puzzle:', error);
      setMessage('Error al cargar el puzzle');
    }
  }, []);

  useEffect(() => {
    loadRandomPuzzle();
  }, [loadRandomPuzzle]);

  const onDrop = (sourceSquare, targetSquare) => {
    if (isComplete) return false;

    try {
      const move = gameRef.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (!move) return false;

      const expectedMove = currentPuzzle.solution[solutionIndex].replace('#', '');
      const actualMove = move.san.replace('#', '');
      const isMateMove = currentPuzzle.solution[solutionIndex].includes('#');

      if (actualMove === expectedMove) {
        setPosition(gameRef.current.fen());
        
        if (isMateMove && gameRef.current.isCheckmate()) {
          setIsComplete(true);
          setMessage('¡Excelente! ¡Has encontrado el mate! 🎉');
          return true;
        }

        setMessage('¡Correcto! Espera la respuesta...');
        
        setTimeout(() => {
          const opponentMove = currentPuzzle.solution[solutionIndex + 1];
          if (!opponentMove) return;

          gameRef.current.move(opponentMove.replace('#', ''));
          setPosition(gameRef.current.fen());
          setSolutionIndex(prev => prev + 2);
          setMessage('Tu turno - Da mate');
        }, 500);

        return true;
      }

      gameRef.current.undo();
      setMessage('Movimiento incorrecto. Intenta de nuevo');
      return false;
    } catch (error) {
      console.error('Error en movimiento:', error);
      return false;
    }
  };

  return (
    <div className="chessboard-container">
      <Chessboard 
        position={position}
        onPieceDrop={onDrop}
        boardOrientation="white"
        arePremovesAllowed={false}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
        }}
      />
      <div className="puzzle-status">
        <p className={isComplete ? 'success-message' : 'message'}>
          {message}
        </p>
        {currentPuzzle && !isComplete && (
          <p className="move-counter">
            Movimiento {Math.floor(solutionIndex/2) + 1} de {Math.ceil(currentPuzzle.solution.length/2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChessboardComponent; 