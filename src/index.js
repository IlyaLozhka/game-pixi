import { Application, Sprite } from 'pixi.js';
import { GAME_HIEGHT, GAME_WIDTH } from './const/const';
import { colors } from './const/colors';
import { GHOST_URL } from './const/url';

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

app.stage.addChild(hero);
