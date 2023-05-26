import { Text } from 'pixi.js';
import { colors } from '../const/colors';
import { GAME_HEIGHT, GAME_WIDTH } from '../const/const';
import { gameModule } from '../index';

export default class Score {
  constructor() {
    this.scoreText = '';
    this.scoreValue = 0;

    this.init();
  }
  init() {
    this.scoreText = new Text(`SCORE: ${this.scoreValue}`, {
      fontFamily: 'Arial',
      fontSize: 30,
      fill: colors.white,
      align: 'center',
    });
    // this.scoreText.anchor.set(0.5)
    this.scoreText.x = 50;
    this.scoreText.y = GAME_HEIGHT  - this.scoreText.height;

    gameModule.mainLayer.addChild(this.scoreText);
  }

  updateScore() {
    this.scoreText.text = `SCORE: ${this.scoreValue += 1}`;
  }
}