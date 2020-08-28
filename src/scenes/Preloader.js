import 'phaser';

export default class Preloader extends Phaser.Scene {

    constructor() {
        super({ key: 'preloader' });
    }

    preload() {
        // just a preload bar in graphics
        let progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0x73c494, 1);
            progress.fillRect(0, (this.game.config.height / 2) - 30, this.game.config.width * value, 60);
        }, this);
        this.load.on('complete', () => {
            progress.destroy();
        }, this);

        // Load assets here
        // ...
        this.load.image('tiles', 'src/assets/tiles.png');
        this.load.image('gamepaused', 'src/assets/gamepaused.png');

        this.load.image('circle', 'src/assets/circle.png');
        this.load.image('shadow', 'src/assets/white-shadow.png');
        this.load.image('background', 'src/assets/tile.png');

        this.load.image('eye-white', 'src/assets/eye-white.png');
        this.load.image('eye-black', 'src/assets/eye-black.png');

        this.load.image('food', 'src/assets/hex.png');

        // sprites, note: see free sprite atlas creation tool here https://www.leshylabs.com/apps/sstool/
        this.load.atlas('sprites', 'src/assets/spritearray.png', 'src/assets/spritearray.json');

        // font
        this.load.bitmapFont('fontwhite', 'src/assets/fontwhite.png', 'src/assets/fontwhite.xml');

        // audio
        this.load.audio('coin', ['src/assets/coin.mp3', 'src/assets/coin.ogg']);
        this.load.audio('bomb', ['src/assets/expl.mp3', 'src/assets/expl.ogg']);
        this.load.audio('btn', ['src/assets/btn.mp3', 'src/assets/btn.ogg']);
    }

    create() {
        this.anims.create({
            key: 'cointurn',
            frames: [
                { key: 'sprites', frame: 'coin1' },
                { key: 'sprites', frame: 'coin2' },
                { key: 'sprites', frame: 'coin3' },
                { key: 'sprites', frame: 'coin4' },
                { key: 'sprites', frame: 'coin5' },
                { key: 'sprites', frame: 'coin6' },
                { key: 'sprites', frame: 'coin7' },
                { key: 'sprites', frame: 'coin8' }
            ],
            frameRate: 15,
            repeat: -1
        });

        this.scene.start('battle');
    }
}

