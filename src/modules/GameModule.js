import { Container, Text, BaseTexture, TilingSprite, Texture, Sprite, Rectangle, Graphics } from 'pixi.js';
import PlayerShip from '../components/PlayerShip';
import { GAME_WIDTH, GAME_HEIGHT, HERO_STEP, LIVES_NUMBERS } from '../const/const';
import { colors } from '../const/colors';
import { collisionDetection } from '../utils/collisionDetection';
import { BACKGROUND_URL, HEARTS_URL, MAIN_SPRITE_URL } from '../const/url';
import Keyboard from '../components/Keyboard';
import AliensShip from '../components/AliensShip';
import Explosion from '../components/Explosion';
import Score from '../components/Score';
import * as createjs from '@createjs/tweenjs'

class GameModule {
  constructor(app) {
    this.app = app;
    this.stage = new Container();
    this.backgroundLayer = new Container();
    this.mainLayer = new Container();
    this.player = null;
    this.bullets = [];
    this.aliens = [];
    this.aliensBullets = [];
    this.lives = [];
    this.keyboard = new Keyboard();
    this.explosionsAnimations = [];
    this.livesContainer = new Container();


    this.base = BaseTexture.from(MAIN_SPRITE_URL);
    this.base.setSize(512, 3328);
  }

  start() {
    this.addListeners();
    this.initLayers();
    this.addBackground();
    this.player = new PlayerShip();

    this.mainLayer.addChild(this.player.sprite);
    this.addEnemies();

    this.initPlayerElements();

    this.createBulletForAliens();

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  initLayers() {
    this.app.stage.addChild(this.stage);
    this.app.stage.addChild(this.backgroundLayer);
    this.app.stage.addChild(this.mainLayer);
  }

  addListeners() {
    document.body.addEventListener('keydown',(e) => this.keyboard.keyDown(e));
    document.body.addEventListener('keyup', (e) => this.keyboard.keyUp(e));
    document.body.addEventListener('keyup', (e) => this.playerFires(e));
  }

  addBackground() {
    const background = BaseTexture.from(BACKGROUND_URL);
    background.setSize(GAME_WIDTH, GAME_HEIGHT);
    this.backgroundSprite = TilingSprite.from(background, { width: GAME_WIDTH, height: GAME_HEIGHT });
    this.backgroundLayer.addChild(this.backgroundSprite);
  }

  addEnemies() {
    return setInterval(() => {
      let alien = new AliensShip();
      this.aliens.push(alien);
      this.mainLayer.addChild(alien.sprite);
    }, 1500);
  }

  createBulletForAliens() {
    setInterval(() => {
      this.aliens.forEach(alien => {
        let bullet = alien.createAlienBullet();
        this.mainLayer.addChild(bullet);
        this.aliensBullets.push(bullet);
      });
    }, 1500);
  }

  initPlayerElements() {
    this.initPlayerLives();

    this.score = new Score();
  }
  initPlayerLives() {
    const heart = BaseTexture.from(HEARTS_URL);
    heart.setSize(852, 238);
    const heartShape = new Rectangle(0, 0, 266, 230);
    const lifeTexture = new Texture(heart);
    lifeTexture.frame = heartShape;

    for (let i = 0; i < LIVES_NUMBERS; i++) {
      const life = new Sprite(lifeTexture);
      life.width = 40;
      life.height = 40;
      life.x = 10 + (life.width + 10) * i;
      life.y = 10;
      life.anchor.set(0.5)
      this.lives.push(life);
      this.livesContainer.addChild(life);
    }
    this.livesContainer.position.set(GAME_WIDTH - this.livesContainer.width, GAME_HEIGHT - this.livesContainer.height)
    this.backgroundLayer.addChild(this.livesContainer);
  }

  gameLoop() {
    this.updateBackground();
    this.updatePlayer();
    this.updateAliens();
    this.updateBullets();
    this.updateExplosions();
    this.detectCollisions();
    this.checkGameOver();
  }

  updateBackground() {
    this.backgroundSprite.tilePosition.y += 0.5;
  }

  updatePlayer() {
    if (this.player.dead) {
      return;
    }
    if (this.keyboard.isKeyDown('ArrowLeft')) {
      this.player.sprite.x -= HERO_STEP;
    }
    if (this.keyboard.isKeyDown('ArrowRight')) {
      this.player.sprite.x += HERO_STEP;
    }
    if (this.keyboard.isKeyDown('ArrowUp')) {
      this.player.sprite.y -= HERO_STEP;
    }
    if (this.keyboard.isKeyDown('ArrowDown')) {
      this.player.sprite.y += HERO_STEP;
    }

    // Обмеження руху гравця до меж сцени
    if (this.player.sprite.x <  this.player.sprite.width) {
      this.player.sprite.x =  this.player.sprite.width;
    }
    if (this.player.sprite.x > GAME_WIDTH - this.player.sprite.width) {
      this.player.sprite.x = GAME_WIDTH - this.player.sprite.width;
    }
    if (this.player.sprite.y < this.player.sprite.height) {
      this.player.sprite.y = this.player.sprite.height;
    }
    if (this.player.sprite.y > GAME_HEIGHT - this.player.sprite.height) {
      this.player.sprite.y = GAME_HEIGHT - this.player.sprite.height;
    }
  }

  updateAliens() {
    // Оновлення руху та взаємодії прибульців
    // Оновлення позиції та стану кожного прибульця
    this.aliens.forEach((alien, index) => {
      if (alien.dead || alien.passed) {
        this.mainLayer.removeChild(alien.sprite);
        this.aliens.splice(index, 1);
        this.createExplosion(alien.sprite.x, alien.sprite.y);
        alien.dead && !this.player.dead && this.score.updateScore();
        return;
      }
      // Оновлення позиції
      alien.sprite.y += 1;

      // Перевірка, чи прибулець перетнув межу сцени
      if (alien.y > GAME_HEIGHT + alien.height) {
        alien.passed = true;
      }
    });
  }

  updateBullets() {
    this.bullets.forEach((bullet, index) => {
      if (bullet.dead) {
        this.mainLayer.removeChild(bullet);
        this.bullets.splice(index, 1);
        return;
      }
      bullet.y -= 5;
      if (bullet .y < -bullet.height) {
        bullet.dead = true;
      }
    });

    this.aliensBullets.forEach((bullet, index) => {
      if (bullet.dead) {
        this.mainLayer.removeChild(bullet);
        this.aliensBullets.splice(index, 1);
        return;
      }
      bullet.y += 2;
      if (bullet.y > GAME_HEIGHT + bullet.height) {
        bullet.dead = true;
      }
    });
  }

  updateExplosions() {
    // Оновлення анімацій вибухів
    this.explosionsAnimations.forEach(animation => {
      if (!animation.playing) {
        return;
      }
      animation.update();

      if (animation.currentFrame === animation.totalFrames - 1) {
        animation.stop();
        animation.sprite.visible = false;
      }
    });
    this.explosionsAnimations = this.explosionsAnimations.filter(animation => animation.playing);
  }

  detectCollisions() {
    this.bullets.forEach(bullet => {
      this.aliens.forEach(alien => {
        if (!bullet.dead && !alien.dead && collisionDetection(bullet, alien.sprite)) {
          bullet.dead = true;
          if (alien.lives) {
            alien.lives -= 1;
          } else {
            alien.dead = true;
          }
        }
      });
    });

    this.aliensBullets.forEach(bullet => {
      if (!bullet.dead && !this.player.dead && collisionDetection(bullet, this.player.sprite)) {
        bullet.dead = true;
        this.player.lives -= 1;
        this.removeLife();

        if (!this.player.lives) {
          this.createExplosion(this.player.sprite.x, this.player.sprite.y);
          this.player.dead = true;
          this.mainLayer.removeChild(this.player.sprite);
        }
      }
    });
  }

  playerFires(e) {
    if (e.keyCode === 32 && !this.player.dead) {
      let bullet = this.player.createPlayerBullet();
      this.mainLayer.addChild(bullet);
      this.bullets.push(bullet);
    }
  };

  checkGameOver(){
    if (this.player.dead) {
      if (this.lives.length === 0) {

      } else {
        setTimeout(() => {
          this.player.dead = false;
          this.player.visible = true;
        }, 1000);
      }
    }
  }

  removeLife() {
    if (this.lives.length > 0) {
      const life = this.lives.pop();
      this.livesContainer.removeChild(life);
    }
  }

  createExplosion(x, y) {
    const explosion = new Explosion(x,y)
    this.mainLayer.addChild(explosion.explosionAnimation);
    this.explosionsAnimations.push(explosion);

    explosion.onComplete = () => {
      this.mainLayer.removeChild(explosion.explosionAnimation);
      this.explosionsAnimations.pop();
    };
  }

  endGame() {
    this.stage.removeChildren();
    this.mainLayer.removeChild(this.score.scoreText);
    this.app.ticker.remove(this.gameLoop.bind(this));

    const gameOverText = new Text(`Game Over\nYou score: ${this.score.scoreValue}`, {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: colors.white,
      align: 'center',
    });
    gameOverText.alpha = 0;
    gameOverText.x = GAME_WIDTH / 2 - gameOverText.width / 2;
    gameOverText.y = GAME_HEIGHT / 2 - gameOverText.height / 2;
    this.app.stage.addChild(gameOverText);

    const blackScreen = new Graphics();
    blackScreen.beginFill(0x000000);
    blackScreen.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    blackScreen.alpha = 0; // Initially set alpha to 0 (transparent)
    this.app.stage.addChild(blackScreen);
    Promise.resolve()
      .then(() => createjs.Tween.get(blackScreen).to({alpha: 1}, 2000))
      .then(() => createjs.Tween.get(gameOverText).to({alpha: 1}, 2000));

  }
}

export default GameModule;
