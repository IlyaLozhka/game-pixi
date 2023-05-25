import { AnimatedSprite, BaseTexture, Spritesheet } from 'pixi.js';
import { explosionAtlas } from '../const/explosionAtlas';

const spriteSheet = new Spritesheet(BaseTexture.from(explosionAtlas.meta.image), explosionAtlas);
spriteSheet.parse().then((data) => console.log('loaded spriteSheet!', data));

export default class Explosion {
  constructor(x, y) {
    this.explosionAnimation = new AnimatedSprite(spriteSheet.animations.explosion);
    this.explosionAnimation.animationSpeed = 0.1666;
    this.explosionAnimation.anchor.set(0.5);
    this.explosionAnimation.position.set(x, y);
    this.explosionAnimation.loop = false;
    this.explosionAnimation.play();
  }
}