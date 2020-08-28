import 'phaser'
import Snake from './snake';

export default class Shadow {
    /**
     * Shadow below snake
     * @param  {Phaser.Scene} scene scene object
     * @param  {Snake} snake Array of snake section sprites
     * @param  {Number} scale    scale of the shadow
     */
    constructor(scene, snake, scale) {
        this.scene = scene;
        this.snake = snake;
        this.scale = scale;

        this.shadowGroup = this.scene.add.group();

        this.isLightingUp = false;

        this.lightStep = 0;
        this.maxLightStep = 3;

        this.lightUpdateCount = 0;
        this.updateLights = 3;

        //various tints that the shadow could have
        //since the image is white
        this.darkTint = 0xaaaaaa;
        this.lightTintBright = 0xaa3333;
        this.lightTintDim = 0xdd3333;

        for (const sec of this.snake.sectionGroup.children.entries) {
            this.add(sec.x, sec.y);
        }
    }
    /**
     * Add a new shadow at a position
     * @param  {Number} x coordinate
     * @param  {Number} y coordinate
     */
    add(x, y) {
        var shadow = this.scene.add.sprite(x, y, "shadow");
        shadow.scale = this.scale;
        this.shadowGroup.add(shadow);
    }
    /**
     * Call from the snake update loop
     */
    update() {
        let lastPos = null;
        for (let i = 0; i < this.snake.sectionGroup.getLength(); i++) {
            let shadow = this.shadowGroup.children.entries[i];
            var pos = {
                x: this.snake.sectionGroup.children.entries[i].x,
                y: this.snake.sectionGroup.children.entries[i].y
            };

            //hide the shadow if the previous shadow is in the same position
            if (lastPos && pos.x == lastPos.x && pos.y == lastPos.y) {
                shadow.alpha = 0;
                shadow.naturalAlpha = 0;
            }
            else {
                shadow.alpha = 1;
                shadow.naturalAlpha = 1;
            }
            //place each shadow below a snake section
            shadow.x = pos.x;
            shadow.y = pos.y;

            lastPos = pos;
        }

        //light up shadow with bright tints
        if (this.snake.lighton) {
            this.lightUpdateCount++;
            if (this.lightUpdateCount >= this.updateLights) {
                this.lightUp();
            }
        }
        //make shadow dark
        else {
            for (var i = 0; i < this.shadowGroup.children.entries.length; i++) {
                var shadow = this.shadowGroup.children.entries[i];
                shadow.tint = this.darkTint;
            }
        }
    }
    /**
     * Set scale of the shadow
     * @param  {Number} scale scale of shadow
     */
    setScale(scale) {
        this.scale = scale;
        for (const shadow of this.shadowGroup.children.entries) {
            shadow.scale = scale;
        }
    }
    /**
     * Light up the shadow from a gray to a bright color
     */
    lightUp() {
        this.lightUpdateCount = 0;
        for (var i = 0; i < this.shadowGroup.children.entries.length; i++) {
            var shadow = this.shadowGroup.children.entries[i];
            if (shadow.naturalAlpha > 0) {
                //create an alternating effect so shadow is not uniform
                if ((i - this.lightStep) % this.maxLightStep === 0) {
                    shadow.tint = this.lightTintBright;
                }
                else {
                    shadow.tint = this.lightTintDim;
                }
            }
        }
        //use a counter to decide how to alternate shadow tints
        this.lightStep++;
        if (this.lightStep == this.maxLightStep) {
            this.lightStep = 0;
        }
    }
    /**
     * destroy the shadow
     */
    destroy() {
        this.shadowGroup.destroy(true);
    }
}
