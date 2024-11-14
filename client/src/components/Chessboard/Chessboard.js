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
  
  const gameRef = useRef(new Chess());

  const loadRandomPuzzle = useCallback(async () => {
    try {
      const puzzles = await loadPuzzlesFromPGN();
      
      if (puzzles && puzzles.length > 0) {
        const puzzle = puzzles[0];
        console.log('Cargando puzzle:', puzzle);
        console.log('Tipo de FEN:', typeof puzzle.fen);
        
        const game = new Chess();
        console.log('Estado inicial del tablero:', game.fen());
        
        const fen = puzzle.fen.trim();
        console.log('FEN después de trim:', fen);
        
        try {
          // Intentar cargar el FEN y verificar si la posición resultante coincide
          game.load(fen);
          const resultingFen = game.fen();
          console.log('FEN cargado:', resultingFen);
          
          // Verificar si la posición se cargó correctamente comparando FENs
          if (resultingFen !== fen) {
            console.log('FEN original:', fen);
            console.log('FEN resultante:', resultingFen);
            throw new Error('La posición cargada no coincide con la esperada');
          }
          
          gameRef.current = game;
          setPosition(resultingFen);
          setCurrentPuzzle(puzzle);
          setSolutionIndex(0);
          setIsComplete(false);
          setMessage('Tu turno - Encuentra el mate en dos');
          
        } catch (fenError) {
          console.error('Error detallado:', fenError);
          throw new Error(`Error al cargar FEN: ${fenError.message}`);
        }
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
      
      console.log('Movimiento esperado:', expectedMove);
      console.log('Movimiento realizado:', actualMove);

      if (actualMove === expectedMove) {
        setPosition(gameRef.current.fen());
        
        if (solutionIndex === currentPuzzle.solution.length - 1) {
          setIsComplete(true);
          setMessage('¡Excelente! ¡Has encontrado el mate! 🎉');
          return true;
        }

        setMessage('¡Correcto! Espera la respuesta...');
        
        setTimeout(() => {
          const opponentMove = currentPuzzle.solution[solutionIndex + 1];
          if (opponentMove) {
            gameRef.current.move(opponentMove.replace('#', ''));
            setPosition(gameRef.current.fen());
            setSolutionIndex(prev => prev + 2);
            setMessage('Tu turno - Da mate');
          }
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