import 'phaser';
import Battle from './battle';

window.maxSize = 960;
let longestSide = Math.max(window.innerWidth, window.innerHeight);
let zoom = 2 * Math.max(1, Math.floor(longestSide / window.maxSize));

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  width: window.innerWidth / zoom,
  height: window.innerHeight / zoom,
  zoom: zoom,
  scene: [Battle],
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: 0
    },
    matter: {
      debug: true,
      gravity: 0
    }
  }
});
