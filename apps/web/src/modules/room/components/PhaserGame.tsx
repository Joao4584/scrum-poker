"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

/**
 * Uma cena de exemplo simples para demonstrar a integração.
 */
class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.add.text(100, 100, "Phaser + Next.js!", {
      font: "32px Arial",
      color: "#ffffff",
    });
  }
}

const PhaserGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameInstanceRef.current) {
      return;
    }

    if (gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainerRef.current,
        backgroundColor: "#1a1a1a",
        scene: [GameScene],
      };

      gameInstanceRef.current = new Phaser.Game(config);
    }

    return () => {
      gameInstanceRef.current?.destroy(true);
      gameInstanceRef.current = null;
    };
  }, []);

  return <div ref={gameContainerRef} />;
};

export default PhaserGame;
