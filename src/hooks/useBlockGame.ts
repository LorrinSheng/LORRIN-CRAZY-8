import { useState, useEffect, useCallback, useRef } from 'react';
import { Block, GameMode, GameState, COLS, ROWS } from '../types';
import { generateRow, calculateTarget } from '../utils/gameUtils';

export const useBlockGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    targetNumber: 0,
    score: 0,
    status: 'menu',
    mode: 'classic',
    selectedBlockIds: [],
    timeLeft: 60,
    level: 1,
  });

  const blockIdCounter = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initGame = (mode: GameMode) => {
    blockIdCounter.current = 0;
    // Initial rows: Start with 3 rows
    const initialGrid: Block[] = [];
    for (let r = 0; r < 3; r++) {
      const row = generateRow(r, blockIdCounter.current);
      blockIdCounter.current += COLS;
      initialGrid.push(...row);
    }

    const target = calculateTarget(initialGrid);

    setGameState({
      grid: initialGrid,
      targetNumber: target,
      score: 0,
      status: 'playing',
      mode,
      selectedBlockIds: [],
      timeLeft: mode === 'time' ? 30 : 0, // 30s for time mode initially
      level: 1,
    });
  };

  const addRow = useCallback(() => {
    setGameState(prev => {
      // Shift all existing blocks up (row + 1)
      const shiftedGrid = prev.grid.map(b => ({ ...b, row: b.row + 1 }));
      
      // Check game over
      const isGameOver = shiftedGrid.some(b => b.row >= ROWS);
      
      if (isGameOver) {
        return { ...prev, status: 'gameover' };
      }

      // Add new row at bottom (row 0)
      const newRow = generateRow(0, blockIdCounter.current);
      blockIdCounter.current += COLS;
      
      return {
        ...prev,
        grid: [...shiftedGrid, ...newRow],
      };
    });
  }, []);

  const handleBlockClick = (id: string) => {
    if (gameState.status !== 'playing') return;

    setGameState(prev => {
      const isSelected = prev.selectedBlockIds.includes(id);
      let newSelectedIds = isSelected
        ? prev.selectedBlockIds.filter(bid => bid !== id)
        : [...prev.selectedBlockIds, id];

      // Calculate sum
      const selectedBlocks = prev.grid.filter(b => newSelectedIds.includes(b.id));
      const currentSum = selectedBlocks.reduce((sum, b) => sum + b.value, 0);

      if (currentSum === prev.targetNumber) {
        // Match!
        // Remove blocks
        const remainingGrid = prev.grid.filter(b => !newSelectedIds.includes(b.id));
        
        // Apply gravity? 
        // In "Blokmatik", usually blocks fall down to fill gaps, OR rows shift.
        // The prompt says "add a row at bottom".
        // Let's implement simple gravity: blocks above fall down to fill empty spaces in their columns.
        
        // 1. Sort remaining grid by row (ascending)
        // 2. For each column, repack rows starting from 0
        
        const newGrid: Block[] = [];
        for (let c = 0; c < COLS; c++) {
          const colBlocks = remainingGrid.filter(b => b.col === c).sort((a, b) => a.row - b.row);
          // Keep their relative order but squash them down?
          // Actually, if we add rows from bottom, "row 0" is usually the bottom-most visually?
          // Let's define: Row 0 is BOTTOM. Row ROWS-1 is TOP.
          // So "gravity" means blocks fall towards 0.
          
          colBlocks.forEach((b, index) => {
            newGrid.push({ ...b, row: index });
          });
        }

        // Add Score
        const points = selectedBlocks.length * 10 * prev.level;
        
        // Add Row (Classic Mode: Every match adds a row?)
        // Prompt: "每次成功凑出目标数字，底部新增一行方块"
        // We need to do this carefully. If we just repacked, we have space.
        // Then we shift everything up and add row 0.
        
        let finalGrid = newGrid;
        let gameOver = false;

        if (prev.mode === 'classic') {
           // Shift up
           finalGrid = finalGrid.map(b => ({ ...b, row: b.row + 1 }));
           if (finalGrid.some(b => b.row >= ROWS)) {
             gameOver = true;
           }
           // Add new row at 0
           const newRow = generateRow(0, blockIdCounter.current);
           blockIdCounter.current += COLS;
           finalGrid = [...finalGrid, ...newRow];
        }

        // New Target
        const newTarget = calculateTarget(finalGrid);

        return {
          ...prev,
          grid: finalGrid,
          score: prev.score + points,
          selectedBlockIds: [],
          targetNumber: newTarget,
          status: gameOver ? 'gameover' : 'playing',
          // Reset timer in time mode? Or add time?
          // Prompt: "必须在倒计时结束前完成求和"
          // Usually adds time or resets. Let's add 5 seconds.
          timeLeft: prev.mode === 'time' ? Math.min(prev.timeLeft + 10, 60) : 0,
        };
      } else if (currentSum > prev.targetNumber) {
        // Exceeded target - deselect all or just the last one?
        // Usually just visual feedback or prevent selection.
        // Let's just allow it but it won't trigger match. User has to deselect.
        // Or auto-deselect the last one?
        // Let's keep it selected so user sees they went over.
      }

      return {
        ...prev,
        selectedBlockIds: newSelectedIds,
      };
    });
  };

  // Timer for Time Mode
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.mode === 'time') {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            // Time ran out
            // "时间耗尽会强制新增一行且该轮不得分"
            
            // Shift up
            const shiftedGrid = prev.grid.map(b => ({ ...b, row: b.row + 1 }));
            const isGameOver = shiftedGrid.some(b => b.row >= ROWS);
            
            if (isGameOver) return { ...prev, status: 'gameover', timeLeft: 0 };

            const newRow = generateRow(0, blockIdCounter.current);
            blockIdCounter.current += COLS;
            const newGrid = [...shiftedGrid, ...newRow];
            const newTarget = calculateTarget(newGrid); // Maybe new target?

            return {
              ...prev,
              grid: newGrid,
              timeLeft: 15, // Reset timer to something short? Or keep it running? 
              // "必须在倒计时结束前完成求和" implies a round timer. 
              // Let's reset to 15s for penalty round.
              targetNumber: newTarget,
              selectedBlockIds: [], // Clear selection
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.status, gameState.mode]);

  return {
    gameState,
    initGame,
    handleBlockClick,
    setGameState
  };
};
