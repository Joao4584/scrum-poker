'use client';

import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';

const PhaserGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const initPhaser = async () => {
      const createGame = (await import('../phaser/game')).default;
      gameRef.current = createGame();
    };

    if (!gameRef.current) {
      initPhaser();
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="phaser-game-container"
      style={{ width: '800px', height: '600px' }}
    />
  );
};

export default PhaserGame;
