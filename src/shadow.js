import 'phaser'

export default class Shadow {
    /**
     * Shadow below snake
     * @param  {Phaser.Scene} scene scene object
     * @param  {Array} sections Array of snake section sprites
     * @param  {Number} scale    scale of the shadow
     */
    constructor(scene, sections, scale) {
        this.scene = scene;
        this.sections = sections;
        this.scale = scale;
        this.shadowGroup = this.scene.add.group();
        this.shadows = [];
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
    }
    /**
     * Add a new shadow at a position
     * @param  {Number} x coordinate
     * @param  {Number} y coordinate
     */
    add(x, y) {
        var shadow = this.scene.add.sprite(x, y, "shadow");
        this.scene.scene.
            shadow.scale.setTo(this.scale);
        shadow.anchor.set(0.5);
        this.shadowGroup.add(shadow);
        this.shadows.push(shadow);
    }
    /**
     * Call from the snake update loop
     */
    update() {
        var lastPos = null;
        for (var i = 0; i < this.sections.length; i++) {
            var shadow = this.shadows[i];
            var pos = {
                x: this.sections[i].body.x,
                y: this.sections[i].body.y
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
            shadow.position.x = pos.x;
            shadow.position.y = pos.y;

            lastPos = pos;
        }

        //light up shadow with bright tints
        if (this.isLightingUp) {
            this.lightUpdateCount++;
            if (this.lightUpdateCount >= this.updateLights) {
                this.lightUp();
            }
        }
        //make shadow dark
        else {
            for (var i = 0; i < this.shadows.length; i++) {
                var shadow = this.shadows[i];
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
        for (var i = 0; i < this.shadows.length; i++) {
            this.shadows[i].scale.setTo(scale);
        }
    }
    /**
     * Light up the shadow from a gray to a bright color
     */
    lightUp() {
        this.lightUpdateCount = 0;
        for (var i = 0; i < this.shadows.length; i++) {
            var shadow = this.shadows[i];
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
        for (var i = this.shadows.length - 1; i >= 0; i--) {
            this.shadows[i].destroy();
        }
    }
}
