import 'phaser';
import logo from '../assets/logo.png';
import tile from '../assets/tile.png';
import circle from '../assets/circle.png';
import shadow from '../assets/white-shadow.png';
import hex from '../assets/hex.png';
import eye_white from '../assets/eye-white.png';
import eye_black from '../assets/eye-black.png';
import tiles from '../assets/tiles.png';
import gamepaused from '../assets/gamepaused.png';
import spritearray from '../assets/spritearray.png';
import spritearrayjson from '../assets/spritearray.json';
import fontwhite from '../assets/fontwhite.png';
import fontwhitexml from '../assets/fontwhite.xml';
import coinmp3 from '../assets/coin.mp3';
import coinogg from '../assets/coin.ogg';
import btnmp3 from '../assets/btn.mp3';
import btnogg from '../assets/btn.ogg';
import demo from '../assets/demo.png';
import help_eat from '../assets/help_eat.png';
import help_died from '../assets/help_died.png';
import help_speedup from '../assets/help_speedup.png';


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

        // Load ../assets here
        // ...
        this.load.image('logo', logo);
        this.load.image('demo', demo);
        this.load.image('background', tile);
        this.load.image('circle', circle);
        this.load.image('shadow', shadow);
        this.load.image('food', hex);
        this.load.image('eye-white', eye_white);
        this.load.image('eye-black', eye_black);

        this.load.image('tiles', tiles);
        this.load.image('gamepaused', gamepaused);
        this.load.image('help_eat', help_eat);
        this.load.image('help_died', help_died);
        this.load.image('help_speedup', help_speedup);

        // sprites, note: see free sprite atlas creation tool here https://www.leshylabs.com/apps/sstool/
        this.load.atlas('sprites', spritearray, spritearrayjson);

        // font
        this.load.bitmapFont('fontwhite', fontwhite, fontwhitexml);

        // audio
        this.load.audio('coin', [coinmp3, coinogg]);
        this.load.audio('btn', [btnmp3, btnogg]);
    }

    create() {
        this.anims.create({
            key: 'pikapika',
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

        this.scene.start('start');
    }
}

