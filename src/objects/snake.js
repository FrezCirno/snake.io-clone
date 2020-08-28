import 'phaser';
import Shadow from './shadow';
import EyePair from './eyePair';

export default class Snake {
    /**
     * Phaser snake
     * @param  {Phaser.Scene} scene scene object
     * @param  {String} spriteKey Phaser sprite key
     * @param  {Number} x         coordinate
     * @param  {Number} y         coordinate
     */
    constructor(scene, spriteKey, x, y, name) {
        this.scene = scene;

        this.spriteKey = spriteKey;

        //various quantities that can be changed
        this.scale = 0.5;
        this.slowSpeed = 180;
        this.fastSpeed = 280;
        this.rotationSpeed = 150;
        this.distanceIndex = 27;
        this.speed = this.slowSpeed;
        this.initLength = 6;

        this.preferredDistance = this.distanceIndex * this.scale;

        /** 蛇头每次update时的位置集合 */
        this.headPath = [];

        this.queuedSections = 0;
        this.loss = 0;

        // 蛇身节, 包括蛇头
        this.sectionGroup = this.scene.physics.add.group();

        for (let i = 0; i <= this.initLength - 1; i++) {
            this.addSectionAtPosition(x, y, this.spriteKey);
            this.headPath.push(new Phaser.Geom.Point(x, y));
        }
        this.head = this.sectionGroup.getFirst(true);

        this.lastHeadPosition = new Phaser.Geom.Point(this.head.x, this.head.y);

        // 碰撞检测
        this.others = []
        this.detector = this.scene.physics.add.overlap(this.head, this.others, function (head, other) {
            this.destroy();
        }, null, this);
        this.head.setCollideWorldBounds(true, 0);

        for (const snake of this.scene.snakes) {
            this.others.push(snake.sectionGroup);
            snake.others.push(this.sectionGroup);
        }
        this.scene.snakes.push(this);

        // 食物收集
        this.collector = this.scene.physics.add.image(this.head.x, this.head.y, 'circle');
        this.collector.alpha = 0;
        this.collector.snake = this;
        this.collector.scale = this.scale;
        this.collector.setCircle(this.head.body.halfWidth * 1.2, -0.2 * this.head.body.halfWidth, -0.2 * this.head.body.halfWidth);

        this.scene.physics.add.overlap(this.collector, this.scene.foodGroup, function (collector, food) {
            this.incrementSize(food.amount);
            this.scene.foodGroup.remove(food, true, true);
            if (this.scene.foodGroup.getLength() < this.scene.foodcount)
                this.scene.createFood(this.scene.rand(this.scene.worldsize.width),
                    this.scene.rand(this.scene.worldsize.height));
        }, null, this);

        //initialize the eyes
        this.eyes = new EyePair(this.scene, this.head, this.scale);

        //initialize the shadow
        this.lighton = false;
        this.shadow = new Shadow(this.scene, this, this.scale);
    }
    /**
     * 添加新节
     * @param  {Number} x coordinate
     * @param  {Number} y coordinate*-+
     * 
     * @param  {String} secSpriteKey sprite key
     * @return {Phaser.Physics.Arcade.Image}   new section
     */
    addSectionAtPosition(x, y, secSpriteKey = 'circle') {
        // 初始化新节, 必须得是物理sprite, 否则无法检测overlay
        var sec = this.scene.physics.add.image(x, y, secSpriteKey); // 中心位置
        sec.snake = this;
        sec.scale = this.scale;
        sec.setCircle(sec.body.halfWidth); // 以左上角为中心
        this.sectionGroup.add(sec);
        this.sectionGroup.setDepth(1 + this.sectionGroup.getLength(), -1);
        return sec;
    }
    /**
     * Call from the main update loop
     */
    update() {
        // 蛇头沿着this.head.angle/rotation的方向前进
        var velocity = this.scene.physics.velocityFromAngle(this.head.angle, this.speed);
        this.head.body.velocity = velocity.scale(0.5);


        // 把路径上的最后一个节点移到最开头
        // 因为只是点的集合所以可以这么做
        let point = this.headPath.pop();
        point.setTo(this.head.x, this.head.y);
        this.headPath.unshift(point);

        // 放置蛇身
        var index = this.findNextPointIndex(0);
        var lastIndex = null;
        // this.sectionGroup.children.entries.forEach((sec) => {
        //     sec.x = this.headPath[index].x;
        //     sec.y = this.headPath[index].y;

        //     //hide sections if they are at the same position
        //     if (lastIndex && index == lastIndex) {
        //         sec.alpha = 0;
        //     }
        //     else {
        //         sec.alpha = 1;
        //     }

        //     lastIndex = index;
        //     index = this.findNextPointIndex(index);
        // })
        var sections = this.sectionGroup.children.entries;
        for (let i = 1; i < sections.length; i++) {
            sections[i].x = this.headPath[index].x;
            sections[i].y = this.headPath[index].y;

            //hide sections if they are at the same position
            if (lastIndex && index == lastIndex) {
                sections[i].alpha = 0;
            }
            else {
                sections[i].alpha = 1;
            }

            lastIndex = index;
            index = this.findNextPointIndex(index);
        }

        // 如果index到头了, 说明headPath的长度不够, +1个
        if (index + 1 >= this.headPath.length) {
            var lastPos = this.headPath[this.headPath.length - 1];
            this.headPath.push(new Phaser.Geom.Point(lastPos.x, lastPos.y));
        } else if (index < this.headPath.length) {
            this.headPath.pop();
        }

        // 检查需不需要增长
        let found = false;
        let second = this.sectionGroup.children.entries[1];

        for (let i = 0; i < this.headPath.length && this.headPath[i].x != second.x && this.headPath[i].y != second.y; i++) {
            if (this.headPath[i].x == this.lastHeadPosition.x && this.headPath[i].y == this.lastHeadPosition.y) {
                found = true;
                break;
            }
        }
        if (!found) {
            this.lastHeadPosition.setTo(this.head.x, this.head.y);
            this.onCycleComplete();
        }

        // 检查detector和collector位置
        this.collector.setPosition(this.head.x, this.head.y);

        //update the eyes and the shadow below the snake
        this.eyes.update();
        this.shadow.update();

    }
    /**
     * 从蛇头的路径点中选出最接近段距离的下一个路径点的下标
     * @param  {Integer} currentIndex Index of the previous snake section
     * @return {Integer}              new index
     */
    findNextPointIndex(currentIndex) {
        // var offset = 7;
        // if (currentIndex + offset >= this.headPath.length) return this.headPath.length - 1;
        // return currentIndex + offset;


        //we are trying to find a point at approximately this distance away
        //from the point before it, where the distance is the total length of
        //all the lines connecting the two points
        var len = 0;
        var dif = len - this.preferredDistance;
        var prevDif = null;
        //this loop sums the distances between points on the path of the head
        //starting from the given index of the function and continues until
        //this sum nears the preferred distance between two snake sections

        for (var i = currentIndex; i + 1 < this.headPath.length && dif < 0; i++) {
            //get distance between next two points
            let dist = Phaser.Math.Distance.Between(this.headPath[i].x, this.headPath[i].y,
                this.headPath[i + 1].x, this.headPath[i + 1].y);
            len += dist; // 距离=折线段长度之和
            prevDif = dif;
            dif = len - this.preferredDistance;
        }
        // 至此, 到第i个节点的距离为len>=predis
        // 边界情况: 后面找不到可用的点了, prevDif===null, 返回不变
        if (prevDif === null || Math.abs(prevDif) > Math.abs(dif)) {
            return i;
        }
        else {
            return i - 1;
        }
    }
    /**
     * Called each time the snake's second section reaches where the
     * first section was at the last call (completed a single cycle)
     */
    onCycleComplete() {
        const seclen = this.sectionGroup.getLength();
        this.queuedSections -= seclen > this.initLength ? seclen / 500 : 0;

        if (this.queuedSections >= 1) {
            let last = this.sectionGroup.getLast(true);
            this.addSectionAtPosition(last.x, last.y);

            // 动态增长效果
            let length = this.headPath.length;
            let length1 = length * (seclen - 3) / (seclen - 2)
            this.headPath.splice(length1, length - length1);

            this.shadow.add(last.x, last.y)

            this.setScale(this.scale * 1.01);
            this.queuedSections--;

        } else if (this.queuedSections <= -1) {
            let last = this.sectionGroup.getLast(true);

            const loss = 0.5 + Math.random() * (-this.queuedSections - 0.5);
            this.scene.createFood(last.x, last.y, loss);

            this.loss += loss;
            if (this.loss >= 1) {
                this.sectionGroup.remove(last);
                last.destroy();

                let ls = this.shadow.shadowGroup.getLast(true);
                this.shadow.shadowGroup.remove();
                ls.destroy();

                this.setScale(this.scale * 0.99);
                this.loss = 0;
            }

            this.queuedSections += loss;
        }
    }
    /**
     * Set snake scale
     * @param  {Number} scale Scale
     */
    setScale(scale) {
        this.scale = scale;
        this.preferredDistance = this.distanceIndex * this.scale;

        //scale sections and their bodies
        for (const section of this.sectionGroup.children.entries) {
            section.setScale(scale);
        }
        this.collector.setScale(scale);

        //scale eyes and shadows
        this.eyes.setScale(scale);
        this.shadow.setScale(scale);
    }
    /**
     * Increment length and scale
     */
    incrementSize(amount) {
        this.queuedSections += amount;
    }
    /**
     * Destroy the snake
     */
    destroy() {
        // place food where snake was destroyed
        for (const sec of this.sectionGroup.children.entries) {
            this.scene.createFood(
                sec.x + this.scene.rand(20),
                sec.y + this.scene.rand(20)
            );
        }

        let index = this.scene.snakes.indexOf(this);
        this.scene.snakes.splice(index, 1);

        for (const snake of this.scene.snakes) {
            let index = snake.others.indexOf(this.sectionGroup);
            if (index > -1) snake.others.splice(index, 1);
        }

        this.sectionGroup.destroy(true);
        this.detector.destroy();
        this.collector.destroy();
        this.eyes.destroy();
        this.shadow.destroy();

        if (this.name == 'bot') {
            this.scene.createBotSnake(this.scene.rand(this.scene.worldsize.width),
                this.scene.rand(this.scene.worldsize.height));
        } else {
            var player = this.scene.createBotSnake(this.scene.rand(this.scene.worldsize.width), this.scene.rand(this.scene.worldsize.height), 'circle', 'player');
            this.scene.cameras.main.startFollow(player.head);
        }
    }
}
