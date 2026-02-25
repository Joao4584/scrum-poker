import * as Phaser from "phaser";
import type { CreatePhaserGameOptions } from "../@types/phaser";
import { MainScene } from "../scenes/MainScene";
import Preloader from "../scenes/preloader";

// Configuracoes base do canvas Phaser para manter proporcao e grade de tiles.
const BASE_GAME_WIDTH = 1280;
const BASE_GAME_HEIGHT = 720;
const TILE_SIZE = 32;
const USE_DYNAMIC_SCALE = process.env.NEXT_PUBLIC_PHASER_DYNAMIC_SCALE === "true";
const USE_QUANTIZED_DYNAMIC = process.env.NEXT_PUBLIC_PHASER_DYNAMIC_SCALE_QUANTIZED !== "false";

// Ajusta dimensoes para multiplos do tile, evitando blur e desalinhamento visual.
const quantizeToTile = (value: number) => Math.max(TILE_SIZE, Math.floor(value / TILE_SIZE) * TILE_SIZE);

// Resume qual estrategia de escala esta ativa para uso na interface/debug.
export const getScaleMode = () => {
  if (!USE_DYNAMIC_SCALE) return "fixed";
  return USE_QUANTIZED_DYNAMIC ? "quantized" : "dynamic";
};

// Redimensiona o jogo de acordo com o modo dinamico ou fixo.
export const resizePhaserGame = (game: Phaser.Game, width: number, height: number) => {
  const parentWidth = Math.floor(width);
  const parentHeight = Math.floor(height);

  if (USE_DYNAMIC_SCALE) {
    const nextWidth = USE_QUANTIZED_DYNAMIC ? quantizeToTile(parentWidth) : parentWidth;
    const nextHeight = USE_QUANTIZED_DYNAMIC ? quantizeToTile(parentHeight) : parentHeight;
    game.scale.resize(nextWidth, nextHeight);
    return;
  }

  game.scale.setParentSize?.(parentWidth, parentHeight);
  game.scale.refresh?.();
};

// Cria a instancia principal do Phaser com fisica, cenas e valores iniciais de registry.
export function createPhaserGame({ parent, room, backgroundColor, onSceneReady }: CreatePhaserGameOptions) {
  const parentRect = parent?.getBoundingClientRect();
  const rawInitialWidth = parentRect?.width ? Math.floor(parentRect.width) : BASE_GAME_WIDTH;
  const rawInitialHeight = parentRect?.height ? Math.floor(parentRect.height) : BASE_GAME_HEIGHT;
  const initialWidth = USE_DYNAMIC_SCALE && USE_QUANTIZED_DYNAMIC ? quantizeToTile(rawInitialWidth) : rawInitialWidth;
  const initialHeight = USE_DYNAMIC_SCALE && USE_QUANTIZED_DYNAMIC ? quantizeToTile(rawInitialHeight) : rawInitialHeight;

  return new Phaser.Game({
    type: Phaser.CANVAS,
    resolution: 1,
    width: USE_DYNAMIC_SCALE ? initialWidth : BASE_GAME_WIDTH,
    height: USE_DYNAMIC_SCALE ? initialHeight : BASE_GAME_HEIGHT,
    pixelArt: true,
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
    },
    canvasStyle: "image-rendering: pixelated; image-rendering: crisp-edges;",
    parent: parent || undefined,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0, x: 0 },
      },
    },
    scene: [Preloader, MainScene],
    scale: USE_DYNAMIC_SCALE
      ? {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          autoRound: true,
        }
      : {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          autoRound: true,
        },
    callbacks: {
      postBoot: (game) => {
        game.registry.set("room", room);
        if (backgroundColor) {
          game.registry.set("room-background", backgroundColor);
        }
        if (onSceneReady) {
          game.registry.set("on-scene-ready", onSceneReady);
        }
        console.log("[phaser] booted, room set in registry");
      },
    },
  });
}
