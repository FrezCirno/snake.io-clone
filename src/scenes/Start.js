import 'phaser';


export default class Start extends Phaser.Scene {

    constructor() {
        super({ key: 'start' });
    }

    create() {
        // this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'demo')
        //     .setAlpha(0.7)

        this.add.image(this.game.config.width / 2, this.game.config.height / 2 - 150, "logo")

        this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 50, "Start", { color: 0xffffff, fontSize: 18 })
            .setInteractive()
            .on('pointerdown', () => this.scene.sleep().sendToBack().pause('battle').resume('battle'))

        this.add.text(this.game.config.width / 2, this.game.config.height / 2, "Help", { color: 0xffffff, fontSize: 18 })
            .setInteractive()
            .on('pointerdown', () => this.scene.sleep().run('help'))

        // this.cameras.main.setBackgroundColor(0xffffff);
        this.scene.launch('battle')
            .sendToBack('battle')
    }
}