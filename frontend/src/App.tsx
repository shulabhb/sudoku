import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-800">
        <header className="bg-gray-900 text-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-blue-400">Shuuu's Sudoku</h1>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:difficulty" element={<Game />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 