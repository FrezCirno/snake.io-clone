import Phaser from 'phaser';
import Snake from './snake';

export default class BotSnake extends Snake {
    /**
     * Bot extension of the core snake
     * @param  {Phaser.Scene} scene scene object
     * @param  {Number} x         coordinate
     * @param  {Number} y         coordinate
     */
    constructor(scene, x, y, name) {
        super(scene, x, y, name)
        this.name = 'bot'
        this.distcareness = Phaser.Math.RND.integerInRange(5, 30)
        this.anglecareness = Math.random() * Math.PI / 2
    }

    /**
     * Add functionality to the original snake update method so that this bot snake
     * can turn randomly
     */
    update() {
        var rot = 0; // 需要旋转的角度/角速度
        // 吃食物
        var closestFood = this.scene.physics.closest(this.head, this.scene.foodGroup.getChildren())
        var angleFood = Phaser.Math.Angle.BetweenPoints(this.head, closestFood)
        let dif = angleFood - this.head.rotation;
        if (dif > Math.PI) dif -= 2 * Math.PI;
        else if (dif < -Math.PI) dif += 2 * Math.PI;
        // 如果需要180度掉头, 则放弃
        if (Math.abs(dif) < Math.PI / 3) rot = dif

        // 防止撞车
        // var closestOther = this.scene.physics.closest(this.head, this.others.reduce((res, other) => res.concat(other.getChildren()), []))
        // var angleOther = Phaser.Math.Angle.BetweenPoints(this.head, closestOther)
        // var distOther = Phaser.Math.Distance.BetweenPoints(this.head, closestOther)

        // // 距离过近
        // if (distOther < this.distcareness) {
        //     let dif = angleOther - this.head.rotation;
        //     // 角度过近
        //     if (dif < this.anglecareness) {
        //         // 全力拐弯
        //         rot = Math.sign(dif) * Math.PI / 2
        //     }
        // }

        // 防止撞墙
        // var distWorld = Phaser.Math.Distance.BetweenPoints(this.head, this.scene.worldsize)
        // if (0);
        if (rot)
            this.head.setAngularVelocity(rot * this.rotationSpeed);
        super.update();
    }

    destroy() {
        super.destroy();
    }
}