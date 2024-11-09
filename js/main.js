import PreLoad from "./preLoad.js";
import GameScene from "./gameScene.js";

// 游戏配置
const config = {
  type: Phaser.AUTO, // 游戏渲染器类型
  width: 800,
  height: 600,
  scene: [PreLoad, GameScene], // 游戏场景列表
};

// 创建游戏实例
const game = new Phaser.Game(config);
