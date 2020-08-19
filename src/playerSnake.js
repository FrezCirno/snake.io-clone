import 'phaser';
import Snake from './snake';
import { Utils } from 'phaser';

var text;

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

        scene.input.mouse.onMouseDown(this.mouseDown)
        scene.input.mouse.onMouseUp(this.mouseUp)

        this.addDestroyedCallback(function () {
            spaceKey.destroy()
        });

        text = this.scene.add.text(10, 10, '', { fill: "#00dd00" });
    }

    //make this snake light up and speed up when the space key is down
    mouseDown() {
        this.speed = this.fastSpeed;
        // this.shadow.isLightingUp = true;
    }
    //make the snake slow down when the space key is up again
    mouseUp() {
        this.speed = this.slowSpeed;
        // this.shadow.isLightingUp = false;
    }

    /**
     * Add functionality to the original snake update method so that the player
     * can control where this snake goes
     */
    update() {
        //find the angle that the head needs to rotate
        //through in order to face the mouse
        var pointer = this.scene.input.activePointer;
        var mousePosX = pointer.x;
        var mousePosY = pointer.y;
        var headX = this.head.body.center.x;
        var headY = this.head.body.center.y;
        var midX = this.scene.cameras.main.width / 2;
        var midY = this.scene.cameras.main.height / 2;
        var angle = Math.atan2(mousePosY - midY, mousePosX - midX);
        var dif = angle - this.head.body.angle;
        if (dif > Math.PI) dif -= 2 * Math.PI;
        if (dif < -Math.PI) dif += 2 * Math.PI;

        text.setPosition(this.head.body.center.x + 10, this.head.body.center.y + 10, 0);
        text.setText([
            'x: ' + pointer.x,
            'y: ' + pointer.y,
            'headx: ' + this.head.body.center.x,
            'heady: ' + this.head.body.center.y,
            'angle: ' + angle,
            'headangle: ' + this.head.body.angle,
            'dif: ' + dif
        ])

        //allow arrow keys to be used
        // if (this.scene.input.activePointer.leftButtonDown()) {
        //     this.head.body.setAngularVelocity(-this.rotationSpeed);
        // }
        // else if (this.scene.input.activePointer.rightButtonDown()) {
        //     this.head.body.setAngularVelocity(this.rotationSpeed);
        // }
        //decide whether rotating left or right will angle the head towards
        //the mouse faster, if arrow keys are not used
        this.head.body.setAngularVelocity(dif * this.rotationSpeed);

        if (pointer.leftButtonDown()) {
            this.speed = this.fastSpeed;
        } else {
            this.speed = this.slowSpeed;
        }

        //call the original snake update method
        super.update();
    }
}
