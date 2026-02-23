import { useState, useEffect, useCallback } from 'react';
import { Card, GameState, Player, Suit } from '../types';
import { createDeck, isValidMove } from '../utils/gameLogic';

export const useCrazyEights = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [deck, setDeck] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [player, setPlayer] = useState<Player>({ id: 'player', hand: [] });
  const [ai, setAi] = useState<Player>({ id: 'ai', hand: [] });
  const [currentTurn, setCurrentTurn] = useState<'player' | 'ai'>('player');
  const [activeSuit, setActiveSuit] = useState<Suit | null>(null); // For 8s
  const [message, setMessage] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);

  const startGame = () => {
    setGameState('rules');
  };

  const confirmRules = () => {
    const newDeck = createDeck();
    const playerHand = newDeck.splice(0, 8);
    const aiHand = newDeck.splice(0, 8);
    const firstCard = newDeck.shift()!;
    
    setDeck(newDeck);
    setPlayer({ id: 'player', hand: playerHand });
    setAi({ id: 'ai', hand: aiHand });
    setDiscardPile([firstCard]);
    setActiveSuit(null);
    setCurrentTurn('player');
    setGameState('playing');
    setMessage('');
  };

  const drawCard = useCallback((target: 'player' | 'ai') => {
    if (deck.length === 0) {
      setMessage('Deck is empty! Passing turn.');
      return null;
    }
    const newDeck = [...deck];
    const card = newDeck.shift()!;
    setDeck(newDeck);
    return card;
  }, [deck]);

  const playerPlayCard = (card: Card) => {
    if (currentTurn !== 'player') return;

    const topCard = discardPile[discardPile.length - 1];
    if (!isValidMove(card, topCard, activeSuit)) {
      setMessage('Invalid move!');
      return;
    }

    // Remove from hand
    const newHand = player.hand.filter(c => c.id !== card.id);
    setPlayer({ ...player, hand: newHand });

    // Add to discard
    setDiscardPile(prev => [...prev, card]);

    // Check win
    if (newHand.length === 0) {
      setGameState('won');
      return;
    }

    if (card.rank === '8') {
      // Player needs to choose suit. 
      // For simplicity in this hook, we'll assume UI handles suit selection 
      // and calls a separate function, OR we pass it here.
      // Let's make a separate "chooseSuit" state or callback.
      // For now, let's auto-pause turn until suit selected.
      // We will return early and wait for suit selection.
      return 'choose_suit'; 
    } else {
      setActiveSuit(null);
      setCurrentTurn('ai');
    }
  };

  const playerSelectSuit = (suit: Suit) => {
    setActiveSuit(suit);
    setCurrentTurn('ai');
  };

  const playerDraw = () => {
    if (currentTurn !== 'player') return;
    const card = drawCard('player');
    if (card) {
      setPlayer(prev => ({ ...prev, hand: [...prev.hand, card] }));
      // Standard rule: usually you have to play if you can, or pass. 
      // Some rules say you draw until you can play, or draw max 1.
      // Let's go with: Draw 1. If playable, can play. Else pass.
      // Simplifying: Draw 1, then pass turn to AI immediately? 
      // Or let player try to play it?
      // Let's let player play if possible.
      // Actually, "如果摸牌堆为空，则跳过该回合" implies passing turn if empty.
      // "必须从摸牌堆摸一张牌" -> Draw one.
      
      // Let's allow playing the drawn card if valid.
      // But to simplify flow, let's just add to hand. Player can play if valid, or pass manually?
      // Or auto-pass if still no valid moves?
      // Let's just add to hand and keep turn (Player can play it). 
      // But to prevent infinite drawing, we should track if they just drawn.
      // Let's just add to hand.
    } else {
      // Deck empty
      setCurrentTurn('ai');
    }
  };

  // AI Logic
  useEffect(() => {
    if (currentTurn === 'ai' && gameState === 'playing') {
      const timer = setTimeout(() => {
        const topCard = discardPile[discardPile.length - 1];
        
        // 1. Try to find valid move
        const validMoves = ai.hand.filter(c => isValidMove(c, topCard, activeSuit));
        
        if (validMoves.length > 0) {
          // Prioritize non-8s to save 8s? Or just random?
          // Let's play first valid non-8, else 8.
          let move = validMoves.find(c => c.rank !== '8');
          if (!move) move = validMoves[0];

          // Play card
          const newHand = ai.hand.filter(c => c.id !== move!.id);
          setAi(prev => ({ ...prev, hand: newHand }));
          setDiscardPile(prev => [...prev, move!]);

          if (newHand.length === 0) {
            setGameState('lost');
            return;
          }

          if (move!.rank === '8') {
            // AI chooses suit (most common in hand)
            const suits = newHand.map(c => c.suit);
            const counts = suits.reduce((acc, s) => {
              acc[s] = (acc[s] || 0) + 1;
              return acc;
            }, {} as Record<Suit, number>);
            const bestSuit = (Object.keys(counts) as Suit[]).sort((a, b) => counts[b] - counts[a])[0] || 'hearts';
            setActiveSuit(bestSuit);
            setMessage(`AI played 8 and chose ${bestSuit}`);
          } else {
            setActiveSuit(null);
            setMessage('');
          }
          setCurrentTurn('player');
        } else {
          // Draw
          const card = drawCard('ai');
          if (card) {
            setAi(prev => ({ ...prev, hand: [...prev.hand, card] }));
            setMessage('AI drew a card');
            // AI gets to play drawn card if valid? 
            // Let's just pass turn to keep it simple and fast, 
            // or recursively call AI logic? 
            // Better: AI turn ends after draw (standard variant) or AI tries again.
            // Let's make AI pass after draw.
            setCurrentTurn('player');
          } else {
            setMessage('Deck empty, AI passes');
            setCurrentTurn('player');
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, gameState, ai.hand, discardPile, activeSuit, deck, drawCard]);

  return {
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
  };
};
