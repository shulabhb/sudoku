import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Difficulty } from '../../../shared/sudoku';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const difficulties: { label: string; value: Difficulty }[] = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  const handleDifficultySelect = (difficulty: Difficulty) => {
    navigate(`/game/${difficulty}`);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Select Difficulty</h2>
      <div className="space-y-4">
        {difficulties.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleDifficultySelect(value)}
            className="w-full py-4 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home; 