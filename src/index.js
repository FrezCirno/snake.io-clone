import 'phaser';
import Preloader from './scenes/Preloader';
import Battle from './scenes/Battle';
import Start from './scenes/Start';
import Help from './scenes/Help';

var config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  // zoom: 2,
  disableContextMenu: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  plugins: {
  },
  scene: [
    Preloader,
    Start,
    Help,
    Battle,
  ]
}

window.game = new Phaser.Game(config);
