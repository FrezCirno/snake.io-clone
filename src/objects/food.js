import 'phaser';

export default class Food extends Phaser.Physics.Arcade.Sprite {
    /**
     * Food that snakes eat - it is pulled towards the center of a snake head after
     * it is first touched
     * @param  {Phaser.Scene} scene scene object
     * @param  {Number} x    coordinate
     * @param  {Number} y    coordinate
     */
    constructor(scene, x, y, key = 'food') {
        super(scene, x, y, key);
        this.tint = 0xff0000;
    }
}