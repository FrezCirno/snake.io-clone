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

        this.scene.input.setPollAlways();
        this.scene.input.on('pointerdown', this.pointerdown, this);
        this.scene.input.on('pointerup', this.pointerup, this)
        this.onEat = () => this.scene.sound.play('eat');

        // 左下角显示状态
        this.status = this.scene.add.text(10, 10, "Your length: 6", { fontSize: 20, fontFamily: 'halogen' })
            .setScrollFactor(0, 0)
            .setTint(0)

        var main = this.scene.cameras.main;
        this.rank = this.scene.add.text(main.width - 170, 10, "Rank list", {})
            .setScrollFactor(0, 0)
            .setTint(0)
            .setDepth(999)

        // this.mini = this.scene.cameras.add(main.width - 200, main.height - 200, 200, 200)
        // .setName("mini")
        // .setBounds(0, 0, this.scene.worldsize.x, this.scene.worldsize.y)
        // .setZoom(0.05)
        // .startFollow(this.head)
    }

    pointerdown(pointer) {
        if (pointer.leftButtonDown()) {
            this.speed = this.fastSpeed;
            this.lighton = true;
        }
    }

    pointerup(pointer) {
        if (pointer.leftButtonReleased()) {
            this.speed = this.slowSpeed;
            this.lighton = false;
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

        this.head.setAngularVelocity(dif * this.rotationSpeed); // 不断调整角速度以达到平滑转弯的效果

        this.status.setText('Your length: ' + this.sectionGroup.getLength())

        var list = this.scene.snakes
            .map(snake => ({ text: snake.label.text, size: snake.sectionGroup.getLength() }))
            .sort((a, b) => a.size < b.size)
            .map((snake, index) => Phaser.Utils.String.Pad(index + 1, 3, ' ', 1) +
                '  ' + Phaser.Utils.String.Pad(snake.text, 10, ' ', 2) +
                snake.size)

        this.rank.setText([
            '     Rank list',
            ...list
        ])

        //call the original snake update method
        super.update();
    }

    destroy() {
        this.scene.sound.play('death')
        this.status.destroy();
        this.rank.destroy();
        var closest = this.scene.physics.closest(this.head, this.others.map(other => other.getChildren()[0]._snake.head))
        if (closest) this.scene.cameras.main.startFollow(closest);
        this.scene.input.off('pointerdown', this.pointerdown, this);
        this.scene.input.off('pointerup', this.pointerup, this);
        super.destroy();

        this.scene.scene.sendToBack('battle').run('start');
    }
}
