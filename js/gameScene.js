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

  speed = 1;

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

    // 添加一个小恐龙
    this.dinosaur = this.physics.add
      .sprite(50, this.height / 2, "dinosaur-1")
      .setOrigin(0, 1);

    // 让小恐龙与地面发生碰撞，防止小恐龙掉落
    this.physics.add.collider(this.dinosaur, this.ground);

    // 调用initAnimate方法初始化动画
    this.initAnimate();

    // 监听用户输入
    this.handleInput();
  }

  update(time, delta) {
    // 移动地面，模拟奔跑效果
    this.ground.tilePositionX += 10 * this.speed;

    // 播放奔跑动画
    this.dinosaur.anims.play("run", true);

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
        { key: "dinosaur-1" },
        { key: "dinosaur-2" },
        { key: "dinosaur-3" },
        { key: "dinosaur-4" },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }

  /**
   * 处理用户输入，监听键盘事件
   */
  handleInput() {
    // 监听到按下空格键时，调用handleJump方法
    this.input.keyboard.on("keydown-SPACE", this.handleJump.bind(this));
  }

  handleJump() {
    // 如果小恐龙不在地面上，则不执行跳跃以避免用户进行二段跳
    if (!this.dinosaur.body.onFloor()) {
      return;
    }

    // 跳跃
    this.dinosaur.setVelocityY(-1500);
  }

  summonCactus() {
    // 随机生成一个1-5的随机数作为仙人掌的编号
    const num = Math.floor(Math.random() * 5) + 1;

    const distance = Phaser.Math.Between(600, 900);

    // 生成仙人掌
    const cactus = this.physics.add
      .sprite(this.width, this.height - 26, `cactus-${num}`)
      .setOrigin(0, 1);

    // 让仙人掌与地面发生碰撞，防止仙人掌掉落
    this.physics.add.collider(cactus, this.ground);

    // 设置仙人掌的速度，让它向左移动
    cactus.setVelocityX(-200);
    
    // 每生成一个仙人掌，游戏速度加快
    this.speed += 0.1;

    // 当仙人掌离开屏幕时销毁
    cactus.on(
      "OutOfBounds",
      function () {
        this.destroy(); 
      },
      cactus
    );
  }
}
