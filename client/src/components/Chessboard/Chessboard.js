import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { loadPuzzles, getRandomPuzzle } from '../../services/puzzleService';
import './Chessboard.css';

const ChessboardComponent = ({ onPuzzleMessage }) => {
  console.log('Renderizando ChessboardComponent');
  
  const [game, setGame] = useState(() => {
    console.log('Inicializando estado game');
    return new Chess();
  });
  
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [boardWidth, setBoardWidth] = useState(400);

  useEffect(() => {
    console.log('Ejecutando useEffect de carga de puzzle');
    const loadRandomPuzzle = async () => {
      try {
        const puzzles = await loadPuzzles();
        console.log('Puzzles cargados:', puzzles);

        if (puzzles && puzzles.length > 0) {
          const puzzle = getRandomPuzzle(puzzles);
          console.log('Puzzle seleccionado:', puzzle);

          const newGame = new Chess();
          
          newGame.clear();
          
          const cleanFen = puzzle.fen.trim();
          console.log('FEN limpio:', cleanFen);
          
          try {
            const success = newGame.load(cleanFen);
            console.log('Estado del tablero después de cargar:', newGame.fen());
            
            if (success) {
              console.log('FEN cargado exitosamente');
              setGame(newGame);
              setCurrentPuzzle(puzzle);
              setCurrentMoveIndex(0);
              
              const movesForMate = Math.ceil(puzzle.solution.length / 2);
              onPuzzleMessage(`${puzzle.turnToPlay === 'w' ? 'Blancas' : 'Negras'} juegan - Mate en ${movesForMate}`);
            } else {
              throw new Error('Error al cargar FEN');
            }
          } catch (error) {
            console.error('Error específico al cargar FEN:', error.message);
            try {
              const alternativeGame = new Chess(cleanFen);
              console.log('FEN cargado con método alternativo');
              setGame(alternativeGame);
              setCurrentPuzzle(puzzle);
              setCurrentMoveIndex(0);
              
              const movesForMate = Math.ceil(puzzle.solution.length / 2);
              onPuzzleMessage(`${puzzle.turnToPlay === 'w' ? 'Blancas' : 'Negras'} juegan - Mate en ${movesForMate}`);
            } catch (altError) {
              console.error('Error en método alternativo:', altError.message);
            }
          }
        }
      } catch (error) {
        console.error('Error en loadRandomPuzzle:', error);
      }
    };

    loadRandomPuzzle();
  }, [onPuzzleMessage]);

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector('.board-wrapper');
      if (container) {
        const width = Math.min(container.offsetWidth, 400);
        setBoardWidth(width);
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions(); // Llamada inicial

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const makeComputerMove = () => {
    if (!currentPuzzle || !game || currentMoveIndex >= currentPuzzle.solution.length) {
      console.log('Puzzle completado');
      return;
    }
    
    console.log('Realizando movimiento del computador');
    console.log('Índice actual:', currentMoveIndex);
    console.log('Turno actual:', game.turn());
    console.log('Solución completa:', currentPuzzle.solution);
    
    try {
      if (game.turn() === 'b') {
        const nextMove = currentPuzzle.solution[currentMoveIndex + 1];
        if (!nextMove) {
          console.log('No hay más movimientos');
          return;
        }

        const move = game.move(nextMove);
        if (move) {
          console.log('Movimiento del computador realizado:', move.san);
          setGame(new Chess(game.fen()));
          setCurrentMoveIndex(prev => prev + 1);
          
          const movesLeft = Math.ceil((currentPuzzle.solution.length - currentMoveIndex - 2) / 2);
          onPuzzleMessage(`Tu turno - ${movesLeft > 0 ? `Mate en ${movesLeft}` : 'Dale mate'}`);
        }
      }
    } catch (error) {
      console.log('Puzzle completado');
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    console.log('Intento de movimiento:', sourceSquare, 'a', targetSquare);
    if (!currentPuzzle || !game) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (!move) {
        console.log('Movimiento inválido');
        return false;
      }

      console.log('Movimiento realizado:', move.san);
      console.log('Movimiento esperado:', currentPuzzle.solution[currentMoveIndex]);

      if (move.san === currentPuzzle.solution[currentMoveIndex]) {
        setGame(new Chess(game.fen()));
        setCurrentMoveIndex(prev => prev + 1);
        
        if (move.san.includes('#')) {
          onPuzzleMessage('¡Excelente! ¡Puzzle completado!');
          return true;
        }
        
        onPuzzleMessage('¡Correcto! Pensando...');
        
        setTimeout(() => {
          makeComputerMove();
        }, 500);
        
        return true;
      } else {
        game.undo();
        onPuzzleMessage('Movimiento incorrecto - Intenta de nuevo');
        return false;
      }
    } catch (error) {
      console.error('Error al realizar movimiento:', error);
      return false;
    }
  };

  console.log('Estado actual del juego:', game?.fen());
  
  return (
    <div className="chessboard-container">
      <div className="board-wrapper">
        <Chessboard 
          position={game?.fen()}
          onPieceDrop={onDrop}
          boardWidth={boardWidth}
          customDragLayer={false}
          boardOrientation={currentPuzzle?.turnToPlay === 'b' ? 'black' : 'white'}
          transitionDuration={200}
        />
      </div>
    </div>
  );
};

export default ChessboardComponent; 