import { Card, RANKS, SUITS, Suit } from '../types';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  let idCounter = 0;
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      let value = 0;
      if (rank === '8') value = 50; // Special weight for sorting/logic if needed, but mainly logic based
      else if (['J', 'Q', 'K', '10'].includes(rank)) value = 10;
      else if (rank === 'A') value = 1;
      else value = parseInt(rank);

      deck.push({
        id: `card-${idCounter++}`,
        suit,
        rank,
        value,
      });
    }
  }
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const isValidMove = (card: Card, topCard: Card, activeSuit: Suit | null): boolean => {
  if (card.rank === '8') return true;
  if (activeSuit) {
    return card.suit === activeSuit;
  }
  return card.suit === topCard.suit || card.rank === topCard.rank;
};
