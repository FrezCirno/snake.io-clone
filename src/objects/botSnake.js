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
        this.careness = Math.random()
        this.distcareness = Phaser.Math.RND.integerInRange(100, 600)
        this.anglecareness = (Math.random() / 2 + 0.5) * Math.PI / 4
        this.worldBoundCareness = Phaser.Math.RND.integerInRange(100, Math.min(this.scene.worldsize.x, this.scene.worldsize.y) / 50);
        this.trendRotation = 0;
    }

    getRotateValue(rotation, prefRotation) {
        var dif = prefRotation - rotation;
        // 修正到-Pi,Pi之间
        if (dif > Math.PI) dif -= 2 * Math.PI;
        else if (dif < -Math.PI) dif += 2 * Math.PI;
        return dif;
    }

    /**
     * Add functionality to the original snake update method so that this bot snake
     * can turn randomly
     */
    update() {
        var rot = 0; // 新的角速度
        var rotation = this.head.rotation; // 当前的速度方向(弧度),向右为0
        // 吃食物
        var closestFood = this.scene.physics.closest(this.head, this.scene.foodGroup.getChildren())
        if (closestFood) {
            var angleFood = Phaser.Math.Angle.BetweenPoints(this.head, closestFood)
            var dif = this.getRotateValue(rotation, angleFood)
            // 最大允许转过60度
            if (Math.abs(dif) < Math.PI / 3) {
                rot = dif
            }
        }

        // 防止撞车
        var closestOther = this.scene.physics.closest(this.head, this.others.reduce((res, other) => res.concat(other.getChildren()), []))
        if (closestOther) {
            var distOther = Phaser.Math.Distance.BetweenPoints(this.head, closestOther)
            var angleOther = Phaser.Math.Angle.BetweenPoints(this.head, closestOther)

            // 距离过近
            if (distOther < this.distcareness) {
                let dif = angleOther - rotation;
                // 角度过近
                if (Math.abs(dif) < this.anglecareness) {
                    // 全力拐弯
                    rot = -Math.sign(dif) * Math.PI
                    // console.log(this.globalkey + ' panic, and turn ' + (rot > 0 ? 'left' : 'right'))
                }
            }
        }

        // 防止撞墙
        var distWorldl = this.head.x + this.scene.worldsize.x / 2
        var distWorldt = this.head.y + this.scene.worldsize.y / 2
        var distWorldr = this.scene.worldsize.x / 2 - this.head.x
        var distWorldb = this.scene.worldsize.y / 2 - this.head.y
        var inTurn = 0;
        if (distWorldl < this.worldBoundCareness || distWorldr < this.worldBoundCareness) {
            inTurn = 1;
            if (!this.boundTurnTrend1) this.boundTurnTrend1 = Math.PI - rotation
            var dif = this.getRotateValue(rotation, this.boundTurnTrend1)
            rot = (rot ? (rot + dif) / 2 : dif);
        }
        if (distWorldt < this.worldBoundCareness || distWorldb < this.worldBoundCareness) {
            inTurn = 1;
            if (!this.boundTurnTrend2) this.boundTurnTrend2 = -rotation
            var dif = this.getRotateValue(rotation, this.boundTurnTrend2)
            rot = (rot ? (rot + dif) / 2 : dif);
        }
        // 转弯完毕
        if (!inTurn) {
            this.boundTurnTrend1 = 0;
            this.boundTurnTrend2 = 0;
        }

        // 如果没动作, 则沿着感兴趣的方向前进
        if (!rot) {
            if (Math.random() < 1 / 20) {
                this.trendRotation = (Math.random() - 0.5) * 2 * Math.PI; // 随便找个方向
            }
            rot = this.getRotateValue(rotation, this.trendRotation)
        }
        this.head.setAngularVelocity(rot * this.rotationSpeed);
        super.update();
    }

    destroy() {
        super.destroy();
    }
}