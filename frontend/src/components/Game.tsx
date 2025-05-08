import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SudokuGrid, Difficulty } from '../../../shared/sudoku';
import Modal from './Modal';

const API_BASE_URL = 'https://sudoku-10ty.onrender.com';  // Updated to deployed backend URL
const MAX_MISTAKES = 3;

const Game: React.FC = () => {
  const { difficulty } = useParams<{ difficulty: Difficulty }>();
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState<SudokuGrid | null>(null);
  const [solution, setSolution] = useState<SudokuGrid | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [initialPuzzle, setInitialPuzzle] = useState<SudokuGrid | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
  }>({ title: '', message: '' });

  useEffect(() => {
    fetchPuzzle();
  }, [difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && !gameOver) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, gameOver]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchPuzzle = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/puzzle/${difficulty}`);
      const data = await response.json();
      setPuzzle(data.puzzle);
      setInitialPuzzle(data.puzzle);
      setSolution(data.solution);
      setError(null);
      setMistakes(0);
      setIncorrectCells(new Set());
      setGameOver(false);
      setTime(0);
      setIsTimerRunning(true);
    } catch (err) {
      setError('Failed to load puzzle');
    }
  };

  const isPresetCell = (row: number, col: number): boolean => {
    return initialPuzzle?.[row][col] !== 0;
  };

  const getCellColor = (row: number, col: number, cell: number): string => {
    if (cell === 0) return 'text-gray-300';
    if (isPresetCell(row, col)) return 'text-blue-400';
    if (incorrectCells.has(`${row}-${col}`)) return 'text-red-500';
    return 'text-white';
  };

  const getCellBackground = (row: number, col: number, cell: number): string => {
    if (!selectedCell || cell === 0) return cell === 0 ? 'bg-gray-800' : 'bg-gray-700';
    
    const [selectedRow, selectedCol] = selectedCell;
    const selectedCellValue = puzzle?.[selectedRow][selectedCol];
    
    // If the selected cell has a number, highlight all cells with the same number
    if (selectedCellValue !== 0 && cell === selectedCellValue) {
      return 'bg-blue-900';
    }
    
    // If the selected cell is empty, highlight all cells with the same number as the current cell
    if (selectedCellValue === 0 && cell !== 0) {
      return cell === puzzle?.[selectedRow][selectedCol] ? 'bg-blue-900' : 'bg-gray-700';
    }
    
    return cell === 0 ? 'bg-gray-800' : 'bg-gray-700';
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameOver) return;
    setSelectedCell([row, col]);
  };

  const checkNumber = (row: number, col: number, num: number): boolean => {
    if (!solution) return false;
    return solution[row][col] === num;
  };

  const handleGameOver = () => {
    setGameOver(true);
    setIsTimerRunning(false);
    setModalConfig({
      title: 'Game Over!',
      message: 'You have made 3 mistakes. Would you like to try again?'
    });
    setShowModal(true);
  };

  const handleVictory = () => {
    setIsTimerRunning(false);
    setModalConfig({
      title: 'Congratulations!',
      message: `You solved the puzzle in ${formatTime(time)}!`
    });
    setShowModal(true);
  };

  const handleTryAgain = () => {
    setShowModal(false);
    if (initialPuzzle) {
      setPuzzle(initialPuzzle);
      setMistakes(0);
      setIncorrectCells(new Set());
      setGameOver(false);
      setTime(0);
      setIsTimerRunning(true);
    }
  };

  const handleNewGame = () => {
    setShowModal(false);
    navigate('/');
  };

  const isNumberComplete = (num: number): boolean => {
    if (!puzzle || !solution) return false;
    let count = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] === num) {
          count++;
        }
      }
    }
    return count === 9;
  };

  const handleNumberInput = (num: number) => {
    if (!puzzle || !selectedCell || gameOver) return;

    const [row, col] = selectedCell;
    if (isPresetCell(row, col)) return;

    const newPuzzle = puzzle.map((r: number[]) => [...r]);
    newPuzzle[row][col] = num;
    setPuzzle(newPuzzle);

    if (num !== 0) {
      const isCorrect = checkNumber(row, col, num);
      if (!isCorrect) {
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        setIncorrectCells(prev => new Set([...prev, `${row}-${col}`]));
        
        if (newMistakes >= MAX_MISTAKES) {
          handleGameOver();
        }
      } else {
        setIncorrectCells(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${row}-${col}`);
          return newSet;
        });

        // Check if the puzzle is complete after each correct input
        const isComplete = newPuzzle.every((row, i) => 
          row.every((cell, j) => cell === solution?.[i][j])
        );
        if (isComplete) {
          handleVictory();
        }
      }
    } else {
      setIncorrectCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${row}-${col}`);
        return newSet;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!selectedCell || gameOver) return;

    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleNumberInput(0);
    }
  };

  const validatePuzzle = async () => {
    if (!puzzle) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ puzzle }),
      });
      const data = await response.json();
      if (data.isValid) {
        handleVictory();
      } else {
        setModalConfig({
          title: 'Not Quite Right',
          message: 'The puzzle is not valid. Keep trying!'
        });
        setShowModal(true);
      }
    } catch (err) {
      setError('Failed to validate puzzle');
    }
  };

  if (!puzzle) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-xl shadow-2xl" onKeyDown={handleKeyPress} tabIndex={0}>
      {error && <div className="text-red-400 text-center mb-4">{error}</div>}
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-white">
          Mistakes: <span className={`font-bold ${mistakes >= MAX_MISTAKES ? 'text-red-500' : 'text-blue-400'}`}>
            {mistakes}/{MAX_MISTAKES}
          </span>
        </div>
        <div className="text-white font-mono text-xl">
          {formatTime(time)}
        </div>
        {gameOver && (
          <div className="text-red-500 font-bold">
            Game Over!
          </div>
        )}
      </div>

      <div className="grid grid-cols-9 gap-[2px] bg-gray-600 p-[2px] rounded-lg">
        {puzzle.map((row: number[], rowIndex: number) =>
          row.map((cell: number, colIndex: number) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square flex items-center justify-center text-2xl font-bold
                ${getCellBackground(rowIndex, colIndex, cell)}
                ${getCellColor(rowIndex, colIndex, cell)}
                ${selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
                  ? 'ring-2 ring-blue-400'
                  : ''}
                ${(rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-2 border-gray-400' : ''}
                ${(colIndex + 1) % 3 === 0 && colIndex < 8 ? 'border-r-2 border-gray-400' : ''}
                ${rowIndex % 3 === 0 ? 'border-t-2 border-gray-400' : ''}
                ${colIndex % 3 === 0 ? 'border-l-2 border-gray-400' : ''}
                cursor-pointer hover:bg-gray-600 transition-colors
              `}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        )}
      </div>

      <div className="mt-8 grid grid-cols-9 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          !isNumberComplete(num) && (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              disabled={gameOver}
            >
              {num}
            </button>
          )
        ))}
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="py-2 px-6 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          New Game
        </button>
        <button
          onClick={handleTryAgain}
          className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
          disabled={gameOver}
        >
          Reset
        </button>
      </div>

      <Modal
        isOpen={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onTryAgain={handleTryAgain}
        onNewGame={handleNewGame}
      />
    </div>
  );
};

export default Game; 