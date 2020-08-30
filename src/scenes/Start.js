import 'phaser';


export default class Start extends Phaser.Scene {

    constructor() {
        super({ key: 'start' });
    }

    create() {
        // this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'demo')


        this.add.image(this.game.config.width / 2, this.game.config.height / 2 - 150, "logo")

        this.add.text(this.game.config.width / 2, this.game.config.height / 2, "Start", { color: 0xffffff, fontSize: 18 })
            .setInteractive()
            .on('pointerdown', () => this.scene.sleep().sendToBack().pause('battle').resume('battle'))

        this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 50, "Help", { color: 0xffffff, fontSize: 18 })
            .setInteractive()
            .on('pointerdown', () => this.scene.sleep().run('help'))

        this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 100, "Exit", { color: 0xffffff, fontSize: 18 })
            .setInteractive()
            .on('pointerdown', () => 0)

        // this.cameras.main.setBackgroundColor(0xffffff);
        this.scene.launch('battle')
            .sendToBack('battle')
    }
}