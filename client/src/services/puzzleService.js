import { Chess } from 'chess.js';

const parsePGN = (pgnText) => {
  try {
    console.log('Iniciando parseo de PGN...');
    const lines = pgnText.split('\n');
    const puzzles = [];
    let currentPuzzle = {};

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine === '') {
        if (currentPuzzle.event && currentPuzzle.fen && currentPuzzle.solution) {
          puzzles.push({...currentPuzzle});
          currentPuzzle = {};
        }
        continue;
      }

      if (trimmedLine.startsWith('[Event ')) {
        currentPuzzle.event = trimmedLine.match(/"([^"]+)"/)[1];
      } else if (trimmedLine.startsWith('[FEN ')) {
        currentPuzzle.fen = trimmedLine.match(/"([^"]+)"/)[1];
      } else if (trimmedLine.startsWith('[Solution ')) {
        // Extraer y procesar la solución
        const solutionStr = trimmedLine.match(/"([^"]+)"/)[1];
        currentPuzzle.solution = solutionStr.split(' ');
        currentPuzzle.id = puzzles.length + 1;
        currentPuzzle.isMate = solutionStr.includes('#');
      }
    }

    // Añadir el último puzzle si existe
    if (currentPuzzle.event && currentPuzzle.fen && currentPuzzle.solution) {
      puzzles.push({...currentPuzzle});
    }

    console.log('Puzzles parseados:', puzzles);
    return puzzles;
  } catch (error) {
    console.error('Error parseando PGN:', error);
    return [];
  }
};

export const loadPuzzlesFromPGN = async () => {
  try {
    console.log('Cargando archivo de puzzles...');
    const puzzlePath = process.env.PUBLIC_URL + '/data/puzzles/mate-en-dos-processed.pgn';
    
    const response = await fetch(puzzlePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const pgnText = await response.text();
    console.log('Contenido PGN cargado:', pgnText.length, 'bytes');
    
    const puzzles = parsePGN(pgnText);
    console.log('Puzzles antes de validación:', puzzles);
    
    // Validar cada puzzle
    const validPuzzles = puzzles.filter(puzzle => {
      if (!puzzle.fen || !puzzle.solution) {
        console.error('Puzzle incompleto:', puzzle);
        return false;
      }
      
      try {
        const chess = new Chess();
        chess.load(puzzle.fen); // Si no lanza error, el FEN es válido
        
        console.log('Puzzle válido:', {
          event: puzzle.event,
          fen: puzzle.fen,
          solution: puzzle.solution
        });
        
        return true;
      } catch (error) {
        console.error('Error validando puzzle:', puzzle.event, error);
        return false;
      }
    });

    console.log('Puzzles válidos encontrados:', validPuzzles.length);
    return validPuzzles;
  } catch (error) {
    console.error('Error cargando puzzles:', error);
    return [];
  }
};

export const getRandomPuzzle = (puzzles) => {
  if (!puzzles || puzzles.length === 0) {
    console.error('No hay puzzles disponibles');
    return null;
  }
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  const selectedPuzzle = puzzles[randomIndex];
  console.log('Puzzle seleccionado:', selectedPuzzle);
  return selectedPuzzle;
};