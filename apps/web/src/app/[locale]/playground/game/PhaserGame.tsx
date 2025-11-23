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

    phaserGameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: '100%',
      height: '100%',
      pixelArt: true,
      parent: gameRef.current || undefined,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
        },
      },
      scene: [Preloader, MainScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    });

    return () => {
      phaserGameRef.current?.destroy(true);
      phaserGameRef.current = null;
    };
  }, []);

  return (
    <div
      id="phaser-game-container"
      ref={gameRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
