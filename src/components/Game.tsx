import React from 'react';
import { useBlockGame } from '../hooks/useBlockGame';
import { Block } from './Block';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Clock, Trophy, RefreshCw, AlertTriangle } from 'lucide-react';
import { BLOCK_SIZE, COLS, ROWS } from '../types';

export const Game = () => {
  const { gameState, initGame, handleBlockClick } = useBlockGame();
  const { grid, targetNumber, score, status, mode, selectedBlockIds, timeLeft } = gameState;

  // Calculate current sum
  const currentSum = grid
    .filter(b => selectedBlockIds.includes(b.id))
    .reduce((sum, b) => sum + b.value, 0);

  // Board dimensions
  const boardWidth = COLS * BLOCK_SIZE;
  const boardHeight = ROWS * BLOCK_SIZE;

  if (status === 'menu') {
    return (
      <div className="min-h-screen bg-[#D8C3A5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Dunhuang Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E84A5F] via-[#D4B483] to-[#2B5F75]"></div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="z-10 text-center space-y-8 max-w-md w-full bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-4 border-[#8B4513]"
        >
          <h1 className="text-5xl font-bold text-[#2B5F75] font-calligraphy mb-2">
            敦煌數獨
          </h1>
          <p className="text-[#8B4513] font-serif mb-8">
            相加消除，防止触顶
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => initGame('classic')}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#E84A5F] text-white text-xl font-bold rounded-xl shadow-lg hover:bg-[#D6384F] transition-all border-2 border-[#FFD700] font-calligraphy"
            >
              <Play className="w-6 h-6" /> 经典模式
            </button>
            <button
              onClick={() => initGame('time')}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#2B5F75] text-white text-xl font-bold rounded-xl shadow-lg hover:bg-[#1A3C4A] transition-all border-2 border-[#40E0D0] font-calligraphy"
            >
              <Clock className="w-6 h-6" /> 计时模式
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'gameover') {
    return (
      <div className="min-h-screen bg-[#1F2937] flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#D4B483] p-12 rounded-3xl shadow-2xl border-4 border-[#8B4513] max-w-md w-full"
        >
          <AlertTriangle className="w-24 h-24 mx-auto text-[#E84A5F] mb-6" />
          <h2 className="text-4xl font-bold text-[#2B5F75] mb-4 font-calligraphy">游戏结束</h2>
          <p className="text-[#8B4513] mb-4 text-xl font-serif">最终得分: {score}</p>
          
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => initGame(mode)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2B5F75] text-white rounded-xl hover:bg-[#1A3C4A] transition-colors font-bold font-calligraphy text-lg"
            >
              <RefreshCw className="w-5 h-5" /> 重试
            </button>
            <button
              onClick={() => window.location.reload()} // Simple way to go back to menu state reset
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#8B4513] text-white rounded-xl hover:bg-[#5D4037] transition-colors font-bold font-calligraphy text-lg"
            >
              菜单
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D8C3A5] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E84A5F] via-[#D4B483] to-[#2B5F75]"></div>

      {/* Header Info */}
      <div className="w-full max-w-md flex justify-between items-end mb-6 px-2">
        <div className="text-left">
          <div className="text-[#8B4513] font-bold text-sm uppercase tracking-wider">Target</div>
          <div className="text-6xl font-bold text-[#2B5F75] font-mono leading-none">{targetNumber}</div>
        </div>
        
        <div className="text-center">
           {mode === 'time' && (
             <div className={`text-3xl font-bold font-mono ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-[#8B4513]'}`}>
               {timeLeft}s
             </div>
           )}
           <div className="text-[#8B4513] font-calligraphy text-xl mt-1">
             {mode === 'classic' ? '经典模式' : '计时模式'}
           </div>
        </div>

        <div className="text-right">
          <div className="text-[#8B4513] font-bold text-sm uppercase tracking-wider">Score</div>
          <div className="text-4xl font-bold text-[#E84A5F] font-mono">{score}</div>
        </div>
      </div>

      {/* Current Sum Indicator */}
      <div className="mb-4 h-8">
        {currentSum > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-6 py-1 rounded-full text-white font-bold text-lg shadow-md flex items-center gap-2 ${
              currentSum === targetNumber ? 'bg-green-600' : 
              currentSum > targetNumber ? 'bg-red-600' : 'bg-[#8B4513]'
            }`}
          >
            当前和: {currentSum}
            {currentSum > targetNumber && <span className="text-xs">(超出了!)</span>}
          </motion.div>
        )}
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-[#F5F5DC] rounded-xl shadow-inner border-4 border-[#8B4513] overflow-hidden"
        style={{ width: boardWidth, height: boardHeight }}
      >
        {/* Danger Zone Indicator */}
        <div className="absolute top-0 left-0 right-0 h-[60px] bg-red-500/10 border-b-2 border-red-500/30 flex items-center justify-center pointer-events-none z-0">
          <span className="text-red-500/50 text-xs font-bold uppercase tracking-widest">Danger Zone</span>
        </div>

        <AnimatePresence>
          {grid.map(block => (
            <Block
              key={block.id}
              block={block}
              isSelected={selectedBlockIds.includes(block.id)}
              onClick={() => handleBlockClick(block.id)}
              size={BLOCK_SIZE}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Controls / Footer */}
      <div className="mt-8 text-[#8B4513]/60 text-sm font-serif">
        点击数字相加等于 {targetNumber} 以消除
      </div>
    </div>
  );
};
