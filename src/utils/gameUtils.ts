import { Block, COLS } from '../types';

// Dunhuang Color Palette for Numbers 1-9
export const NUMBER_COLORS: Record<number, { bg: string; text: string; name: string; border: string }> = {
  1: { bg: 'bg-[#E84A5F]', text: 'text-white', name: '朱砂', border: 'border-[#8B0000]' },
  2: { bg: 'bg-[#FFB347]', text: 'text-red-900', name: '雄黄', border: 'border-[#B8860B]' },
  3: { bg: 'bg-[#2E8B57]', text: 'text-white', name: '石绿', border: 'border-[#006400]' },
  4: { bg: 'bg-[#2B5F75]', text: 'text-white', name: '石青', border: 'border-[#1034A6]' },
  5: { bg: 'bg-[#8B4513]', text: 'text-white', name: '赭石', border: 'border-[#5D4037]' },
  6: { bg: 'bg-[#40E0D0]', text: 'text-teal-900', name: '绿松', border: 'border-[#008B8B]' },
  7: { bg: 'bg-[#FFD700]', text: 'text-red-900', name: '藤黄', border: 'border-[#B8860B]' },
  8: { bg: 'bg-[#800080]', text: 'text-white', name: '紫潭', border: 'border-[#4B0082]' },
  9: { bg: 'bg-[#191970]', text: 'text-white', name: '靛蓝', border: 'border-[#000080]' },
};

export const generateRow = (rowIndex: number, startId: number): Block[] => {
  const row: Block[] = [];
  for (let c = 0; c < COLS; c++) {
    // Generate numbers 1-9. Weighted? Maybe 1-9 is fine.
    const value = Math.floor(Math.random() * 9) + 1;
    row.push({
      id: `block-${startId + c}`,
      value,
      row: rowIndex,
      col: c,
    });
  }
  return row;
};

export const calculateTarget = (grid: Block[]): number => {
  // Find a valid sum from the grid to ensure solvability
  // Pick 2-4 random blocks
  if (grid.length < 2) return 10; // Fallback

  const count = Math.floor(Math.random() * 3) + 2; // 2 to 4 blocks
  const shuffled = [...grid].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  return selected.reduce((sum, b) => sum + b.value, 0);
};
