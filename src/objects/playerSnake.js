import 'phaser';
import Snake from './snake';

// var text;

export default class PlayerSnake extends Snake {
    /**
     * Player of the core snake for controls
     * @param  {Phaser.Scene} scene scene object
     * @param  {String} spriteKey   Phaser sprite key
     * @param  {Number} x           coordinate
     * @param  {Number} y           coordinate
     */
    constructor(scene, spriteKey, x, y) {
        super(scene, spriteKey, x, y);
        this.scene = scene;

        this.pointer = this.scene.input.activePointer;
        // this.midX = this.scene.cameras.main.width / 2;
        // this.midY = this.scene.cameras.main.height / 2;

        this.scene.input.on('pointerdown', function (pointer) {
            if (pointer.leftButtonDown()) {
                this.speed = this.fastSpeed;
                this.lighton = true;
            }
        }, this)
        this.scene.input.on('pointerup', function (pointer) {
            if (pointer.leftButtonReleased()) {
                this.speed = this.slowSpeed;
                this.lighton = false;
            }
        }, this)
    }

    /**
     * Add functionality to the original snake update method so that the player
     * can control where this snake goes
     */
    update() {
        this.midX = this.scene.cameras.main.width / 2 || 0;
        this.midY = this.scene.cameras.main.height / 2 || 0;
        const mousePosX = this.pointer.x || 0;
        const mousePosY = this.pointer.y || 0;
        const angle = Phaser.Math.Angle.Between(this.midX, this.midY, mousePosX, mousePosY);
        let dif = angle - this.head.rotation;
        if (dif > Math.PI) dif -= 2 * Math.PI;
        else if (dif < -Math.PI) dif += 2 * Math.PI;

        this.head.setAngularVelocity(dif * this.rotationSpeed);

        //call the original snake update method
        super.update();
    }
}
