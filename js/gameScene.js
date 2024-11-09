export default class GameScene extends Phaser.Scene {
  constructor() {
    super("gameScene");
  }

  create() {
    // 获取游戏画布的宽度和高度
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;

    // 添加地面，确保地面在屏幕底部
    this.ground = this.add
      .tileSprite(0, height - 26, width, 26, "ground")
      .setOrigin(0, 1);

    // 如果需要，可以添加更多的游戏对象和逻辑
  }
}
