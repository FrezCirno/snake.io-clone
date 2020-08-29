import 'phaser';

export default class Help extends Phaser.Scene {

    constructor() {
        super({
            key: 'help',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        });
    }

    create() {
        var slides = []
        var objset = []
        var current = 0

        this.cameras.main.setBackgroundColor(0xffffff);

        slides.push([
            this.add.image(this.game.config.width / 2 - 100, this.game.config.height / 2, 'help_eat').setOrigin(1, 0.5),
            this.add.bitmapText(this.game.config.width / 2, this.game.config.height / 2, 'fontwhite', 'Use your mouse to control the snake; \nIt\'ll be bigger when eating foods').setTint(0)
        ])

        slides.push([
            this.add.image(this.game.config.width / 2 - 100, this.game.config.height / 2, 'help_speedup').setOrigin(1, 0.5),
            this.add.bitmapText(this.game.config.width / 2, this.game.config.height / 2, 'fontwhite', 'Click left button to speed up').setTint(0)
        ])

        slides.push([
            this.add.image(this.game.config.width / 2 - 100, this.game.config.height / 2, 'help_died').setOrigin(1, 0.5),
            this.add.bitmapText(this.game.config.width / 2, this.game.config.height / 2, 'fontwhite', 'If you stuck to others\' body;\nThen gameover').setTint(0)
        ])

        this.input.on('pointerdown', () => {
            slides[current].forEach(obj => obj.alpha = 0)
            if (++current >= slides.length) {
                current = 0
                this.scene.sleep().run('start')
            }
            slides[current].forEach(obj => obj.alpha = 1)
        });

        slides.forEach(slide => slide.forEach(obj => obj.alpha = 0))
        slides[current].forEach(obj => obj.alpha = 1)
    }
}