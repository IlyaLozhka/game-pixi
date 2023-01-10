import { GAME_HIEGHT, GAME_WIDTH, HERO_STEP } from '../const/const';
const keys = {};

export const keyDown = (e) => {
  keys[e.keyCode] = true;
  console.log(keys)
}
export const keyUp = (e) => {
  keys[e.keyCode] = false;
  console.log(keys)
}

export const gameLoop = (object) => {
  if (keys['37'] && object.position.x !== object.width) {
    object.position.x -= HERO_STEP;
  }
  if (keys['38'] && object.position.y !== object.height) {
    object.position.y -= HERO_STEP;
  }
  if (keys['39'] && object.position.x !== GAME_WIDTH - object.width) {
    object.position.x += HERO_STEP;
  }
  if (keys['40'] && object.position.y !== GAME_HIEGHT - object.height) {
    object.position.y += HERO_STEP;
  }
};