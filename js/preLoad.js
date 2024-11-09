import {Phaser} from "./phaser";

/**
 * 在游戏开始前预加载资源
 */
export class preLoad extends Phaser.Scene {
    constructor() {
        super("preLoadScene");
    }

    preload() {

        // 加载背景音乐

        // 死亡音效
        this.load.audio("dead", "./assets/audio/Dead.wav")
        // 跳跃音效
        this.load.audio("jump", "./assets/audio/Jump.wav")
        // 得分音效
        this.load.audio("score", "./assets/audio/Score.wav")

        // 加载图片资源
        
        for (let i = 1; i <= 5; i++) {
            // 5张仙人掌图片
            this.load.image("cactus-${i}", "./assets/images/Cactus-${i}.png")
        }

        for (let i = 1; i <= 4; i++){
            // 4张小恐龙图片
            this.load.image("dinosaur-${i}", "./assets/images/Dinosaur-${i}.png")
        }

        // 地面图片
        this.load.image("ground", "./assets/images/Ground.png")

        // 游戏结束文字图片
        this.load.image("gameover_text", "./assets/images/Gameover_text.png")
        
        // 再玩一次按钮图片
        this.load.image("replay_button", "./assets/images/Replay_button.png")
        }
    }