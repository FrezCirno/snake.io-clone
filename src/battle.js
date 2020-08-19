import 'phaser';
import Util from './util';
import PlayerSnake from './playerSnake';
import BotSnake from './botSnake';
import Food from './food';

export default class Battle extends Phaser.Scene {
    constructor() {
        super({ key: 'Battle' });
    }

    preload() {
        // 加载游戏资源
        this.load.image('circle', 'src/assets/circle.png');
        this.load.image('shadow', 'src/assets/white-shadow.png');
        this.load.image('background', 'src/assets/tile.png');

        this.load.image('eye-white', 'src/assets/eye-white.png');
        this.load.image('eye-black', 'src/assets/eye-black.png');

        this.load.image('food', 'src/assets/hex.png');
    }

    create() {
        var height = this.game.config.height;
        var width = this.game.config.width;

        this.cameras.main.setBackgroundColor('#444');

        // 填充背景
        var background = this.add.tileSprite(0, 0, 5000, 5000, 'background');

        // 初始化物体组
        // this.foodGroup = this.add.group();
        // this.foodCollisionGroup = this.physics.add.staticGroup();
        this.snakeHeadCollisionGroup = this.physics.add.group();

        // 随机创建食物
        // for (var i = 0; i < 100; i++) {
        //     this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height));
        // }

        this.snakes = [];

        //create player
        var snake = new PlayerSnake(this, 'circle', 0, 0);
        this.snakes.push(snake);
        this.snakeHeadCollisionGroup.add(snake.head);

        this.cameras.main.startFollow(snake.head);

        //create bots
        // var bot1 = new BotSnake(this, 'circle', -200, 0);
        // var bot2 = new BotSnake(this, 'circle', 200, 0);
        // this.snakes.push(bot1);
        // this.snakeHeadCollisionGroup.add(bot1.head);
        // this.snakes.push(bot2);
        // this.snakeHeadCollisionGroup.add(bot2.head);

        //initialize snake groups and collision
        for (var i = 0; i < this.snakes.length; i++) {
            var snake = this.snakes[i];
            this.snakeHeadCollisionGroup.add(snake.head)
            // snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
            // snake.head.body.collides([this.foodCollisionGroup]);
            //callback for when a snake is destroyed
            // snake.head.on.addDestroyedCallback(this.snakeDestroyed, this);
        }
    }
    /**
     * Main update loop
     */
    update() {
        //update game components
        for (var i = this.snakes.length - 1; i >= 0; i--) {
            this.snakes[i].update();
        }
        // for (var i = this.foodGroup.children.length - 1; i >= 0; i--) {
        //     var f = this.foodGroup.children[i];
        //     f.food.update();
        // }
    }

    /**
     * Create a piece of food at a point
     * @param  {number} x x-coordinate
     * @param  {number} y y-coordinate
     * @return {Food}   food object created
     */
    initFood(x, y) {
        var food = new Food(this, x, y);
        this.foodGroup.add(food.sprite);
        // f.sprite.body.collides([this.snakeHeadCollisionGroup]);
        return food;
    }

    snakeDestroyed(snake) {
        // place food where snake was destroyed
        for (var i = 0; i < snake.headPath.length;
            i += Math.round(snake.headPath.length / snake.snakeLength) * 2) {
            this.initFood(
                snake.headPath[i].x + Util.randomInt(-10, 10),
                snake.headPath[i].y + Util.randomInt(-10, 10)
            );
        }
    }
}