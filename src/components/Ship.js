import { Sprite, Texture } from 'pixi.js';
import { gameModule } from '../index';

export default class Ship {
  constructor() {
  }

  initialize(shape, width, height) {
    let baseTexture = new Texture(gameModule.base);
    baseTexture.frame = shape;

    this.sprite = Sprite.from(baseTexture);
    this.sprite.anchor.set(0.5);
    this.sprite.width = width;
    this.sprite.height = height;
    this.sprite.position.x = (gameModule.app.view.width - this.sprite.width) / 2;
    this.sprite.position.y = gameModule.app.view.height - this.sprite.height;
    this.bullets = [];
    this.dead = false;
  }

  setPosition(x, y) {
    this.sprite.position.set(x, y);
  }

  createBullet(texture, bulletShape, offsetX = 0, offsetY = 0) {
    const bullet = Sprite.from(texture);
    bullet.anchor.set(0.5);
    bullet.width = bulletShape.width / 2;
    bullet.height = bulletShape.height / 2;
    bullet.position.x = this.sprite.position.x + offsetX;
    bullet.position.y = this.sprite.position.y + offsetY;
    bullet.dead = false;
    gameModule.app.stage.addChild(bullet);
    this.bullets.push(bullet);
    return bullet;
  }
}
