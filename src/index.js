import { Application } from 'pixi.js';
import { GAME_HIEGHT, GAME_WIDTH } from './const/const';
import { colors } from './const/colors';

const app = new Application({
  width: GAME_WIDTH,
  height: GAME_HIEGHT,
  backgroundColor: colors.main,
});

document.getElementById('root').appendChild(app.view);

