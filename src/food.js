import 'phaser';

export default class Food {
    /**
     * Food that snakes eat - it is pulled towards the center of a snake head after
     * it is first touched
     * @param  {Phaser.Scene} scene scene object
     * @param  {Number} x    coordinate
     * @param  {Number} y    coordinate
     */
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.staticSprite(x, y, 'food');
        this.sprite.tint = 0xff0000;
        this.sprite.body.setCircle(this.sprite.width * 0.5);
        //set callback for when something hits the food
        this.scene.physics.add.overlap(this.sprite, this.scene.snake, function (event, phaserBody, bodyB) {
            console.log(phaserBody);
            if (phaserBody && phaserBody.sprite.name == "head" && this.constraint === null) {
                this.food.body.collides([]);
                //Create constraint between the food and the snake head that
                //it collided with. The food is then brought to the center of
                //the head sprite
                this.constraint = this.scene.createRevoluteConstraint(
                    this.food.body, [0, 0], phaserBody, [0, 0]
                );
                this.head = phaserBody.sprite;
                this.head.snake.food.push(this);
            }
        })

        this.sprite.food = this;

        this.head = null;
        this.constraint = null;
    }
    /**
     * Call from main update loop
     */
    update() {
        //once the food reaches the center of the snake head, destroy it and
        //increment the size of the snake
        if (this.head && Math.round(this.head.body.x) == Math.round(this.sprite.body.x) &&
            Math.round(this.head.body.y) == Math.round(this.sprite.body.y)) {
            this.head.snake.incrementSize();
            this.destroy();
        }
    }
    /**
     * Destroy this food and its constraints
     */
    destroy() {
        if (this.head) {
            this.scene.p2.removeConstraint(this.constraint);
            this.sprite.destroy();
            this.head.snake.food.splice(this.head.snake.food.indexOf(this), 1);
            this.head = null;
        }
    }
}