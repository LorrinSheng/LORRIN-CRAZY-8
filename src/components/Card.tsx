import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType, Suit } from '../types';
import { Club, Diamond, Heart, Spade } from 'lucide-react';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  faceUp?: boolean;
  className?: string;
  isPlayable?: boolean;
}

// Dunhuang Colors
const COLORS: Record<Suit, { bg: string; text: string; name: string; border: string }> = {
  hearts: { 
    bg: 'bg-[#E84A5F]', // Cinnabar Red-ish
    text: 'text-white', 
    name: '朱砂',
    border: 'border-[#8B0000]'
  },
  diamonds: { 
    bg: 'bg-[#FFB347]', // Gamboge/Realgar Orange
    text: 'text-red-900', 
    name: '雄黄',
    border: 'border-[#B8860B]'
  },
  clubs: { 
    bg: 'bg-[#2E8B57]', // Malachite Green
    text: 'text-white', 
    name: '石绿',
    border: 'border-[#006400]'
  },
  spades: { 
    bg: 'bg-[#2B5F75]', // Azurite Blue (Shiqing)
    text: 'text-white', 
    name: '石青',
    border: 'border-[#1034A6]'
  },
};

const SuitIcon = ({ suit, className }: { suit: Suit; className?: string }) => {
  switch (suit) {
    case 'hearts': return <Heart className={className} fill="currentColor" />;
    case 'diamonds': return <Diamond className={className} fill="currentColor" />;
    case 'clubs': return <Club className={className} fill="currentColor" />;
    case 'spades': return <Spade className={className} fill="currentColor" />;
  }
};

export const Card: React.FC<CardProps> = ({ card, onClick, faceUp = true, className = '', isPlayable = false }) => {
  const style = COLORS[card.suit];

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={faceUp && isPlayable ? { y: -20, scale: 1.1, zIndex: 10 } : {}}
      onClick={onClick}
      className={`
        relative w-24 h-36 rounded-xl shadow-lg cursor-pointer select-none
        flex flex-col items-center justify-between p-2
        border-2 ${faceUp ? style.bg : 'bg-[#D4B483] border-[#8B4513]'}
        ${faceUp ? style.border : ''}
        ${className}
      `}
    >
      {faceUp ? (
        <>
          {/* Top Left */}
          <div className={`self-start flex flex-col items-center ${style.text}`}>
            <span className="text-lg font-bold font-mono leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} className="w-4 h-4" />
          </div>

          {/* Center Art / Color Name */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
             <SuitIcon suit={card.suit} className="w-20 h-20" />
          </div>
          
          <div className={`z-10 flex flex-col items-center justify-center ${style.text}`}>
             <div className="writing-vertical-rl font-calligraphy text-2xl tracking-widest opacity-90">
               {style.name}
             </div>
          </div>

          {/* Bottom Right */}
          <div className={`self-end flex flex-col items-center rotate-180 ${style.text}`}>
            <span className="text-lg font-bold font-mono leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} className="w-4 h-4" />
          </div>
        </>
      ) : (
        // Card Back - Dunhuang Pattern feel
        <div className="w-full h-full flex items-center justify-center border-2 border-[#8B4513] rounded-lg bg-[#C19A6B]">
           <div className="w-16 h-24 border border-[#8B4513] opacity-50 flex items-center justify-center">
             <div className="w-12 h-20 border border-[#8B4513] rotate-45"></div>
           </div>
        </div>
      )}
    </motion.div>
  );
};
