import 'phaser';
import BotSnake from '../objects/botSnake';
import PlayerSnake from '../objects/playerSnake';

export default class Battle extends Phaser.Scene {

    constructor() {
        super({ key: 'battle' });
    }

    rand(r) { return Phaser.Math.RND.integerInRange(-r / 2, r / 2); }

    create() {
        this.worldsize = { width: 3000, height: 3000 };
        this.foodcount = 500;
        this.botcount = 5;

        // 填充背景 
        this.add.tileSprite(0, 0, this.worldsize.width, this.worldsize.height, 'background');
        // this.physics.world.bac.setBackgroundColor(0xf0f0f0);
        this.physics.world.setBounds(-this.worldsize.width / 2, -this.worldsize.height / 2, this.worldsize.width, this.worldsize.height);

        this.physics.world.on('worldbounds', function (body) {
            body.gameObject._snake.destroy();
        });

        // 初始化物体组
        this.snakes = [];

        // 随机创建食物
        this.foodGroup = this.physics.add.group();
        for (let i = 0; i < this.foodcount; i++) {
            this.createFood(this.rand(this.worldsize.width), this.rand(this.worldsize.height),);
        }

        //create player
        var player = this.createSnake(this.rand(this.worldsize.width), this.rand(this.worldsize.height), PlayerSnake, 'player')
        var cam = this.cameras.main;
        cam.startFollow(player.head);
        cam.setBounds(-this.worldsize.width / 2, -this.worldsize.height / 2, this.worldsize.width, this.worldsize.height)

        //create bots
        for (let i = 0; i < this.botcount; i++) {
            this.createSnake(this.rand(this.worldsize.width), this.rand(this.worldsize.height), BotSnake, this.randName());
        }
    }
    /**
     * new snake
     */
    createSnake(x, y, bot, name) {
        let s = new bot(this, x, y, name);
        return s;
    }

    randName() {
        const names = ['Apple', 'Banana', 'Cat', 'Trump', 'Me', 'Sun', 'Snack', 'Snnke', 'Star']
        return names[Phaser.Math.RND.integerInRange(0, names.length - 1)];
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
        food.tint = Phaser.Math.RND.integerInRange(0, 0xffffff);
        food.alpha = Phaser.Math.RND.realInRange(0.5, 1)
        food.amount = amount || (Math.random() / 2 + 0.5);
        food.setScale(0.3 + food.amount);
        food.body.setCircle(food.width * 0.5);
        this.foodGroup.add(food);
        return food;
    }
}