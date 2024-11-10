import PreLoad from "./preLoad.js";
import GameScene from "./gameScene.js";

// 游戏配置
const config = {
  type: Phaser.AUTO, // 游戏渲染器类型
  width: 800,
  height: 300,
  backgroundColor: "#ffffff", //修改背景色为白色
  parent: "game", 
  scene: [PreLoad, GameScene], // 游戏场景列表
  physics: {
    default: "arcade", // 默认物理引擎
    arcade: {
      gravity: { y: 5000 }, // 重力设置
      debug: false, // 调试模式
    },
  },
};

// 创建游戏实例
const game = new Phaser.Game(config);
