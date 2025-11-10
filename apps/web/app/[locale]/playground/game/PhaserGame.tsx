'use client';

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import Preloader from './scenes/preloader';

export const PhaserGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (phaserGameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 900,
      height: 600,
      parent: gameRef.current || undefined,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200, x: 0 },
        },
      },
      scene: [Preloader, MainScene],
    };

    phaserGameRef.current = new Phaser.Game(config);

    return () => {
      phaserGameRef.current?.destroy(true);
      phaserGameRef.current = null;
    };
  }, []);

  return <div id="phaser-game-container" ref={gameRef} />;
};
