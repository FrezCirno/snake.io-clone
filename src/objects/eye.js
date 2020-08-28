import 'phaser';

export default class Eye {
    /**
     * The black and white parts of a snake eye, with constraints
     * @param  {Phaser.Scene} scene scene object
     * @param  {Phaser.Physics.Arcade.Image} head  snake head sprite
     * @param  {Number} scale scale of the new eye
     */
    constructor(scene, head, scale, xoff, yoff) {
        this.scene = scene;
        this.head = head;
        this.xoff = xoff;
        this.yoff = yoff;

        //initialize the circle sprites
        this.whiteCircle = this.scene.add.image(this.head.x, this.head.y, "eye-white");
        this.whiteCircle.scale = scale;
        this.whiteCircle.depth = 9999;

        this.blackCircle = this.scene.add.image(this.whiteCircle.x, this.whiteCircle.y, "eye-black");
        this.blackCircle.scale = scale;
        this.blackCircle.depth = 9999;

        this.pointer = this.scene.input.activePointer;
        this.midX = this.scene.cameras.main.width / 2;
        this.midY = this.scene.cameras.main.height / 2;
    }
    /**
     * Call from the update loop
     */
    update() {
        const mousePosX = this.pointer.x || 0;
        const mousePosY = this.pointer.y || 0;
        const angle = Phaser.Math.Angle.Between(this.midX, this.midY, mousePosX, mousePosY);

        const vwhite = this.head.body.velocity.clone().normalize();
        const twhite = new Phaser.Math.Vector2(vwhite.y, -vwhite.x);
        const offw = vwhite.scale(this.yoff).add(twhite.scale(this.xoff)).scale(this.head.displayWidth / 2);
        this.whiteCircle.setPosition(this.head.x + offw.x, this.head.y + offw.y);

        const br = (this.whiteCircle.displayWidth - this.blackCircle.displayWidth) / 2;
        const bx = br * Math.cos(angle);
        const by = br * Math.sin(angle);
        this.blackCircle.setPosition(this.whiteCircle.x + bx, this.whiteCircle.y + by);
    }
    /**
    * Set the eye scale
    * @param  {Number} scale new scale
    */
    setScale(scale) {
        this.whiteCircle.scale = scale;
        this.blackCircle.scale = scale;
    }
    /**
     * Destroy this eye
     */
    destroy() {
        this.whiteCircle.destroy();
        this.blackCircle.destroy();
    }
}
