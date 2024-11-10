import React, {useEffect} from 'react';
import Phaser from 'phaser';
import PreLoad from './preLoad';
import GameScene from './gameScene';


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
            gravity: {y: 5000}, // 重力设置
            debug: false, // 调试模式
        },
    },
};

const PhaserGame: React.FC = () => {

    useEffect(() => {

        // 创建Phaser游戏实例
        const game = new Phaser.Game(config);

        // 清理函数
        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game"/>;
};

export default PhaserGame;
