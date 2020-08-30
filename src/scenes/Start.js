import 'phaser';


export default class Start extends Phaser.Scene {

    constructor() {
        super({ key: 'start' });
    }

    create() {
        // this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'demo')

        // this.add.image(this.game.config.width / 2, this.game.config.height / 2 - 150, "logo")

        var logo = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 150, "Snake.io", {
            color: '#0',
            fontFamily: 'halogen',
            fontSize: 100
        })
            .setOrigin(0.5)

        var start = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 80, "Start", { color: '#0', fontSize: 30, fontFamily: 'halogen' })
            .setInteractive()
            .setOrigin(0.5)
            .on('pointerover', () => { start.setColor('#ff0000'); this.sound.play('hover'); })
            .on('pointerout', () => start.setColor('#0'))
            .on('pointerdown', () => { this.sound.play('btn'); this.scene.sleep().sendToBack().pause('battle').resume('battle'); })


        var help = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 160, "Help", { color: '#0', fontSize: 30, fontFamily: 'halogen' })
            .setInteractive()
            .setOrigin(0.5)
            .on('pointerover', () => { help.setColor('#ff0000'); this.sound.play('hover'); })
            .on('pointerout', () => help.setColor('#0'))
            .on('pointerdown', () => { this.sound.play('btn'); this.scene.sleep().run('help'); })

        var exit = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 240, "Exit", { color: '#0', fontSize: 30, fontFamily: 'halogen' })
            .setInteractive()
            .setOrigin(0.5)
            .on('pointerover', () => { exit.setColor('#ff0000'); this.sound.play('hover'); })
            .on('pointerout', () => exit.setColor('#0'))
            .on('pointerdown', () => 0)

        var watch = this.add.text(0, 0, 'Watch mode', { color: '#0', fontSize: 20, fontFamily: 'halogen' })

        // this.cameras.main.setBackgroundColor(#ffffff);
        this.scene.launch('battle')
            .sendToBack('battle')
    }
}