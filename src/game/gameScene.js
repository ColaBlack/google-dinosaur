import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    /**
     * 画布宽度
     */
    width = 0;

    /**
     * 画布高度
     */
    height = 0;

    /**
     * 游戏速度
     */
    speed = 1;

    /**
     * 当前得分
     */
    score = 0;

    /**
     * 历史最高得分
     */
    highScore = 0;

    create() {
        // 获取游戏画布的宽度和高度
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;

        // 添加地面，确保地面在屏幕底部
        this.ground = this.physics.add.staticGroup();
        this.ground
            .create(this.width / 2, this.height - 13, "ground")
            .setScale(2)
            .refreshBody();

        // 创建一个组来存放所有的仙人掌
        this.cactusGroup = this.physics.add.group();

        // 添加一个小恐龙
        this.summonDinosaur();

        // 初始化动画
        this.initAnimate();

        // 初始化音效
        this.initSounds();

        // 按任意键跳跃
        this.input.keyboard.on("keydown", this.handleJump.bind(this), this);

        this.addScore();
    }

    update(time, delta) {
        // 移动地面，模拟奔跑效果
        this.ground.tilePositionX += 10 * this.speed;

        // 播放奔跑动画
        this.dinosaur.anims.play("run", true);

        // 检测小恐龙是否跳过仙人掌
        this.cactusGroup.getChildren().forEach((cactus) => {
            // 如果仙人掌的x坐标小于50且未被计分
            if (cactus.x < 50 && !cactus.getData("scored")) {
                // 标记仙人掌为已计分，避免重复计分
                cactus.setData("scored", true);
                // 播放得分音效
                this.scoreSound.play();
            }
        });

        // 定义计时器，每隔1-5秒生成一个仙人掌
        this.timer = this.timer || time;

        const cactusInterval = Phaser.Math.Clamp(
            2000 - this.speed * 100,
            500,
            2000
        ); // 最小间隔为500ms，最大间隔为2000ms

        if (time - this.timer > cactusInterval) {
            this.summonCactus();
            this.timer = time;
        }
    }

    initAnimate() {
        // 定义恐龙奔跑的动画
        this.dinosaur.anims.create({
            key: "run",
            frames: [
                {key: "dinosaur-1"},
                {key: "dinosaur-2"},
                {key: "dinosaur-3"},
                {key: "dinosaur-4"},
            ],
            frameRate: 10,
            repeat: -1,
        });
    }

    initSounds() {
        this.deadSound = this.sound.add("dead");
        this.jumpSound = this.sound.add("jump");
        this.scoreSound = this.sound.add("score");
    }

    summonDinosaur() {
        // 添加一个小恐龙
        this.dinosaur = this.physics.add
            .sprite(50, this.height / 2, "dinosaur-1")
            .setOrigin(0, 1);

        // 让小恐龙与地面发生碰撞，防止小恐龙掉落
        this.physics.add.collider(this.dinosaur, this.ground);

        // 添加小恐龙与仙人掌组之间的碰撞检测
        this.physics.add.collider(
            this.dinosaur,
            this.cactusGroup,
            this.handleDinoCactusCollision,
            null,
            this
        );
    }

    handleJump() {
        // 如果小恐龙不在地面上，则不执行跳跃以避免用户进行二段跳
        if (!this.dinosaur.body.onFloor()) {
            return;
        }

        // 跳跃
        this.dinosaur.setVelocityY(-1500);
        this.jumpSound.play();
    }

    summonCactus() {
        // 随机生成一个1-5的随机数作为仙人掌的编号
        const num = Math.floor(Math.random() * 5) + 1;

        // 生成仙人掌
        const cactus = this.physics.add
            .sprite(this.width, this.height - 26, `cactus-${num}`)
            .setOrigin(0, 1);

        // 让仙人掌与地面发生碰撞，防止仙人掌掉落
        this.physics.add.collider(cactus, this.ground);

        // 将新创建的仙人掌添加到组中
        this.cactusGroup.add(cactus);

        // 设置仙人掌的速度，让它向左移动
        cactus.setVelocityX(-200);

        // 当仙人掌离开屏幕时销毁
        cactus.on(
            "OutOfBounds",
            function () {
                this.destroy();
            },
            cactus
        );
    }

    handleDinoCactusCollision() {
        this.deadSound.play();
        // 当小恐龙与仙人掌碰撞时，停止游戏
        this.physics.pause();
        this.isGameRunning = false;
        this.anims.pauseAll();
        this.speed = 1;
        this.score = 0;
        // 游戏结束时停止得分增加
        if (this.scoreEvent) {
            this.scoreEvent.remove(false);
        }
        this.handleGameOver();
    }

    handleGameOver() {
        // 显示游戏结束文字
        const gameOverText = this.add
            .image(this.width / 2, this.height / 2 - 100, "gameover_text")
            .setScale(2);

        // 显示再玩一次按钮
        const replayButton = this.add
            .image(this.width / 2, this.height / 2 + 100, "replay_button")
            .setInteractive()
            .setScale(2);

        // 为再玩一次按钮添加点击事件监听器
        replayButton.on("pointerdown", () => {
            this.scene.restart(); // 重新开始当前场景
        });
    }

    addScore() {
        // 显示当前得分
        this.scoreText = this.add.text(
            this.width / 2 - 100,
            100,
            `Score: ${this.score} High Score: ${this.highScore}`,
            {
                fontSize: "32px",
                fill: "#000",
            }
        );

        // 每隔100毫秒增加得分
        this.scoreEvent = this.time.addEvent({
            delay: 100,
            callback: () => {
                this.score += 1;
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                }
                this.scoreText.setText(
                    `Score: ${this.score} High Score: ${this.highScore}`
                );
                this.speed += 0.01; // 加快游戏速度
            },
            callbackScope: this,
            loop: true,
        });
    }
}
