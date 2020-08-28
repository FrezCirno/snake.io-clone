import 'phaser';
import BotSnake from '../objects/botSnake';
import PlayerSnake from '../objects/playerSnake';

export default class Battle extends Phaser.Scene {

    constructor() {
        super({ key: 'battle' });
    }

    rand(r) { return Phaser.Math.RND.integerInRange(-r / 2, r / 2); }

    create() {
        this.worldsize = { width: 5000, height: 5000 };
        this.foodcount = 2000;
        this.botcount = 10;

        this.cameras.main.setBackgroundColor('#444');

        // 填充背景 
        this.add.tileSprite(0, 0, this.worldsize.width, this.worldsize.height, 'background');
        // this.physics.world.bac.setBackgroundColor(0xf0f0f0);
        this.physics.world.setBounds(-this.worldsize.width / 2, -this.worldsize.height / 2, this.worldsize.width, this.worldsize.height);

        // 初始化物体组
        this.snakes = [];

        // 随机创建食物
        this.foodGroup = this.physics.add.group();
        for (let i = 0; i < this.foodcount; i++) {
            this.createFood(this.rand(this.worldsize.width), this.rand(this.worldsize.height),);
        }

        //create player
        var player = this.createBotSnake(this.rand(this.worldsize.width), this.rand(this.worldsize.height), 'circle', 'player')
        var cam = this.cameras.main;
        cam.startFollow(player.head);

        //create bots
        for (let i = 0; i < this.botcount; i++) {
            this.createBotSnake(this.rand(this.worldsize.width), this.rand(this.worldsize.height),);
        }

        this.physics.world.on('worldbounds', function (body) {
            body.snake.destroy();
        })
    }
    /**
     * new snake
     */
    createBotSnake(x, y, key = 'circle', type = 'bot') {
        let s = (type == 'bot' ? new BotSnake(this, key, x, y) : new PlayerSnake(this, key, x, y));
        return s;
    }
    /**
     * Main update loop
     */
    update() {
        //update game components
        this.snakes.forEach(snake => snake.update());
    }

    /**
     * Create a piece of food at a point
     * @param  {number} x x-coordinate
     * @param  {number} y y-coordinate
     * @return {Food}   food object created
     */
    createFood(x, y, amount, key = 'food') {
        const food = this.physics.add.sprite(x, y, key);
        food.name = 'food';
        food.tint = 0xff0000;
        food.amount = amount || (Math.random() / 2 + 0.5);
        food.setScale(0.3 + food.amount);
        food.body.setCircle(food.width * 0.5);
        this.foodGroup.add(food);
        return food;
    }
}