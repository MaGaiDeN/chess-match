import random
import re

def clean_solution(solution_text):
    """Limpia y valida la solución del puzzle"""
    # Buscar movimientos que terminan en mate
    moves = re.findall(r'1\.\s*(\S+)\s+(\S+)\s+2\.\s*(\S+)#', solution_text)
    if moves:
        # Tomar el primer conjunto de movimientos válidos
        move_set = moves[0]
        return f"{move_set[0]} {move_set[1]} {move_set[2]}#"
    return None

def is_valid_solution(solution):
    """Verifica si la solución es válida"""
    if not solution:
        return False
    # Debe tener exactamente 3 movimientos (blanco, negro, blanco#)
    moves = solution.split()
    if len(moves) != 3:
        return False
    # El último movimiento debe terminar en #
    if not moves[-1].endswith('#'):
        return False
    # No debe contener texto que no sean movimientos
    invalid_texts = ['Black', 'White', '"', '[', ']']
    return not any(text in solution for text in invalid_texts)

def process_pgn_file(input_file, output_file, max_lines=5000, num_puzzles=5):
    try:
        valid_puzzles = []
        current_puzzle = []
        lines_processed = 0
        
        print("Procesando archivo...")
        
        with open(input_file, 'r', encoding='latin-1') as f:
            for line in f:
                lines_processed += 1
                if lines_processed > max_lines:
                    break
                
                if line.startswith('[Event'):
                    if current_puzzle:
                        puzzle_text = ''.join(current_puzzle)
                        event_match = re.search(r'\[Event "([^"]+)"\]', puzzle_text)
                        fen_match = re.search(r'\[FEN "([^"]+)"\]', puzzle_text)
                        
                        if event_match and fen_match:
                            solution = clean_solution(puzzle_text)
                            if solution and is_valid_solution(solution):
                                processed_puzzle = (
                                    f'[Event "{event_match.group(1)}"]\n'
                                    f'[FEN "{fen_match.group(1)}"]\n'
                                    f'[Solution "{solution}"]'
                                )
                                valid_puzzles.append(processed_puzzle)
                                print(f"Puzzle válido encontrado: {solution}")
                    current_puzzle = []
                current_puzzle.append(line)
        
        # Procesar el último puzzle
        if current_puzzle:
            puzzle_text = ''.join(current_puzzle)
            event_match = re.search(r'\[Event "([^"]+)"\]', puzzle_text)
            fen_match = re.search(r'\[FEN "([^"]+)"\]', puzzle_text)
            
            if event_match and fen_match:
                solution = clean_solution(puzzle_text)
                if solution and is_valid_solution(solution):
                    processed_puzzle = (
                        f'[Event "{event_match.group(1)}"]\n'
                        f'[FEN "{fen_match.group(1)}"]\n'
                        f'[Solution "{solution}"]'
                    )
                    valid_puzzles.append(processed_puzzle)
                    print(f"Puzzle válido encontrado: {solution}")
        
        print(f"\nProcesadas {lines_processed} líneas")
        print(f"Encontrados {len(valid_puzzles)} puzzles válidos")
        
        if valid_puzzles:
            selected_puzzles = random.sample(valid_puzzles, min(num_puzzles, len(valid_puzzles)))
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write('\n\n'.join(selected_puzzles))
            
            print(f"\nPuzzles seleccionados:")
            for i, puzzle in enumerate(selected_puzzles, 1):
                print(f"\nPuzzle {i}:")
                print(puzzle)
            
            return len(selected_puzzles)
        return 0
            
    except Exception as e:
        print(f"Error al procesar el archivo: {e}")
        raise

if __name__ == '__main__':
    input_file = 'client/public/data/puzzles/mate-en-dos.pgn'
    output_file = 'client/public/data/puzzles/mate-en-dos-processed.pgn'
    
    try:
        num_puzzles = process_pgn_file(input_file, output_file, max_lines=5000, num_puzzles=5)
        print(f"\nArchivo procesado exitosamente. Se seleccionaron {num_puzzles} puzzles.")
    except Exception as e:
        print(f"Error al procesar el archivo: {e}") 