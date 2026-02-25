import * as Phaser from "phaser";
import type { Room } from "colyseus.js";
import type { PlaygroundState } from "../../@types/player";
import { Player } from "@/modules/shared/config/phaser-js/sprites/Player";
import { CHAT_HIDE_DELAY_MS, sanitizeChatMessage } from "@/modules/shared/config/phaser-js/chat-config";
import { createNameLabel, positionLabel } from "@/modules/shared/config/phaser-js/scenes/helpers/labels";
import {
  ChatBubble,
  createChatBubble,
  destroyChatBubble,
  positionChatBubble,
  updateChatBubble,
} from "@/modules/shared/config/phaser-js/scenes/helpers/chat-bubble";
import {
  PlayerRadius,
  createPlayerRadius,
  destroyPlayerRadius,
  positionPlayerRadius,
  togglePlayerRadius,
} from "@/modules/shared/config/phaser-js/scenes/helpers/player-radius";
import { getNearbyPlayers } from "@/modules/shared/config/phaser-js/scenes/helpers/proximity";
import { clearNearbyPlayers, setNearbyPlayers } from "../../stores/nearby-store";
import { useRoomUiStore } from "../../stores/room-ui-store";
import { RemoteManager } from "./remote-manager";

type RoomGetter = () => Room<PlaygroundState> | undefined;
type RemoteManagerGetter = () => RemoteManager | undefined;

