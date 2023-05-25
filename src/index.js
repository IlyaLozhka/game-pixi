import {
  Application,
} from '@pixi/app';
import { GAME_HEIGHT, GAME_WIDTH } from './const/const';
import { colors } from './const/colors';
import GameModule from './modules/GameModule';

const app = new Application({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: colors.main,
});
document.getElementById('root').innerHTML = '';

document.getElementById('root').appendChild(app.view);

globalThis.__PIXI_APP__ = app;

export const gameModule = new GameModule(app);
gameModule.start();