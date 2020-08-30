import 'phaser';
// import logo from '../assets/logo.png';
import tile from '../assets/tile.png';
import circle from '../assets/circle.png';
import shadow from '../assets/white-shadow.png';
import hex from '../assets/hex.png';
import eye_white from '../assets/eye-white.png';
import eye_black from '../assets/eye-black.png';
// import tiles from '../assets/tiles.png';
// import gamepaused from '../assets/gamepaused.png';
import eat from '../assets/eat.mp3';
import btn from '../assets/btn.mp3';
import death from '../assets/death.ogg';
import hover from '../assets/UI_SFX_Set/click5.wav';
import help_eat from '../assets/help_eat.png';
import help_died from '../assets/help_died.png';
import help_speedup from '../assets/help_speedup.png';


export default class Preloader extends Phaser.Scene {

    constructor() { super({ key: 'preloader' }) }

    preload() {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        var progressBar = this.add.graphics()
        var progressBox = this.add.graphics()
            .fillStyle(0x222222, 0.8)
            .fillRect(width / 2 - 160, height / 2 - 30, 320, 50)

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px halogen',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px halogen',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        this.load
            .on('progress', (value) => {
                percentText.setText(parseInt(value * 100) + '%');
                progressBar.clear();
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
            })
            .on('complete', () => {
                progressBar.destroy();
                progressBox.destroy();
                loadingText.destroy();
                percentText.destroy();
            })

        this.load.image('background', tile);
        this.load.image('circle', circle);
        this.load.image('shadow', shadow);
        this.load.image('food', hex);
        this.load.image('eye-white', eye_white);
        this.load.image('eye-black', eye_black);
        this.load.image('help_eat', help_eat);
        this.load.image('help_died', help_died);
        this.load.image('help_speedup', help_speedup);

        // audio
        this.load.audio('eat', eat);
        this.load.audio('btn', btn);
        this.load.audio('hover', hover);
        this.load.audio('death', death);
    }

    create() {
        this.scene.start('start');
    }
}

