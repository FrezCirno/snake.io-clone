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
    }
    
    create ()
    {
        this.scene.start('battle');
    }
}

