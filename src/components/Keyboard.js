export default class Keyboard {
  constructor() {
    this.keys = {}
  }

  isKeyDown(keyCode) {
    return this.keys[keyCode];
  }

  keyDown(e) {
    this.keys[e.code] = true;
  };
  keyUp(e) {
    this.keys[e.code] = false;
  };
}