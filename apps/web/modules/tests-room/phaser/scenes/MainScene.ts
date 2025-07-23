import * as Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private rect: Phaser.GameObjects.Rectangle | null = null;

  constructor() {
    super('MainScene');
  }

  create() {
    this.add
      .text(400, 50, 'Bem-vindo ao Jogo!', {
        font: '48px Arial',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.rect = this.add.rectangle(400, 300, 100, 100, 0xff0000);

    this.add
      .text(400, 550, 'O retângulo irá girar em 3 segundos...', {
        font: '24px Arial',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      if (this.rect) {
        this.tweens.add({
          targets: this.rect,
          angle: 360,
          duration: 2000,
          ease: 'Linear',
          repeat: -1,
        });
      }
    });
  }

  update() {
    // Lógica de atualização do jogo aqui
  }
}
