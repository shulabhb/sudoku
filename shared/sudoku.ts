export type SudokuGrid = number[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

export class SudokuGenerator {
  private static readonly GRID_SIZE = 9;
  private static readonly EMPTY_CELL = 0;

  static generatePuzzle(difficulty: Difficulty): SudokuGrid {
    const grid = this.createEmptyGrid();
    this.fillDiagonal(grid);
    this.solveSudoku(grid);
    return this.removeNumbers(grid, difficulty);
  }

  static createEmptyGrid(): SudokuGrid {
    return Array(this.GRID_SIZE).fill(null).map(() => Array(this.GRID_SIZE).fill(this.EMPTY_CELL));
  }

  static fillDiagonal(grid: SudokuGrid): void {
    for (let i = 0; i < this.GRID_SIZE; i += 3) {
      this.fillBox(grid, i, i);
    }
  }

  private static fillBox(grid: SudokuGrid, row: number, col: number): void {
    const nums = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let index = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        grid[row + i][col + j] = nums[index++];
      }
    }
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  static solveSudoku(grid: SudokuGrid): boolean {
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    const nums = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of nums) {
      if (this.isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num;
        if (this.solveSudoku(grid)) return true;
        grid[row][col] = this.EMPTY_CELL;
      }
    }
    return false;
  }

  private static findEmptyCell(grid: SudokuGrid): [number, number] | null {
    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (grid[i][j] === this.EMPTY_CELL) {
          return [i, j];
        }
      }
    }
    return null;
  }

  private static isValidPlacement(grid: SudokuGrid, row: number, col: number, num: number): boolean {
    return (
      this.isValidRow(grid, row, num) &&
      this.isValidColumn(grid, col, num) &&
      this.isValidBox(grid, row - (row % 3), col - (col % 3), num)
    );
  }

  private static isValidRow(grid: SudokuGrid, row: number, num: number): boolean {
    return !grid[row].includes(num);
  }

  private static isValidColumn(grid: SudokuGrid, col: number, num: number): boolean {
    return !grid.some(row => row[col] === num);
  }

  private static isValidBox(grid: SudokuGrid, startRow: number, startCol: number, num: number): boolean {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }
    return true;
  }

  static removeNumbers(grid: SudokuGrid, difficulty: Difficulty): SudokuGrid {
    const puzzle = grid.map(row => [...row]);
    const cellsToRemove = this.getCellsToRemove(difficulty);
    const positions = this.shuffleArray(
      Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
    );

    for (let i = 0; i < cellsToRemove; i++) {
      const [row, col] = positions[i];
      puzzle[row][col] = this.EMPTY_CELL;
    }

    return puzzle;
  }

  private static getCellsToRemove(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy':
        return 30;
      case 'medium':
        return 40;
      case 'hard':
        return 50;
      default:
        return 30;
    }
  }
}

export class SudokuValidator {
  static isValid(grid: SudokuGrid): boolean {
    // Check rows
    for (let i = 0; i < 9; i++) {
      if (!this.isValidRow(grid, i)) return false;
    }

    // Check columns
    for (let i = 0; i < 9; i++) {
      if (!this.isValidColumn(grid, i)) return false;
    }

    // Check 3x3 boxes
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        if (!this.isValidBox(grid, i, j)) return false;
      }
    }

    return true;
  }

  private static isValidRow(grid: SudokuGrid, row: number): boolean {
    const seen = new Set();
    for (let i = 0; i < 9; i++) {
      const num = grid[row][i];
      if (num !== 0) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
    return true;
  }

  private static isValidColumn(grid: SudokuGrid, col: number): boolean {
    const seen = new Set();
    for (let i = 0; i < 9; i++) {
      const num = grid[i][col];
      if (num !== 0) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
    return true;
  }

  private static isValidBox(grid: SudokuGrid, startRow: number, startCol: number): boolean {
    const seen = new Set();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const num = grid[startRow + i][startCol + j];
        if (num !== 0) {
          if (seen.has(num)) return false;
          seen.add(num);
        }
      }
    }
    return true;
  }
} 