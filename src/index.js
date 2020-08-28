import 'phaser';
import Boot from './scenes/Boot';
import Preloader from './scenes/Preloader';
import Battle from './scenes/Battle';

const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth - 100,
  height: window.innerHeight - 100,
  // zoom: 2,
  disableContextMenu: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  plugins: [
  ],
  scene: [
    Boot,
    Preloader,
    Battle
  ],
}

window.game = new Phaser.Game(config);
