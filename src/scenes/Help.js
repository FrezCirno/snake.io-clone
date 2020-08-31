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
        var current = 0

        this.cameras.main.setBackgroundColor(0xffffff);

        slides.push([
            this.add.image(this.game.config.width / 2 - 100, this.game.config.height / 2, 'help_eat')
                .setOrigin(1, 0.5),
            this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Use mouse to control the snake; \nIt\'ll be bigger when eating foods', { color: '#0', fontSize: 30, fontFamily: 'halogen' })
                .setTint(0)
        ])

        slides.push([
            this.add.image(this.game.config.width / 2 - 100, this.game.config.height / 2, 'help_speedup')
                .setOrigin(1, 0.5),
            this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Click left button to speed up', { color: '#0', fontSize: 30, fontFamily: 'halogen' })
                .setTint(0)
        ])

        slides.push([
            this.add.image(this.game.config.width / 2 - 100, this.game.config.height / 2, 'help_died')
                .setOrigin(1, 0.5),
            this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'If you hit on others\' body or the wall\nThen gameover', { color: '#0', fontSize: 30, fontFamily: 'halogen' })
                .setTint(0)
        ])

        this.input.on('pointerdown', () => {
            this.sound.play('btn');
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