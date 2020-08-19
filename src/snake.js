import 'phaser';
import Util from './util';
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
    constructor(scene, spriteKey, x, y) {
        this.scene = scene;

        this.debug = false;
        // this.snakeLength = 0;
        this.spriteKey = spriteKey;

        //various quantities that can be changed
        this.scale = 0.3;
        this.fastSpeed = 200;
        this.slowSpeed = 130;
        this.speed = this.slowSpeed;
        this.rotationSpeed = 200;
        this.preferredDistance = 30 * this.scale;

        //initialize groups and arrays
        // this.collisionGroup = this.scene.matter.world.nextCategory();

        /** 蛇头每次update时的位置集合 */
        this.headPath = [];
        this.food = [];

        this.queuedSections = 0;

        //initialize the shadow
        // this.shadow = new Shadow(scene, this.sections, this.scale);

        // /** 蛇身节, 包括蛇头 */
        // this.sections = [];
        /** 蛇身节, 包括蛇头 */
        this.sectionGroup = this.scene.add.group();
        /** 蛇头 */
        this.head = this.addSectionAtPosition(x, y, this.spriteKey);
        this.head.name = "head";
        this.head.snake = this;

        this.lastHeadPosition = new Phaser.Geom.Point(this.head.x, this.head.y);
        //add 30 sections behind the head
        for (var i = 1; i <= 30; i++) {
            var x = this.head.x;
            var y = this.head.y + i * this.preferredDistance;
            this.addSectionAtPosition(x, y, this.spriteKey);
            this.headPath.push(new Phaser.Geom.Point(x, y));
        }

        //initialize the eyes
        // this.eyes = new EyePair(this, this.head, this.scale);

        // 蛇头的边, 检测碰撞使用
        // this.detectorOffset = 4;
        // this.detector = this.scene.physics.add.sprite(x, y - this.detectorOffset, this.spriteKey);
        // this.detector.name = "detector";
        // this.detector.alpha = 0;
        // this.detector.setCircle(this.detectorOffset);

        //constrain edge to the front of the head
        // this.detectorLock = this.scene.matter.add.constraint(this.detector.body, this.head.body);

        // this.detector.on('collisionstart', function (event, body, bodyB) {
        //     //if the edge hits another snake's section, destroy this snake
        //     if (body && this.sections.indexOf(body.sprite) == -1) {
        //         this.destroy();
        //     }
        //     //if the edge hits this snake's own section, a simple solution to avoid
        //     //glitches is to move the edge to the center of the head, where it
        //     //will then move back to the front because of the lock constraint
        //     else if (body) {
        //         this.edge.body.x = this.head.x;
        //         this.edge.body.y = this.head.y;
        //     }
        // });

        this.onDestroyedCallbacks = [];
        this.onDestroyedContexts = [];
    }
    /**
     * 添加新节
     * @param  {Number} x coordinate
     * @param  {Number} y coordinate
     * @param  {String} secSpriteKey sprite key
     * @return {Phaser.Physics.Arcade.Sprite}   new section
     */
    addSectionAtPosition(x, y, secSpriteKey) {
        // 初始化新节
        var sec = this.scene.physics.add.sprite(x, y, secSpriteKey, null);

        sec.body.kinematic = true;
        // sec.sendToBack();
        sec.scale = this.scale;
        sec.setCircle(sec.width / 2);

        // this.snakeLength++;
        this.sectionGroup.add(sec);
        // this.sections.push(sec);

        // this.shadow.add(x, y);
        return sec;
    }
    /**
     * Add to the queue of new sections
     * @param  {Integer} amount Number of sections to add to queue
     */
    addSectionsAfterLast(amount) {
        this.queuedSections += amount;
    }
    /**
     * Call from the main update loop
     */
    update() {
        // 蛇头沿着this.head.angle/rotation的方向前进
        this.scene.physics.velocityFromAngle(this.head.angle, this.speed, this.head.body.velocity);

        // 把路径上的最后一个节点移到最开头
        // 因为只是点的集合所以可以这么做
        var point = this.headPath.pop();
        point.setTo(this.head.x, this.head.y);
        this.headPath.unshift(point);


        // 放置蛇身
        var index = 0;
        var lastIndex = null;
        var sections = this.sectionGroup.children.entries;
        for (var i = 1; i < sections.length; i++) {

            sections[i].body.x = this.headPath[index].x;
            sections[i].body.y = this.headPath[index].y;

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
            var lastPos = this.headPath.pop();
            this.headPath.push(lastPos);
            this.headPath.push(new Phaser.Geom.Point(lastPos.x, lastPos.y));
        }
        else { // 否则减一个
            this.headPath.pop();
        }

        //this calls onCycleComplete every time a cycle is completed
        //a cycle is the time it takes the second section of a snake to reach
        //where the head of the snake was at the end of the last cycle
        var found = false;
        var second = this.sectionGroup.children.entries[1];
        var i = 0;
        for (; this.headPath[i].x != second.body.x && this.headPath[i].y != second.body.y; i++) {
            if (this.headPath[i].x == this.lastHeadPosition.x && this.headPath[i].y == this.lastHeadPosition.y) {
                found = true;
                break;
            }
        }
        if (!found) {
            this.lastHeadPosition.setTo(this.head.x, this.head.y);
            this.onCycleComplete();
        }

        //update the eyes and the shadow below the snake
        // this.eyes.update();
        // this.shadow.update();
    }
    /**
     * 从蛇头的路径点中选出最接近段距离的下一个路径点的下标
     * @param  {Integer} currentIndex Index of the previous snake section
     * @return {Integer}              new index
     */
    findNextPointIndex(currentIndex) {
        //we are trying to find a point at approximately this distance away
        //from the point before it, where the distance is the total length of
        //all the lines connecting the two points
        var len = 0;
        var dif = len - this.preferredDistance;
        var prevDif = null;
        //this loop sums the distances between points on the path of the head
        //starting from the given index of the function and continues until
        //this sum nears the preferred distance between two snake sections
        var i = currentIndex;
        for (; i + 1 < this.headPath.length && (dif === null || dif < 0); i++) {
            //get distance between next two points
            var dist = Util.distanceFormula(
                this.headPath[i].x, this.headPath[i].y,
                this.headPath[i + 1].x, this.headPath[i + 1].y
            );
            len += dist; // 距离=折线段长度之和
            prevDif = dif;
            dif = len - this.preferredDistance;
        }
        // 至此, 到第i个节点的距离为len>=predis
        // 边界情况: currentIndex为最后一个, prevDif===null, 返回不变
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
        if (this.queuedSections > 0) {
            var entries = this.sectionGroup.children.entries;
            var lastSec = entries[entries.length - 1];
            this.addSectionAtPosition(lastSec.body.x, lastSec.body.y);
            this.queuedSections--;
        }
    }
    /**
     * Set snake scale
     * @param  {Number} scale Scale
     */
    setScale(scale) {
        this.scale = scale;
        this.preferredDistance = 17 * this.scale;

        //update edge lock location with p2 matter
        this.detectorLock.localOffsetB = [
            0, this.scene.matter.p2.pxmi(this.head.width * 0.5 + this.detectorOffset)
        ];

        //scale sections and their bodies
        for (var i = 0; i < this.sections.length; i++) {
            var sec = this.sections[i];
            sec.scale.setTo(this.scale);
            sec.body.data.shapes[0].radius = this.scene.matter.p2.pxm(sec.width * 0.5);
        }

        //scale eyes and shadows
        this.eyes.setScale(scale);
        // this.shadow.setScale(scale);
    }
    /**
     * Increment length and scale
     */
    incrementSize() {
        this.addSectionsAfterLast(1);
        this.setScale(this.scale * 1.01);
    }
    /**
     * Destroy the snake
     */
    destroy() {
        //remove constraints
        this.scene.matter.p2.removeConstraint(this.detectorLock);
        this.detector.destroy();
        //destroy food that is constrained to the snake head
        for (var i = this.food.length - 1; i >= 0; i--) {
            this.food[i].destroy();
        }
        //destroy everything else
        this.sections.forEach(function (sec, index) {
            sec.destroy();
        });
        this.eyes.destroy();
        // this.shadow.destroy();

        //call this snake's destruction callbacks
        for (var i = 0; i < this.onDestroyedCallbacks.length; i++) {
            if (typeof this.onDestroyedCallbacks[i] == "function") {
                this.onDestroyedCallbacks[i].apply(
                    this.onDestroyedContexts[i], [this]);
            }
        }
    }
    /**
     * Add callback for when snake is destroyed
     * @param  {Function} callback Callback function
     * @param  {Object}   context  context of callback
     */
    addDestroyedCallback(callback, context) {
        this.onDestroyedCallbacks.push(callback);
        this.onDestroyedContexts.push(context);
    }
}
