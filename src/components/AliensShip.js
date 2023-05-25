import Ship from './Ship';
import { Rectangle, Sprite, Texture } from 'pixi.js';
import { randomPosition } from '../utils/randomPosition';
import { ALIENS_LIVES_NUMBERS, GAME_WIDTH } from '../const/const';
import { gameModule } from '../index';

export default class AliensShip extends Ship {
  constructor() {
    super();
    const shape = new Rectangle(28, 2108, 200, 136);
    const width =  shape.width / 2;
    const height = shape.height / 2;

    this.lives = ALIENS_LIVES_NUMBERS;

    this.initialize(shape, width, height);
    this.setPosition(randomPosition(width, GAME_WIDTH - width), -100);
  }

  createAlienBullet() {
    const alienBulletTexture = new Texture(gameModule.base);
    const alienBulletShape = new Rectangle(324, 2228, 120, 64);
    alienBulletTexture.frame = alienBulletShape;

    let alienBullet = Sprite.from(alienBulletTexture);
    alienBullet.anchor.set(0.5);
    alienBullet.width = alienBulletShape.width / 2;
    alienBullet.height = alienBulletShape.height / 2;
    alienBullet.position.x = this.sprite.position.x;
    alienBullet.position.y = this.sprite.position.y;
    alienBullet.scale.y *= -1;
    alienBullet.dead = false;
    return alienBullet;
  }
}