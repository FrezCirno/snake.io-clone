import Phaser from 'phaser';
import Snake from './snake';
import Util from './util';

export default class BotSnake extends Snake {
    /**
     * Bot extension of the core snake
     * @param  {Phaser.Scene} scene scene object
     * @param  {String} spriteKey Phaser sprite key
     * @param  {Number} x         coordinate
     * @param  {Number} y         coordinate
     */
    constructor(scene, spriteKey, x, y) {
        super(scene, spriteKey, x, y)
        this.trend = 1;
    }

    /**
     * Add functionality to the original snake update method so that this bot snake
     * can turn randomly
     */
    update() {
        //ensure that the bot keeps rotating in one direction for a
        //substantial amount of time before switching directions
        if (Util.randomInt(1, 20) == 1) {
            this.trend *= -1;
        }
        this.head.body.setAngularVelocity(this.trend * this.rotationSpeed);
        super.update();
    }
}