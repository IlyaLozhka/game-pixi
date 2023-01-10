import { GAME_HIEGHT, GAME_WIDTH, HERO_STEP } from '../const/const';

export const onKeyDown = (event, object) => {
  switch (event.keyCode) {
    case 37:
      if (object.position.x !== 0 + object.width) {
        object.position.x -= HERO_STEP;
      }
      break;
    case 38:
      if (object.position.y !== 0 + object.height) {
        object.position.y -= HERO_STEP;
      }
      break;
    case 39:
      if (object.position.x !== GAME_WIDTH - object.width) {
        object.position.x += HERO_STEP;
      }
      break;
    case 40:
      if (object.position.y !== GAME_HIEGHT - object.height) {
        object.position.y += HERO_STEP;
      }
      break;
  }
};