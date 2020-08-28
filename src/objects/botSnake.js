import Phaser from 'phaser';
import Snake from './snake';

export default class BotSnake extends Snake {
    /**
     * Bot extension of the core snake
     * @param  {Phaser.Scene} scene scene object
     * @param  {Number} x         coordinate
     * @param  {Number} y         coordinate
     */
    constructor(scene, x, y, name) {
        super(scene, x, y, name)
        this.name = 'bot';
        this.trend = 1;
    }

    /**
     * Add functionality to the original snake update method so that this bot snake
     * can turn randomly
     */
    update() {
        //ensure that the bot keeps rotating in one direction for a
        //substantial amount of time before switching directions
        if (Phaser.Math.RND.integerInRange(1, 20) == 1) {
            this.trend *= -1;
        }
        this.head.body.setAngularVelocity(this.trend * this.rotationSpeed);
        super.update();
    }

    destroy() {
        super.destroy();
        this.scene.createSnake(this.scene.rand(this.scene.worldsize.width),
            this.scene.rand(this.scene.worldsize.height), BotSnake, this.scene.randName());
    }
}