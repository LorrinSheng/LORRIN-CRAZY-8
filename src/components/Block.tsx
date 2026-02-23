import React from 'react';
import { motion } from 'motion/react';
import { Block as BlockType } from '../types';
import { NUMBER_COLORS } from '../utils/gameUtils';

interface BlockProps {
  block: BlockType;
  isSelected: boolean;
  onClick: () => void;
  size: number;
}

export const Block: React.FC<BlockProps> = ({ block, isSelected, onClick, size }) => {
  const style = NUMBER_COLORS[block.value] || NUMBER_COLORS[1];

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 0.9 : 1, 
        opacity: 1,
        y: 0 
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        absolute
        flex items-center justify-center
        rounded-lg shadow-md cursor-pointer select-none
        border-2 transition-colors duration-200
        ${style.bg} ${style.border} ${style.text}
        ${isSelected ? 'ring-4 ring-white/50 z-10 brightness-110' : ''}
      `}
      style={{
        width: size - 4,
        height: size - 4,
        left: block.col * size,
        bottom: block.row * size, // Row 0 is at bottom
      }}
    >
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold font-mono leading-none">{block.value}</span>
        <span className="text-[10px] opacity-80 font-calligraphy mt-1">{style.name}</span>
      </div>
    </motion.div>
  );
};
