import { Application, Sprite, Texture, Rectangle, BaseTexture, TilingSprite } from 'pixi.js';
import { GAME_HIEGHT, GAME_WIDTH, HERO_STEP } from './const/const';
import { colors } from './const/colors';
import { BACKGROUND_URL, MAIN_SPRITE_URL } from './const/url';
import { randomPosition } from './utils/randomPosition';
import { collisionDetection } from './utils/collisionDetection';

const keys = {};
const bullets = [];
const aliens = [];
const aliensBullets = [];

const app = new Application({
  width: GAME_WIDTH,
  height: GAME_HIEGHT,
  backgroundColor: colors.main,
});

document.getElementById('root').appendChild(app.view);

const base = BaseTexture.from(MAIN_SPRITE_URL);// x start 328 y start 168 x end 440 y end 220  112/52
base.setSize(512, 3328);

const background = BaseTexture.from(BACKGROUND_URL);
background.setSize(GAME_WIDTH, GAME_HIEGHT);
const backgroundSprite = TilingSprite.from(background, { width: GAME_WIDTH, height: GAME_HIEGHT });
app.stage.addChild(backgroundSprite);

const playerTexture = new Texture(base);
const shipsShape = new Rectangle(64, 63, 130, 130);
playerTexture.frame = shipsShape;

const playerBulletTexture = new Texture(base);
const playerBulletShape = new Rectangle(328, 167, 112, 53);
playerBulletTexture.frame = playerBulletShape;

const aliensBulletTexture = new Texture(base);
const aliensBulletShape = new Rectangle(324, 2228, 120, 64);
aliensBulletTexture.frame = aliensBulletShape;

const aliensTexture = new Texture(base);
const aliensShipShape = new Rectangle(28, 2108, 200, 136);
aliensTexture.frame = aliensShipShape;

const playerShip = Sprite.from(playerTexture);
playerShip.width = shipsShape.width / 2;
playerShip.height = shipsShape.height / 2;
playerShip.anchor.set(0.5);

playerShip.x = (app.view.width - playerShip.width) / 2;
playerShip.y = app.view.height - playerShip.height;

app.stage.addChild(playerShip);

const createAliens = () => {
  const aliensShip = Sprite.from(aliensTexture);
  aliensShip.width = aliensShipShape.width / 2;
  aliensShip.height = aliensShipShape.height / 2;
  aliensShip.anchor.set(0.5);
  aliensShip.y = -100;
  aliensShip.x = randomPosition(aliensShip.width, GAME_WIDTH - aliensShip.width);
  aliensShip.scale.y *= -1;
  aliensShip.dead = false;
  app.stage.addChild(aliensShip);
  return aliensShip;
};

setInterval(() => {
  let alien = createAliens();
  aliens.push(alien);
}, 2000);

setInterval(() => {
  for (let i = 0; i < aliens.length; i++) {
    let bullet = createAliensBullet(aliens[i]);
    aliensBullets.push(bullet);
  }
}, 2000);


const keyDown = (e) => {
  keys[e.keyCode] = true;
};
const keyUp = (e) => {
  keys[e.keyCode] = false;
};

const playerFires = (e) => {
  if (e.keyCode === 32) {
    let bullet = createPlayerBullet();
    bullets.push(bullet);
  }
};

document.body.addEventListener('keydown', keyDown);
document.body.addEventListener('keyup', keyUp);
document.body.addEventListener('keyup', playerFires);


const gameLoop = (object) => {
  if (keys['37'] && object.position.x > object.width) {
    object.position.x -= HERO_STEP;
  }
  if (keys['39'] && (object.position.x < GAME_WIDTH - object.width)) {

    object.position.x += HERO_STEP;
  }
  updatePlayerBullets();
  updateBackground();
  updateAliensShips();
  updateAliensBullets();
};

const createAliensBullet = (aliensShip) => {
  let alienBullet = Sprite.from(aliensBulletTexture);
  alienBullet.anchor.set(0.5);
  alienBullet.width = aliensBulletShape.width / 2;
  alienBullet.height = aliensBulletShape.height / 2;
  alienBullet.position.x = aliensShip.position.x;
  alienBullet.position.y = aliensShip.position.y;
  alienBullet.scale.y *= -1;
  alienBullet.dead = false;
  app.stage.addChild(alienBullet);
  return alienBullet;
};

const createPlayerBullet = () => {
  let bullet = Sprite.from(playerBulletTexture);
  bullet.anchor.set(0.5);
  bullet.width = playerBulletShape.width / 2;
  bullet.height = playerBulletShape.height / 2;
  bullet.position.x = playerShip.position.x;
  bullet.position.y = playerShip.position.y;
  bullet.dead = false;
  app.stage.addChild(bullet);
  return bullet;
};

const updatePlayerBullets = () => {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].position.y -= 10;
    if (bullets[i].position.y < -500) {
      bullets[i].dead = true;
    }

    if (bullets[i].dead) {
      app.stage.removeChild(bullets[i]);
      bullets.splice(i, 1);
    }

    if (aliens.length !== 0 && bullets.length !== 0) {
      for (let k = 0; k < aliens.length; k++) {
        if (collisionDetection(bullets[i], aliens[k])) {
          app.stage.removeChild(bullets[i]);
          bullets.splice(i, 1);
          break;
        }
      }
    }

  }
};

const updateAliensBullets = () => {
  for (let i = 0; i < aliensBullets.length; i++) {
    aliensBullets[i].position.y += 5;
    if (aliensBullets[i].position.y > GAME_HIEGHT + (aliensBulletShape.height / 2)) {
      aliensBullets[i].dead = true;
    }

    if (aliensBullets[i].dead) {
      app.stage.removeChild(aliensBullets[i]);
      aliensBullets.splice(i, 1);
    }
    if (collisionDetection(playerShip, aliensBullets[i])) {
      app.stage.removeChild(aliensBullets[i]);
      aliensBullets.splice(i, 1);
    }
  }
};

const updateAliensShips = () => {
  for (let i = 0; i < aliens.length; i++) {
    aliens[i].position.y += 2;
    if (aliens[i].position.y > GAME_HIEGHT + aliensShipShape.height / 2) {
      aliens[i].dead = true;
    }
    if (aliens[i].dead) {
      app.stage.removeChild(aliens[i]);
      aliens.splice(i, 1);
    }
  }
};

const updateBackground = () => {
  backgroundSprite.tilePosition.y += 1;
};

app.ticker.add(() => gameLoop(playerShip));