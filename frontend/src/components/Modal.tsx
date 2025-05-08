import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onTryAgain: () => void;
  onNewGame: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onTryAgain, onNewGame }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h2 className={`text-2xl font-bold mb-4 ${title.includes('Congratulations') ? 'text-green-400' : 'text-red-400'}`}>
          {title}
        </h2>
        <p className="text-white text-lg mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onTryAgain}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onNewGame}
            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal; 