import Ship from './Ship';
import { Rectangle, Sprite, Texture } from 'pixi.js';
import { gameModule } from '../index';
import { LIVES_NUMBERS } from '../const/const';


export default class PlayerShip extends Ship {
  constructor() {
    super();
    const shape = new Rectangle(64, 63, 130, 130);
    const width =  shape.width / 2;
    const height = shape.height / 2;
    this.lives = LIVES_NUMBERS;

    this.initialize(shape, width, height);
    this.setPosition(100, 200);
  }

  createPlayerBullet() {
    const playerBulletTexture = new Texture(gameModule.base);
    const playerBulletShape = new Rectangle(328, 167, 112, 53);
    playerBulletTexture.frame = playerBulletShape;

    let bullet = Sprite.from(playerBulletTexture);
    bullet.anchor.set(0.5);
    bullet.width = playerBulletShape.width / 2;
    bullet.height = playerBulletShape.height / 2;
    bullet.position.x = this.sprite.position.x;
    bullet.position.y = this.sprite.position.y;
    bullet.dead = false;
    return bullet;
  }
}