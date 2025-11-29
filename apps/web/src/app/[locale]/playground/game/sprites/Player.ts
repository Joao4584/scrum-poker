import * as Phaser from "phaser";

type Direction = "up" | "down" | "left" | "right";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private baseSpeed = 150;
  private sprintSpeed = 300;

  private cursors: Record<string, Phaser.Input.Keyboard.Key>;
  private sprintKey: Phaser.Input.Keyboard.Key;
  private shadow: Phaser.GameObjects.Ellipse;

  private lastDirection: Direction = "down";

  private spriteName = "";
  private idleSpriteName = "";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    idle_texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.spriteName = texture;
    this.idleSpriteName = idle_texture;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.shadow = scene.add
      .ellipse(x, y, 30, 12, 0x000000, 0.25)
      .setDepth(9)
      .setScrollFactor(1);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.shadow.destroy();
    });

    const body = this.body as Phaser.Physics.Arcade.Body;
    const hitboxSize = { width: 16, height: 16 };
    body.setSize(hitboxSize.width, hitboxSize.height);
    body.setOffset(
      (this.width - hitboxSize.width) / 2,
      this.height - hitboxSize.height,
    );

    this.createAnimations();

    this.cursors = this.scene.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    this.sprintKey = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT,
    );
  }

  private createAnimations() {
    const animationManager = this.scene.anims;
    const createOnce = (config: Phaser.Types.Animations.Animation) => {
      if (config.key && animationManager.exists(config.key)) {
        return;
      }

      animationManager.create(config);
    };

    createOnce({
      key: "walk-down",
      frames: animationManager.generateFrameNumbers(this.spriteName, {
        start: 18,
        end: 23,
      }),
      frameRate: 10,
      repeat: -1,
    });

    createOnce({
      key: "walk-left",
      frames: animationManager.generateFrameNumbers(this.spriteName, {
        start: 12,
        end: 17,
      }),
      frameRate: 10,
      repeat: -1,
    });

    createOnce({
      key: "walk-right",
      frames: animationManager.generateFrameNumbers(this.spriteName, {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    createOnce({
      key: "walk-up",
      frames: animationManager.generateFrameNumbers(this.spriteName, {
        start: 6,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    createOnce({
      key: "idle-down",
      frames: animationManager.generateFrameNumbers(this.idleSpriteName, {
        start: 18,
        end: 23,
      }),
      frameRate: 5,
      repeat: -1,
    });

    createOnce({
      key: "idle-left",
      frames: animationManager.generateFrameNumbers(this.idleSpriteName, {
        start: 12,
        end: 17,
      }),
      frameRate: 5,
      repeat: -1,
    });

    createOnce({
      key: "idle-right",
      frames: animationManager.generateFrameNumbers(this.idleSpriteName, {
        start: 0,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1,
    });

    createOnce({
      key: "idle-up",
      frames: animationManager.generateFrameNumbers(this.idleSpriteName, {
        start: 6,
        end: 11,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }

  update() {
    const currentSpeed = this.sprintKey.isDown
      ? this.sprintSpeed
      : this.baseSpeed;
    const { left, right, up, down, leftArrow, rightArrow, upArrow, downArrow } =
      this.cursors;

    this.setVelocity(0);
    this.shadow.setPosition(this.x, this.y + this.height / 1.97);

    if (left.isDown || leftArrow.isDown) {
      this.lastDirection = "left";
      this.setVelocityX(-currentSpeed);
      this.anims.play("walk-left", true);
    } else if (right.isDown || rightArrow.isDown) {
      this.lastDirection = "right";
      this.setVelocityX(currentSpeed);
      this.anims.play("walk-right", true);
    } else if (up.isDown || upArrow.isDown) {
      this.lastDirection = "up";
      this.setVelocityY(-currentSpeed);
      this.anims.play("walk-up", true);
    } else if (down.isDown || downArrow.isDown) {
      this.lastDirection = "down";
      this.setVelocityY(currentSpeed);
      this.anims.play("walk-down", true);
    } else {
      switch (this.lastDirection) {
        case "up":
          this.anims.play("idle-up", true);
          break;
        case "down":
          this.anims.play("idle-down", true);
          break;
        case "left":
          this.anims.play("idle-left", true);
          break;
        case "right":
          this.anims.play("idle-right", true);
          break;
      }
    }
  }
}
