import { Application, Graphics, Sprite } from 'pixi.js';
import { GAME_HIEGHT, GAME_WIDTH, HERO_STEP } from './const/const';
import { colors } from './const/colors';
import { GHOST_URL } from './const/url';

const keys = {};
const bullets = [];

const app = new Application({
  width: GAME_WIDTH,
  height: GAME_HIEGHT,
  backgroundColor: colors.main,
});

document.getElementById('root').appendChild(app.view);

const hero = Sprite.from(GHOST_URL);
hero.width = 50;
hero.height = 50;
hero.anchor.set(0.5);
hero.x = app.view.width - hero.width;
hero.y = app.view.height - hero.height;
console.log(hero.scale);

app.stage.addChild(hero);

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
  let bullet = new Graphics();
  bullet.beginFill(0xDE3249);
  bullet.drawRect(hero.x - 10, hero.y, 10, 10);
  bullet.endFill();
  bullet.dead = false;
  app.stage.addChild(bullet);
  console.log(bullet.position)
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


app.ticker.add(() => gameLoop(hero));