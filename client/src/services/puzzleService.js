const puzzles = [
  {
    id: 1,
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    solution: ["Bxf7+", "Kxf7", "Nxe5+", "Ke8", "Qh5+", "g6", "Nxg6#"],
    turnToPlay: 'w'
  },
  {
    id: 2,
    fen: "r1b1kb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1",
    solution: ["Nxe5", "Nxe5", "d4", "Nc6", "d5", "Ne7", "Qxd7#"],
    turnToPlay: 'w'
  }
];

export const loadPuzzles = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(puzzles);
    }, 500);
  });
};

export const getRandomPuzzle = (puzzles) => {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}; 