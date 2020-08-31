import 'phaser';
import BotSnake from '../objects/botSnake';
import PlayerSnake from '../objects/playerSnake';

export default class Battle extends Phaser.Scene {

    constructor() {
        super({
            key: 'battle',
            scale: {
                mode: Phaser.Scale.ENVELOP,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        });
    }

    rand(r) { return Phaser.Math.RND.integerInRange(-r / 2, r / 2); }

    create() {
        if (0) {
            this.worldsize = { x: 1000, y: 1000 };
            this.foodcount = 100;
            this.botcount = 10;
        } else {
            this.worldsize = { x: 5000, y: 5000 };
            this.foodcount = 500;
            this.botcount = 20;
        }

        // 填充背景 
        this.add.tileSprite(0, 0, this.worldsize.x, this.worldsize.y, 'background');
        this.physics.world.setBounds(-this.worldsize.x / 2, -this.worldsize.y / 2, this.worldsize.x, this.worldsize.y);

        this.physics.world.on('worldbounds', function (body) {
            body.gameObject._snake.destroy();
        });

        // 初始化物体组
        this.snakes = [];

        // 随机创建食物
        this.foodGroup = this.physics.add.group();
        for (let i = 0; i < this.foodcount; i++) {
            this.createFood(this.rand(this.worldsize.x), this.rand(this.worldsize.y),);
        }

        //create bots
        for (let i = 0; i < this.botcount; i++) {
            this.createSnake(BotSnake, this.randName());
        }

        // 跟随某个bot
        this.cameras.main.startFollow(this.snakes[0].head)
            .setBounds(-this.worldsize.x / 2, -this.worldsize.y / 2, this.worldsize.x, this.worldsize.y)

        // 重新进入此scene时(说明gameover), 创建玩家
        this.events.on('resume', () => {
            var player = this.createSnake(PlayerSnake, prompt("Please enter your name", "player"))
            this.cameras.main
                .startFollow(player.head)
                .setLerp(1, 1)
        }, this)

        this.events.on('resize', () => {
            this.game.config.width = window.innerWidth;
            this.game.config.height = window.innerHeight;
        })
    }
    /**
     * new snake
     */
    createSnake(bot, name) {
        var x, y;
        while (1) {
            x = this.rand(this.worldsize.x - 100)
            y = this.rand(this.worldsize.y - 100)
            var closest = this.physics.closest({ x, y }, this.snakes.reduce((res, snake) => res.concat(snake.sectionGroup.getChildren()), []))
            if (!closest) break;
            var dis = Phaser.Math.Distance.BetweenPoints(closest, { x, y })
            if (dis > 100) break;
        }
        let s = new bot(this, x, y, name)

        s.head.setCollideWorldBounds(true);
        s.head.body.onWorldBounds = true;

        return s;
    }

    randName() {
        const names = ['Apple', 'Banana', 'Cat', 'Trump',
            'Me', 'Sun', 'Snack', 'Snnke',
            'Star', 'Gabrielle', 'Wright',
            'Owen', 'Ferguson', 'Maria', 'Knox',
            'Sally', 'Randall', 'Kevin', 'Walker',
            'Brandon', 'Morgan', 'Kimberly', 'Clark',
            'Faith', 'Lee', 'Adrian', 'May',
            'Adrian', 'Morgan', 'Connor', 'McGrath',
            'Dylan', 'Bell', 'Jasmine', 'Cameron',
            'Emma', 'Rees', 'Caroline', 'Walsh',
            'Joshua', 'Stewart', 'Samantha', 'Forsyth',
            'Brandon', 'Simpson', 'Alan', 'Burgess',
            'Piers', 'Graham']
        return names[Phaser.Math.RND.integerInRange(0, names.length - 1)];
    }
    /**
     * Main update loop
     */
    update() {
        //update game components
        for (let index = 0; index < this.snakes.length; index++) {
            const snake = this.snakes[index];
            snake.update();
        }
        if (this.snakes.length < this.botcount) {
            this.createSnake(BotSnake, this.randName());
        }
        if (this.foodGroup.getLength() < this.foodcount) {
            this.createFood(this.rand(this.worldsize.x), this.rand(this.worldsize.y));
        }
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