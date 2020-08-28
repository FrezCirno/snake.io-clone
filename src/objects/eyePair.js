import 'phaser';
import Eye from './eye';

export default class EyePair {
    /**
     * Creates a pair of eyes
     * @param  {Phaser.Scene} scene scene object
     * @param  {Phaser.Sprite} head  Snake head sprite
     * @param  {Number} scale scale of eyes
     */
    constructor(scene, head, scale) {
        this.eyes = [];

        //create two eyes
        this.leftEye = new Eye(scene, head, scale, -0.5, 0.3);
        this.eyes.push(this.leftEye);

        this.rightEye = new Eye(scene, head, scale, 0.5, 0.3);
        this.eyes.push(this.rightEye);
    }
    /**
     * Call from snake update loop
     */
    update() {
        this.eyes.forEach(eye => eye.update());
    }
    /**
     * Set the scale of the eyes
     * @param  {Number} scale new scale
     */
    setScale(scale) {
        this.eyes.forEach(eye => eye.setScale(scale));
    }
    /**
     * Destroy this eye pair
     */
    destroy() {
        this.eyes.forEach(eye => eye.destroy());
    }
}