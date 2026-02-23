import React, { useState } from 'react';
import { useCrazyEights } from '../hooks/useCrazyEights';
import { Card } from './Card';
import { Suit } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Club, Diamond, Heart, Spade, RefreshCw, Trophy, Skull } from 'lucide-react';

export const Game = () => {
  const {
    gameState,
    player,
    ai,
    discardPile,
    deck,
    currentTurn,
    activeSuit,
    message,
    startGame,
    confirmRules,
    playerPlayCard,
    playerSelectSuit,
    playerDraw,
    setGameState
  } = useCrazyEights();

  const [showSuitSelector, setShowSuitSelector] = useState(false);

  const handleCardClick = (card: import('../types').Card) => {
    if (currentTurn !== 'player') return;
    const result = playerPlayCard(card);
    if (result === 'choose_suit') {
      setShowSuitSelector(true);
    }
  };

  const handleSuitSelect = (suit: Suit) => {
    playerSelectSuit(suit);
    setShowSuitSelector(false);
  };

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-[#D8C3A5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Dunhuang Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E84A5F] via-[#D4B483] to-[#2B5F75]"></div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center space-y-8 max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#2B5F75] tracking-wide drop-shadow-lg font-calligraphy">
            你被Lorrin <br/> 瘋狂8點系統綁架了
          </h1>
          <p className="text-xl md:text-2xl text-[#8B4513] font-light tracking-wider font-calligraphy">
            赢得游戏，击败系统
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-12 py-4 bg-[#E84A5F] text-white text-xl font-bold rounded-full shadow-xl hover:bg-[#D6384F] transition-colors border-2 border-[#FFD700] font-calligraphy"
          >
            开始游戏
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'rules') {
    return (
      <div className="min-h-screen bg-[#D8C3A5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E84A5F] via-[#D4B483] to-[#2B5F75]"></div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#D4B483] p-8 rounded-3xl shadow-2xl border-4 border-[#8B4513] max-w-2xl w-full z-10 relative"
        >
          <h2 className="text-4xl font-bold text-[#2B5F75] mb-6 text-center font-calligraphy">游戏规则</h2>
          
          <div className="space-y-4 text-[#8B4513] text-xl font-calligraphy leading-relaxed">
            <p><span className="font-bold text-[#E84A5F]">目标：</span> 最先出完手中的牌。</p>
            <p><span className="font-bold text-[#E84A5F]">出牌：</span> 出一张与弃牌堆顶部牌 <span className="font-bold">花色</span> 或 <span className="font-bold">点数</span> 相同的牌。</p>
            <p><span className="font-bold text-[#E84A5F]">疯狂 8 点：</span> <span className="font-bold">8</span> 是万能牌！你可以随时打出 8，并指定下一张牌的花色。</p>
            <p><span className="font-bold text-[#E84A5F]">摸牌：</span> 如果无牌可出，点击牌堆摸一张牌。</p>
            <p><span className="font-bold text-[#E84A5F]">胜利：</span> 击败 AI，逃离系统的控制！</p>
          </div>

          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={confirmRules}
              className="px-10 py-3 bg-[#2B5F75] text-white text-xl font-bold rounded-full shadow-lg hover:bg-[#1A3C4A] transition-colors border-2 border-[#D4B483] font-calligraphy"
            >
              我明白了，开始挑战
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'won' || gameState === 'lost') {
    return (
      <div className="min-h-screen bg-[#1F2937] flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#D4B483] p-12 rounded-3xl shadow-2xl border-4 border-[#8B4513] max-w-md w-full"
        >
          {gameState === 'won' ? (
            <>
              <Trophy className="w-24 h-24 mx-auto text-[#E84A5F] mb-6" />
              <h2 className="text-4xl font-bold text-[#2B5F75] mb-4 font-calligraphy">你赢了！</h2>
              <p className="text-[#8B4513] mb-8 text-lg font-calligraphy">系统已被击败，你重获自由。</p>
            </>
          ) : (
            <>
              <Skull className="w-24 h-24 mx-auto text-[#2F4F4F] mb-6" />
              <h2 className="text-4xl font-bold text-[#2F4F4F] mb-4 font-calligraphy">你输了...</h2>
              <p className="text-[#8B4513] mb-8 text-lg font-calligraphy">你将永远被困在系统中。</p>
            </>
          )}
          
          <button
            onClick={startGame}
            className="flex items-center justify-center gap-2 w-full px-8 py-3 bg-[#2B5F75] text-white rounded-xl hover:bg-[#1A3C4A] transition-colors font-bold font-calligraphy text-xl"
          >
            <RefreshCw className="w-5 h-5" /> 再玩一次
          </button>
        </motion.div>
      </div>
    );
  }

  const topDiscard = discardPile[discardPile.length - 1];

  return (
    <div className="min-h-screen bg-[#D8C3A5] relative overflow-hidden flex flex-col">
      {/* Dunhuang Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E84A5F] via-[#D4B483] to-[#2B5F75]"></div>
      
      {/* Top Bar / AI Info */}
      <div className="p-4 flex justify-between items-center bg-[#8B4513]/10 backdrop-blur-sm border-b border-[#8B4513]/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#2B5F75] flex items-center justify-center text-white font-bold border-2 border-[#D4B483]">
            AI
          </div>
          <div className="text-[#8B4513] font-bold font-calligraphy text-lg">
            手牌: {ai.hand.length}
          </div>
        </div>
        <div className="text-[#8B4513] font-calligraphy font-bold text-2xl">
          Lorrin 瘋狂 8 點
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-4">
        
        {/* AI Hand (Face Down) */}
        <div className="flex -space-x-12 mb-8">
          {ai.hand.map((card, i) => (
            <Card key={card.id} card={card} faceUp={false} className="transform scale-75 origin-top" />
          ))}
        </div>

        {/* Center Area: Deck & Discard */}
        <div className="flex items-center gap-12 my-4">
          {/* Draw Pile */}
          <div 
            onClick={playerDraw}
            className={`relative group ${currentTurn === 'player' ? 'cursor-pointer' : ''}`}
          >
            {deck.length > 0 ? (
              <div className="relative">
                 {/* Stack effect */}
                 <div className="absolute top-1 left-1 w-24 h-36 bg-[#8B4513] rounded-xl"></div>
                 <div className="absolute top-0.5 left-0.5 w-24 h-36 bg-[#A0522D] rounded-xl"></div>
                 <Card card={deck[0]} faceUp={false} className="shadow-2xl" />
                 <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl drop-shadow-md font-mono">
                   {deck.length}
                 </div>
              </div>
            ) : (
              <div className="w-24 h-36 border-2 border-dashed border-[#8B4513]/50 rounded-xl flex items-center justify-center text-[#8B4513]/50 font-calligraphy">
                空
              </div>
            )}
            {currentTurn === 'player' && deck.length > 0 && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-lg font-bold text-[#8B4513] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-calligraphy">
                摸牌
              </div>
            )}
          </div>

          {/* Discard Pile */}
          <div className="relative">
            {topDiscard && (
              <div className="relative">
                 <Card card={topDiscard} />
                 {/* Active Suit Indicator (if 8) */}
                 {activeSuit && topDiscard.rank === '8' && (
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="absolute -top-6 -right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-[#2B5F75] z-20"
                   >
                     {activeSuit === 'hearts' && <Heart className="text-[#E84A5F] fill-current" />}
                     {activeSuit === 'diamonds' && <Diamond className="text-[#FFB347] fill-current" />}
                     {activeSuit === 'clubs' && <Club className="text-[#2E8B57] fill-current" />}
                     {activeSuit === 'spades' && <Spade className="text-[#2B5F75] fill-current" />}
                   </motion.div>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* Message / Turn Indicator */}
        <div className="h-12 flex items-center justify-center mt-4">
           {message && (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white/80 px-6 py-2 rounded-full text-[#8B4513] font-bold shadow-sm font-calligraphy text-xl"
             >
               {message}
             </motion.div>
           )}
           {!message && (
             <div className={`px-6 py-2 rounded-full font-bold shadow-sm transition-colors font-calligraphy text-xl ${
               currentTurn === 'player' ? 'bg-[#2B5F75] text-white' : 'bg-[#E84A5F] text-white'
             }`}>
               {currentTurn === 'player' ? '你的回合' : 'AI 思考中...'}
             </div>
           )}
        </div>

      </div>

      {/* Player Hand */}
      <div className="p-4 pb-8 flex flex-col items-center bg-gradient-to-t from-[#8B4513]/20 to-transparent">
        <div className="flex -space-x-8 hover:-space-x-4 transition-all duration-300 px-4 py-4 overflow-x-auto max-w-full no-scrollbar">
          <AnimatePresence>
            {player.hand.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Card 
                  card={card} 
                  onClick={() => handleCardClick(card)}
                  isPlayable={currentTurn === 'player'}
                  className="hover:z-10 transition-transform"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Suit Selector Modal */}
      {showSuitSelector && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#D4B483] p-6 rounded-2xl shadow-2xl border-4 border-[#2B5F75] max-w-sm w-full"
          >
            <h3 className="text-2xl font-bold text-[#2B5F75] text-center mb-6 font-calligraphy">选择花色</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleSuitSelect('hearts')} className="flex flex-col items-center p-4 bg-white rounded-xl hover:bg-red-50 transition-colors gap-2">
                <Heart className="w-8 h-8 text-[#E84A5F] fill-current" />
                <span className="font-bold text-[#E84A5F] font-calligraphy text-xl">朱砂</span>
              </button>
              <button onClick={() => handleSuitSelect('diamonds')} className="flex flex-col items-center p-4 bg-white rounded-xl hover:bg-orange-50 transition-colors gap-2">
                <Diamond className="w-8 h-8 text-[#FFB347] fill-current" />
                <span className="font-bold text-[#FFB347] font-calligraphy text-xl">雄黄</span>
              </button>
              <button onClick={() => handleSuitSelect('clubs')} className="flex flex-col items-center p-4 bg-white rounded-xl hover:bg-green-50 transition-colors gap-2">
                <Club className="w-8 h-8 text-[#2E8B57] fill-current" />
                <span className="font-bold text-[#2E8B57] font-calligraphy text-xl">石绿</span>
              </button>
              <button onClick={() => handleSuitSelect('spades')} className="flex flex-col items-center p-4 bg-white rounded-xl hover:bg-blue-50 transition-colors gap-2">
                <Spade className="w-8 h-8 text-[#2B5F75] fill-current" />
                <span className="font-bold text-[#2B5F75] font-calligraphy text-xl">石青</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
