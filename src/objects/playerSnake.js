import 'phaser';
import Snake from './snake';

// var text;

export default class PlayerSnake extends Snake {
    /**
     * Player of the core snake for controls
     * @param  {Phaser.Scene} scene scene object
     * @param  {Number} x           coordinate
     * @param  {Number} y           coordinate
     */
    constructor(scene, x, y, name) {
        super(scene, x, y, name);
        this.scene = scene;

        // this.pointer = this.scene.input.activePointer;
        this.scene.input.setPollAlways();
        this.scene.input.on('pointerdown', this.pointerdown, this);
        this.scene.input.on('pointerup', this.pointerup, this)
    }

    pointerdown(pointer) {
        if (pointer.leftButtonDown()) {
            // if (this.slowTimer) {
            //     clearInterval(this.slowTimer);
            //     this.slowTimer = null;
            // }
            this.speed = this.fastSpeed;
            this.lighton = true;
        }
    }

    pointerup(pointer) {
        if (pointer.leftButtonReleased()) {
            // if (this.slowTimer) {
            //     clearInterval(this.slowTimer);
            //     this.slowTimer = null;
            // }
            // this.slowTimer = setInterval((t) => {
            //     console.log('slow')
            //     this.speed -= 10;
            //     if (this.speed < this.slowSpeed) {
            this.speed = this.slowSpeed;
            this.lighton = false;
            //         clearInterval(this.slowTimer);
            //         this.slowTimer = null;
            //     }
            // }, 100);
        }
    }

    /**
     * Add functionality to the original snake update method so that the player
     * can control where this snake goes
     */
    update() {
        const headX = this.head.x;
        const headY = this.head.y;
        const mousePosX = this.scene.input.activePointer.worldX || 0;
        const mousePosY = this.scene.input.activePointer.worldY || 0;
        const angle = Phaser.Math.Angle.Between(headX, headY, mousePosX, mousePosY);
        let dif = angle - this.head.rotation;
        if (dif > Math.PI) dif -= 2 * Math.PI;
        else if (dif < -Math.PI) dif += 2 * Math.PI;

        this.head.setAngularVelocity(dif * this.rotationSpeed);

        //call the original snake update method
        super.update();
    }

    destroy() {
        this.scene.cameras.main.startFollow(this.scene.physics.closest(this.head, this.others.map(other => other.getChildren()[0]._snake.head)));
        this.scene.input.off('pointerdown', this.pointerdown, this);
        this.scene.input.off('pointerup', this.pointerup, this);
        super.destroy();

        this.scene.scene.sendToBack('battle').run('start');
    }
}
