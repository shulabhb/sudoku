import express from 'express';
import cors from 'cors';
import { SudokuGenerator, SudokuValidator, Difficulty } from '../../shared/sudoku';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Generate a new Sudoku puzzle
app.get('/api/puzzle/:difficulty', (req, res) => {
  const difficulty = req.params.difficulty as Difficulty;
  try {
    // Generate a solved grid first
    const grid = SudokuGenerator.createEmptyGrid();
    SudokuGenerator.fillDiagonal(grid);
    SudokuGenerator.solveSudoku(grid);
    
    // Create a copy of the solution
    const solution = grid.map(row => [...row]);
    
    // Remove numbers to create the puzzle
    const puzzle = SudokuGenerator.removeNumbers(grid, difficulty);
    
    res.json({ puzzle, solution });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate puzzle' });
  }
});

// Validate a Sudoku puzzle
app.post('/api/validate', (req, res) => {
  const { puzzle } = req.body;
  try {
    const isValid = SudokuValidator.isValid(puzzle);
    res.json({ isValid });
  } catch (error) {
    res.status(400).json({ error: 'Invalid puzzle format' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 