import * as Phaser from "phaser";
import { MapManager } from "@/modules/shared/config/phaser-js/map/MapManager";
import { Player } from "@/modules/shared/config/phaser-js/sprites/Player";
import type { Room } from "colyseus.js";
import type { PlaygroundState } from "../@types/player";
import { RemoteManager } from "./helpers/remote-manager";
import { WalkableResolver } from "./helpers/walkable-resolver";
import { MovementPublisher } from "./helpers/movement-publisher";
import { LocalPlayerPresence } from "./helpers/local-player-presence";
import { getSoundManager } from "@/modules/shared/audio/sound-manager";

// Cena principal do jogo: monta mapa/jogador local e sincroniza estado em tempo real com a sala.
export class MainScene extends Phaser.Scene {
  private player!: Player;
  private room?: Room<PlaygroundState>;
  private selfInitialized = false;
  private remotes?: RemoteManager;
  private walkableResolver?: WalkableResolver;
  private movementPublisher?: MovementPublisher;
  private localPresence?: LocalPlayerPresence;
  private cleanupZoomControls?: () => void;
  private sounds = getSoundManager();

  constructor() {
    super({ key: "game" });
  }

  // Recebe a room no ciclo de init para uso durante create/update.
  init(data: { room?: Room<PlaygroundState> }) {
    this.room = data.room;
  }

  // Cria o mapa, posiciona jogador local e registra listeners de rede.
  create() {
    const onSceneReady = this.game.registry.get("on-scene-ready") as (() => void) | undefined;
    onSceneReady?.();

    const { map, colliderLayer, floorLayer, wallLayer, wallTopLayer, blocksLayer } = MapManager.createMap(this);
    const worldBounds = MapManager.getWorldBounds(map, [floorLayer, colliderLayer, wallLayer, wallTopLayer, blocksLayer], 4);

    const center = new Phaser.Math.Vector2(map.widthInPixels / 2, map.heightInPixels / 2);
    const spawnFromMap = MapManager.findSpawnOnFloor(floorLayer, colliderLayer) ?? center;
    this.walkableResolver = new WalkableResolver(floorLayer, colliderLayer, worldBounds, spawnFromMap);

    const roomSpawn = this.getSpawnFromRoom();
    const localSpawn = this.walkableResolver.coerce(roomSpawn?.x, roomSpawn?.y, spawnFromMap);

    const bounds = worldBounds ?? new Phaser.Geom.Rectangle(0, 0, map.widthInPixels ?? 0, map.heightInPixels ?? 0);
    const localSkin = this.room?.state.players.get(this.room?.sessionId ?? "")?.skin?.toString() ?? "steve";
    const localName = this.room?.state.players.get(this.room?.sessionId ?? "")?.name?.toString() ?? "Player";

    this.player = new Player(this, localSpawn.x, localSpawn.y, localSkin);
    this.player.setDepth(localSpawn.y);

    this.physics.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    if (colliderLayer) {
      this.physics.add.collider(this.player, colliderLayer);
    }

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setRoundPixels(true);
    const background = (this.game.registry.get("room-background") as string | undefined) ?? "#0b1220";
    this.cameras.main.setBackgroundColor(background);
    this.cleanupZoomControls = MapManager.setupWheelZoom(this, this.cameras.main, {
      initialZoom: 1,
      minZoom: 1,
      maxZoom: 2.5,
      wheelStep: 0.25,
      zoomSnapStep: 0.25,
    });

    this.remotes = new RemoteManager(this, (x, y) => this.walkableResolver?.coerce(x, y, spawnFromMap) ?? spawnFromMap, spawnFromMap);
    this.movementPublisher = new MovementPublisher(() => this.room, this.player);
    this.movementPublisher.syncInitialPosition(localSpawn);
    this.localPresence = new LocalPlayerPresence(
      this,
      this.player,
      () => this.room,
      () => this.remotes,
    );
    this.localPresence.create(localName, localSpawn);

    this.registerNetworkListeners();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.handleShutdown());
  }

  // Atualiza movimentacao local, profundidade e publicacao periodica de posicao.
  update() {
    this.player.update();
    const now = this.time.now;
    const cam = this.cameras.main;
    cam.setScroll(Math.round(cam.scrollX), Math.round(cam.scrollY));
    this.player.setDepth(this.player.y);

    this.localPresence?.update(now);
    this.movementPublisher?.publish(now);

    const selfState = this.room?.state.players.get(this.room?.sessionId ?? "");
    const stateSkin = selfState?.skin?.toString();
    if (stateSkin) {
      this.player.setSkin(stateSkin);
    }

    if (this.player.isMoving()) {
      void this.sounds.play("footstep", {
        throttleMs: this.player.isSprinting() ? 95 : 150,
      });
    }
  }

  // Extrai o spawn inicial do jogador local a partir do estado da room.
  private getSpawnFromRoom() {
    if (!this.room) return undefined;
    const player = this.room.state.players.get(this.room.sessionId);
    if (!player) return undefined;
    return new Phaser.Math.Vector2(player.x ?? 0, player.y ?? 0);
  }

  // Conecta callbacks do estado Colyseus para criar/atualizar/remover jogadores remotos.
  private registerNetworkListeners() {
    const room = this.room;
    if (!room) return;

    const selfId = room.sessionId;

    room.state.players.onAdd = (player, sessionId) => {
      if (sessionId === selfId) {
        if (!this.selfInitialized) {
          this.player.setPosition(player.x ?? this.player.x, player.y ?? this.player.y);
          const tint = Phaser.Display.Color.HexStringToColor(player.color ?? "#ffffff");
          this.player.setTint(tint.color);
          this.localPresence?.setName(player.name ?? "Player");
          this.movementPublisher?.syncWithCurrentPosition();
          this.selfInitialized = true;
        }
        return;
      }

      this.remotes?.addOrUpdate(player, sessionId, selfId);
    };

    const materializeAll = () => this.remotes?.materializeAll(room, selfId);
    const prune = () => this.remotes?.prune(room, selfId);

    materializeAll();

    room.state.players.onChange = (player, sessionId) => {
      if (sessionId === selfId) return;
      this.remotes?.updateRemoteSprite(sessionId, player);
    };

    room.onStateChange(() => {
      materializeAll();
      prune();
    });

    room.state.players.onRemove = (_, sessionId) => {
      this.remotes?.remove(sessionId);
      if (sessionId === selfId) {
        this.room?.leave();
      }
    };
  }

  // Libera recursos da cena e encerra a conexao da room ao desmontar.
  private handleShutdown() {
    if (this.cleanupZoomControls) {
      this.cleanupZoomControls();
      this.cleanupZoomControls = undefined;
    }

    this.remotes?.destroy();
    this.remotes = undefined;

    this.localPresence?.destroy();
    this.localPresence = undefined;

    const room = this.room;
    this.room = undefined;
    room?.leave();
  }
}
