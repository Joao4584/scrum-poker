import * as Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image(
      'interior_tiles',
      '../../../../assets/tileset-image/interior.png',
    );

    this.load.tilemapTiledJSON(
      'tilemap_json',
      '../../../../tilesets/maps/lobby/lobby.json',
    );
  }

  create() {
    // Cria o mapa a partir do JSON carregado
    const map = this.make.tilemap({ key: 'tilemap_json' });

    // Adiciona o tileset ao mapa.
    // O primeiro parâmetro ('room-builder') deve corresponder ao nome do tileset definido no Tiled (no seu map.json).
    // O segundo parâmetro ('interior_tiles') deve corresponder à chave usada em this.load.image().
    const tileset = map.addTilesetImage('room-builder', 'interior_tiles');

    // Cria as camadas do mapa.
    // Os nomes das camadas devem corresponder aos nomes definidos no Tiled.
    const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
    const chaoLayer = map.createLayer('Chao', tileset, 0, 0);

    // Para a camada "Parede", que é um grupo, você precisa acessar as subcamadas
    const paredeLayer = map.createLayer('Parede', tileset, 0, 0);
    const paredeBordaLayer = map.createLayer('Parede Borda', tileset, 0, 0);

    const collisionLayer = map.createLayer('Colission', tileset, 0, 0);

    // Opcional: Adicionar colisões se você tiver uma camada de colisão
    // collisionLayer.setCollisionByProperty({ collides: true }); // Se você tiver uma propriedade 'collides' no Tiled
    // this.physics.add.collider(player, collisionLayer); // Exemplo de colisão com um player

    // Opcional: Ajustar a câmera para seguir o mapa ou um jogador
    // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // this.cameras.main.startFollow(player);
  }
}
