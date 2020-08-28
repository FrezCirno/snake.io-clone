import 'phaser';
import Boot from './scenes/Boot';
import Preloader from './scenes/Preloader';
import Battle from './scenes/Battle';

var config = {
  // type: Phaser.AUTO,
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  // backgroundColor: '#006060',
  // width: window.innerWidth - 100,
  // height: window.innerHeight - 100,
  // zoom: 2,
  // disableContextMenu: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true
    }
  },
  // scale: {
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH
  // },
  scene: [
    Preloader,
    Battle
  ]
}

window.game = new Phaser.Game(config);
