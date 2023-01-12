import { Application, Sprite, Texture, Rectangle, BaseTexture } from 'pixi.js';
import { GAME_HIEGHT, GAME_WIDTH, HERO_STEP } from './const/const';
import { colors } from './const/colors';
import { MAIN_SPRITE_URL } from './const/url';

const keys = {};
const bullets = [];

const app = new Application({
  width: GAME_WIDTH,
  height: GAME_HIEGHT,
  backgroundColor: colors.main,
});

document.getElementById('root').appendChild(app.view);

const base = BaseTexture.from(MAIN_SPRITE_URL);// x start 328 y start 168 x end 440 y end 220  112/52
base.setSize(512,3328);

const playerTexture = new Texture(base);
const shipsShape = new Rectangle(64, 63, 130, 130)
playerTexture.frame = shipsShape;

const bulletTexture = new Texture(base);
const bulletShape = new Rectangle(328, 167, 112, 53)
bulletTexture.frame = bulletShape;

const playerShip = Sprite.from(playerTexture);
playerShip.width = shipsShape.width / 2;
playerShip.height = shipsShape.height / 2;
playerShip.anchor.set(0.5);

playerShip.x = (app.view.width - playerShip.width) / 2;
playerShip.y = app.view.height - playerShip.height;

app.stage.addChild(playerShip);

const keyDown = (e) => {
  keys[e.keyCode] = true;
};
const keyUp = (e) => {
  keys[e.keyCode] = false;
};
const fireBullet = (e) => {
  if (e.keyCode === 32) {
    let bullet = createBullet();
    bullets.push(bullet);
  }
};

document.body.addEventListener('keydown', keyDown);
document.body.addEventListener('keyup', keyUp);
document.body.addEventListener('keyup', fireBullet);


const gameLoop = (object) => {
  if (keys['37'] && object.position.x !== object.width) {
    object.position.x -= HERO_STEP;
  }
  if (keys['39'] && object.position.x !== GAME_WIDTH - object.width) {
    object.position.x += HERO_STEP;
  }
  updateBullets();
};

const createBullet = () => {
  let bullet = Sprite.from(bulletTexture);
  bullet.anchor.set(0.5);
  bullet.width = bulletShape.width / 2;
  bullet.height = bulletShape.height / 2;
  bullet.position.x = playerShip.position.x;
  bullet.position.y = playerShip.position.y;
  bullet.dead = false;
  app.stage.addChild(bullet);
  return bullet;
};

const updateBullets = () => {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].position.y -= 10;
    if (bullets[i].position.y < -500) {
      bullets[i].dead = true;
    }

    if (bullets[i].dead) {
      app.stage.removeChild(bullets[i]);
      bullets.splice(i, 1);
    }

  }
};

app.ticker.add(() => gameLoop(playerShip));