// Gerencia elementos visuais do jogador local (nome, chat, raio de proximidade)
// e sincroniza esses dados com estado e entrada do usuario.
export class LocalPlayerPresence {
  private selfLabel?: Phaser.GameObjects.Text;
  private selfBubble?: ChatBubble;
  private selfRadius?: PlayerRadius;
  private selfHoverOutlineSprites: Phaser.GameObjects.Sprite[] = [];
  private selfName = "";
  private radiusToggleKey?: Phaser.Input.Keyboard.Key;
  private syncSelfBubble?: () => void;
  private syncSelfLabel?: () => void;
  private syncSelfHoverOutline?: () => void;
  private selfMessageSeenAt = 0;
  private selfStateMessage = "";
  private hiddenMessage?: string;
  private lastNearbyKey = "";
  private onSelfPointerOver = () => {
    const name = this.selfLabel?.text?.trim() || this.selfName;
    if (!name) return;
    console.log("[player-hover-name]", name);
    this.setHoverOutlineVisible(true);
  };
  private onSelfPointerDown = () => {
    const room = this.getRoom();
    const selfState = room?.state.players.get(room?.sessionId ?? "");
    const publicId = selfState?.id?.toString().trim() || room?.sessionId || "";
    if (!publicId) return;
    useRoomUiStore.getState().openPlayerInfoCard(publicId);
  };
  private onScenePointerDown = (_pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[] = []) => {
    const clickedOnPlayer = currentlyOver.some((gameObject) => {
      if (gameObject === this.player) return true;
      return typeof (gameObject as Phaser.GameObjects.GameObject).getData === "function"
        ? Boolean((gameObject as Phaser.GameObjects.GameObject).getData("isPlayerSprite"))
        : false;
    });
    if (clickedOnPlayer) return;
    useRoomUiStore.getState().closePlayerInfoCard();
  };
  private onSelfPointerOut = () => {
    this.setHoverOutlineVisible(false);
  };
  private onRadiusToggle = () => {
    if (this.selfRadius) {
      togglePlayerRadius(this.selfRadius);
    }
  };

  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private getRoom: RoomGetter,
    private getRemotes: RemoteManagerGetter,
  ) {}

  // Cria os elementos visuais iniciais do jogador local e registra handlers de atualizacao.
  public create(initialName: string, spawn: Phaser.Math.Vector2) {
    this.selfName = initialName;
    this.selfLabel = createNameLabel(this.scene, initialName, spawn.x, spawn.y);
    this.selfLabel.setVisible(true);
    this.selfBubble = createChatBubble(this.scene, "", spawn.x, spawn.y);
    this.selfRadius = createPlayerRadius(this.scene);
    this.createHoverOutlineSprites();
    this.player.setData("isPlayerSprite", true);
    this.player.setInteractive({ useHandCursor: true });
    this.player.on(Phaser.Input.Events.POINTER_OVER, this.onSelfPointerOver);
    this.player.on(Phaser.Input.Events.POINTER_DOWN, this.onSelfPointerDown);
    this.player.on(Phaser.Input.Events.POINTER_OUT, this.onSelfPointerOut);
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onScenePointerDown);

    this.radiusToggleKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.radiusToggleKey?.on("down", this.onRadiusToggle);

    this.syncSelfBubble = () => {
      if (this.selfBubble) {
        positionChatBubble(this.selfBubble, this.player.x, this.player.y, 0);
      }
    };
    this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.syncSelfBubble);

    this.syncSelfLabel = () => {
      if (this.selfLabel) {
        positionLabel(this.selfLabel, this.player.x, this.player.y, 0);
      }
    };
    this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.syncSelfLabel);

    this.syncSelfHoverOutline = () => {
      this.updateHoverOutlineSprites();
    };
    this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.syncSelfHoverOutline);
  }

  // Atualiza proximidade, nome e bolha de chat local com base no estado da room.
  public update(now: number) {
    if (this.selfRadius) {
      positionPlayerRadius(this.selfRadius, this.player.x, this.player.y);
      const shouldDetect = this.selfRadius.graphics.visible;
      const remotes = this.getRemotes();
      const nearby = shouldDetect && remotes ? getNearbyPlayers(remotes.getRemoteSummaries(), this.player.x, this.player.y, this.selfRadius.radius) : [];
      const key = nearby.join("|");
      if (key !== this.lastNearbyKey) {
        setNearbyPlayers(nearby);
        this.lastNearbyKey = key;
      }
    }

    const room = this.getRoom();
    const selfState = room?.state.players.get(room?.sessionId ?? "");

    if (this.selfLabel && selfState && selfState.name && selfState.name !== this.selfLabel.text) {
      this.selfLabel.setText(selfState.name);
      this.selfName = selfState.name;
    }

    const nextMessage = sanitizeChatMessage(selfState?.message ?? "");
    if (!this.selfBubble) return;

    const changed = nextMessage !== this.selfStateMessage;
    const hiddenSame = this.hiddenMessage !== undefined && nextMessage === this.hiddenMessage;

    if (!hiddenSame) {
      if (changed) {
        this.selfStateMessage = nextMessage;
        this.selfMessageSeenAt = nextMessage ? now : 0;
        this.hiddenMessage = undefined;
        updateChatBubble(this.selfBubble, nextMessage);
      } else if (this.selfStateMessage) {
        if (this.selfMessageSeenAt && now - this.selfMessageSeenAt > CHAT_HIDE_DELAY_MS) {
          this.hiddenMessage = this.selfStateMessage;
          this.selfMessageSeenAt = 0;
          updateChatBubble(this.selfBubble, "");
        }
      }
    }
  }

  // Atualiza o nome exibido sobre o jogador local.
  public setName(name: string) {
    if (!this.selfLabel) return;
    this.selfName = name;
    this.selfLabel.setText(name);
    this.selfLabel.setVisible(true);
  }

  // Remove listeners e destroi objetos graficos associados ao jogador local.
  public destroy() {
    if (this.syncSelfBubble) {
      this.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, this.syncSelfBubble);
      this.syncSelfBubble = undefined;
    }
    if (this.syncSelfLabel) {
      this.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, this.syncSelfLabel);
      this.syncSelfLabel = undefined;
    }
    if (this.syncSelfHoverOutline) {
      this.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, this.syncSelfHoverOutline);
      this.syncSelfHoverOutline = undefined;
    }

    if (this.radiusToggleKey) {
      this.radiusToggleKey.off("down", this.onRadiusToggle);
      this.radiusToggleKey = undefined;
    }
    this.player.off(Phaser.Input.Events.POINTER_OVER, this.onSelfPointerOver);
    this.player.off(Phaser.Input.Events.POINTER_DOWN, this.onSelfPointerDown);
    this.player.off(Phaser.Input.Events.POINTER_OUT, this.onSelfPointerOut);
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onScenePointerDown);
    this.setHoverOutlineVisible(false);
    this.player.disableInteractive();
    useRoomUiStore.getState().closePlayerInfoCard();

    if (this.selfBubble) {
      destroyChatBubble(this.selfBubble);
      this.selfBubble = undefined;
    }
    if (this.selfLabel) {
      this.selfLabel.destroy();
      this.selfLabel = undefined;
    }
    if (this.selfRadius) {
      destroyPlayerRadius(this.selfRadius);
      this.selfRadius = undefined;
    }
    this.selfHoverOutlineSprites.forEach((sprite) => sprite.destroy());
    this.selfHoverOutlineSprites = [];
    clearNearbyPlayers();
  }

  private createHoverOutlineSprites() {
    const outlineColor = 0xffffff;
    const offsets = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ] as const;

    const textureKey = this.player.frame.texture.key;
    const frameName = this.player.frame.name;
    this.selfHoverOutlineSprites = offsets.map(([offsetX, offsetY]) =>
      this.scene.add
        .sprite(this.player.x + offsetX, this.player.y + offsetY, textureKey, frameName)
        .setTint(outlineColor)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(1)
        .setVisible(false),
    );
    this.updateHoverOutlineSprites();
  }

  private updateHoverOutlineSprites() {
    if (!this.selfHoverOutlineSprites.length) return;

    const textureKey = this.player.frame.texture.key;
    const frameName = this.player.frame.name;
    const offsets = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ] as const;

    this.selfHoverOutlineSprites.forEach((outline, index) => {
      const [offsetX, offsetY] = offsets[index];
      outline.setTexture(textureKey, frameName);
      outline.setPosition(this.player.x + offsetX, this.player.y + offsetY);
      outline.setFlip(this.player.flipX, this.player.flipY);
      outline.setDepth(this.player.y - 0.01);
    });
  }

  private setHoverOutlineVisible(visible: boolean) {
    this.selfHoverOutlineSprites.forEach((outline) => outline.setVisible(visible));
  }
}
