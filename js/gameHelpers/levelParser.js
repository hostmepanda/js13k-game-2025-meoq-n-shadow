import {GRAVITY_DOWN} from './utils'
import {renderLamp, renderTree, rndrTl} from './tileHelpers'
import {renderCollectibleFish} from './collectableHelpers'
import {renderCatSideView, updateSprite} from './catHelpers'
import {GAME_STATE} from '../consts'
import {createPoop, rndrRobotVac, rndrTrashCan, rndrWlkngRat, updateMonsterBehavior} from './enemiesUtils'

const pcm = {
  'Y': 'yellow', /* # = level exit */
  'A': 'blue', /* fish */
  'B': 'purple', /* B = boss */
  'C': 'black', /* C = ceiling */
  'D': 'darkred', /* D = door */
  'E': 'red', /* E = enemy */
  'F': 'darkgreen', /* F = floor */
  'L': 'yellow', /* L = lamp */
  'G': 'white', /* white cat */
  'I': 'pink', /* pink cat */
  'O': 'lightblue', /* O = window */
  'P': 'brown', /* P = poop */
  'R': 'saddlebrown', /* R = wardrobe */
  'H': 'black', /* black cat */
  'W': 'brown', /* W = wall */
  'X': 'gray', /* X = breakable wall */
  'c': 'sienna', /* c = chair */
  'Q': 'green', /* Q = flower */
  'f': 'darkgreen', // f - invisible when boss is alive
}

const blueBg = {
  bodyColor: 'rgb(150,236,255)',
  coverColor: 'rgb(115,183,197)',
}

const darkBg = {
  bodyColor: 'rgb(167,204,213)',
  coverColor: 'rgb(53,79,87)',
}


const grayBg = {
  bodyColor: 'rgb(180, 180, 180)',
  coverColor: 'rgb(142,142,142)',
  injectColor: 'rgb(101,101,101)',
}

const woodBg = {
  bodyColor: 'rgb(180, 180, 180)',
  coverColor: 'rgb(170, 120, 70)',
  injectColor: 'rgb(101,101,101)',
}

const greenBg = {
  bodyColor: 'rgb(37,37,37)',
  coverColor: 'rgb(117,115,63)',
  injectColor: 'rgb(2,174,2)',
}

const sewerBg = {
  bodyColor: 'rgb(161,161,161)',
  coverColor: 'rgb(175,175,175)',
  injectColor: 'rgb(255,255,255)',
}

const grayBg2 = {
  bodyColor: 'rgb(80,80,80)',
  coverColor: 'rgb(143,98,7)',
  injectColor: 'rgb(255,255,255)',
}

const parseToColorTilesByLevel = {
  [GAME_STATE.LEVEL1]: {
    A:{
      fishColor: 'rgb(161,161,161)',
    },
    a:{
      fishColor: 'rgb(161,161,161)',
    },
    B: {
      baseColor: "#555",
      frameColor: "#b1b1b1",
      buttonColor: "#0f0",
    },
    F: woodBg,
    f: woodBg,
    M: {
      ...grayBg,
      closingColor: 'rgb(142,142,142)',
      rotation: 1,
    },
    m: {
      ...grayBg,
      rotation: 2,
    },
    N: {
      ...grayBg,
      rotation: 1,
    },
    T: {
      bodyColor: 'rgba(251,108,55,0)',
      closingColor: 'rgb(188,128,0)',
      coverColor: 'rgb(188,128,0)',
      rotation: 2,
    },
    n: {
      bodyColor: 'rgb(180, 180, 180)',
      injectColor: 'rgb(101,101,101)',
    },
    X: {
      bodyColor: 'rgba(188,128,0,0.53)',
    },
    Y:{
      bodyColor: 'rgba(40,205,255,0.88)',
      coverColor: 'rgb(255,247,46)',
      rotation: 1,
    },
    W: grayBg,
    w: grayBg,
    O: blueBg,
    o: blueBg,
  },
  [GAME_STATE.LEVEL2]: {
    A:{
      fishColor: 'rgb(255,227,53)',
    },
    a:{
      fishColor: 'rgb(255,227,53)',
    },
    F: greenBg,
    f: greenBg,
    M: {
      bodyColor: 'rgb(128,128,128)',
      coverColor: 'rgb(62,62,62)',
      rotation: 1,
    },
    m: {
      bodyColor: 'rgb(128,128,128)',
      coverColor: 'rgb(62,62,62)',
      rotation: 3,
    },
    N: {
      bodyColor: 'rgb(128,128,128)',
      coverColor: 'rgb(62,62,62)',
      rotation: 1,
    },
    n: {
      bodyColor: 'rgb(128,128,128)',
    },
    X: {
      bodyColor: 'rgb(0,149,255)',
    },
    W: {
      bodyColor: 'rgb(128,128,128)',
      coverColor: 'rgb(62,62,62)',
      rotation: 2,
    },
    w: {
      bodyColor: 'rgb(128,128,128)',
      coverColor: 'rgb(62,62,62)',
    },
    O: {
      bodyColor: 'rgb(150,236,255)',
    },
    o: {
      bodyColor: 'rgb(150,236,255)',
    },
  },
  [GAME_STATE.LEVEL3]: {
    A:{
      fishColor: 'rgb(251,108,55)',
    },
    a:{
      fishColor: 'rgb(251,108,55)',
    },
    B: {

    },
    F: sewerBg,
    f: sewerBg,
    d: {
      potColor: 'rgb(161,161,161)',
      trunkColor: 'rgb(251,108,55)',
      foliageColor: 'rgb(255,222,0)',
    },
    M: {
      ...grayBg2,
      closingColor: 'rgb(142,142,142)',
      rotation: 1,
    },
    m: {
      ...grayBg2,
      rotation: 2,
    },
    N: {
      ...grayBg2,
      rotation: 1,
    },
    T: {
      bodyColor: 'rgba(251,108,55,0)',
      coverColor: 'rgba(147,147,147,0.49)',
      rotation: 2,
    },
    n: {
      bodyColor: 'rgb(80,80,80)',
      injectColor: 'rgb(255,255,255)',
    },
    X: {
      bodyColor: 'rgba(236,184,11,0.55)',
      injectColor: 'rgb(255,255,255)',
    },
    Y:{
      bodyColor: 'rgb(2,174,2)',
    },
    W: grayBg2,
    w: {
      ...grayBg2,
      rotation: 2,
    },
    O: darkBg,
    o: darkBg,
    Q: {
      shadeColor: '#FFD700',
      standColor: '#333',
      addGlow: true,
      rotation: 0,
    },
    q: {
      shadeColor: '#FFD700',
      // standColor: '#333',
      addGlow: true,
      rotation: 2,
    },
  },
}

export function parseLevel({ selectedLevel, gameObjects, levelMap, Sprite, tileSize = 20}) {
  const renderHandlers = {
    'B': {
      [GAME_STATE.LEVEL1]: rndrRobotVac,
      [GAME_STATE.LEVEL2]: rndrTrashCan,
      [GAME_STATE.LEVEL3]: rndrWlkngRat,
    },
  }
  levelMap.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ".") return

      let cfg = {
        x: x * tileSize,
        y: y * tileSize,
        width: tileSize,
        height: tileSize,
        color: pcm?.[ch] ?? "gray",
        type: ch,
        isVisible: !['f', 'a'].includes(ch),
        collides: ['W','M','m','N','n','w','F','C', 'Y', 'f','O','o', 'X'].includes(ch),
      };

      const defCatCfg = {
        ...cfg,
        dvl: 0,
        dt: 0,
        frame: 0,
        facingRight: true,
        framesLength: 4,
        health: 100,
        height: 32,
        isJumping: true,
        isMoving: false,
        originalHeight: 32,
        x: x * tileSize,
        y: y * tileSize,
        width: 36,
        velocityY: 0,
        originalWidth: 36,
        originalMoveSpeed: 200,
        moveSpeed: 200,
        onGround: false,
      }

      if (ch === 'I') {
        gameObjects.pink = Sprite({
          ...defCatCfg,
          sizeMultiplier: 1,
          decisionTimer: 0,
          decisionInterval: 2,
          moveSpeed: 50,
          velocityX: 50,
          onGround:true,
          isJumping: false,
          update(dt){
            updateSprite(this, dt)
            this.decisionTimer -= dt
            if (this.decisionTimer <= 0) {
              this.decisionTimer = this.decisionInterval
              this.isMoving = Math.random() <= 0.3
              this.facingRight = !this.facingRight
            }
          },
          render() {
            let pose

            if (this.isMoving) {
              pose = 'walk'
            } else {
              pose = 'idle'
            }

            renderCatSideView(
              this.context,
              {
                pose,
                flipX: !this.facingRight,
                frameIndex: this.frame,
                scale: this.sizeMultiplier + 1,
                width: this.width,
                heightShift: this.height -this.originalHeight,
                colors: [
                  'rgba(0,0,0,0)',
                  '#000000',
                  '#fafafa',
                  '#ffbbdc',
                  '#7a7a7a',
                  '#ecdcc9',
                  '#f26060',
                ]
              })
          },
        })
      }
      if (ch === 'G') {
        gameObjects.white = Sprite({
          ...defCatCfg,
          attackDamage: 0,
          jumpForce: -450,
          isPooping: false,
          maxSizeMultiplier: 2,
          originalJumpForce: -450,
          sizeMultiplier: 1,
          update(dt){
            updateSprite(this, dt)
            if (this.sizeMultiplier > 1.5) {
              this.width = 16 * (1 + this.sizeMultiplier)
              this.height = 18 * (1 + this.sizeMultiplier) + 7.75
            }
            if (this.sizeMultiplier === 1.5) {
              this.width = 16 * (1 + this.sizeMultiplier)
              this.height = 18 * (1 + this.sizeMultiplier)
            }
          },
          render() {
            let pose

            if (this.isJumping) {
              pose = 'jump'
            } else if (this.isMoving && !this.isJumping) {
              pose = 'walk'
            } else if (this.isPooping) {
              pose = 'poop'
            } else {
              pose = 'idle'
            }

            renderCatSideView(
              this.context,
              {
                pose,
                flipX: !this.facingRight,
                frameIndex: this.frame,
                scale: this.sizeMultiplier + 1,
                width: this.width,
                heightShift: this.height -this.originalHeight,
                colors: [
                  'rgba(0,0,0,0)',
                  '#000000',
                  '#ececec',
                  '#cfcfcf',
                  '#7a7a7a',
                  '#ecdcc9',
                  '#f26060',
                ]
              })
          },
        })
      }

      if (ch === 'H') {
        gameObjects.black = Sprite({
          ...defCatCfg,
          attackCooldown: 0.5, // миллисекунды (время перезарядки)
          attackCooldownTimer: 0, // текущий таймер перезарядки
          attackDamage: 10, // урон от атаки
          attackDuration: 0.03, // миллисекунды
          attackMultiplier: 1,
          attackRange: 15, // дальность атаки
          attackTimer: 0,
          canAttack: true, // флаг, может ли кот атаковать
          isAttacking: false,
          jumpForce: -550,
          maxAttackMultiplier: 3,
          originalAttackRange: 15,

          update(dt){
            updateSprite(this, dt)
          },
          render() {
            let pose

            if (this.isJumping) {
              pose = 'jump'
            } else if (this.isMoving && !this.isJumping) {
              pose = 'walk'
            } else if (this.isAttacking) {
              pose = 'attack'
            } else {
              pose = 'idle'
            }

            renderCatSideView(
              this.context,
              {
                pose,
                flipX: !this.facingRight,
                frameIndex: this.frame,
                scale: 2,
                width: this.width,
                colors: [
                  'rgba(0,0,0,0)',
                  '#000000',
                  '#a2998d',
                  '#5c5751',
                  '#413f3a',
                  '#ecdcc9',
                  '#f26060',
                  'rgba(255,255,255,1)',
                ],
              })
          },
        })
      }

        if (['W','M','m','N','n','w','F','f','O','o','X','Y','T'].includes(ch)) {
          cfg.render = function () {
            rndrTl(
              this.context,
              this.width,
              this.height,
              {
                  ...parseToColorTilesByLevel[selectedLevel][cfg.type],
              })
          }
        gameObjects.obstacles.push(Sprite(cfg));
        }

      if (['L','c','T','D','O','R','Q','d','q'].includes(ch)) {
          cfg.width = 40
          cfg.height = 40
          cfg.y = y * tileSize - tileSize + 5
        if (['q','Q'].includes(ch)) {
          cfg.render = function () {
            renderLamp(
              this.context,
              this.width,
              this.height,
              {
                ...parseToColorTilesByLevel[selectedLevel]?.[cfg.type],
              },
              )
          }
        }
        if (['d','D'].includes(ch)) {
          cfg.render = function () {
            renderTree(
              this.context,
              this.width,
              this.height,
              {
                type: ch === 'D' ? 'palm' : 'yolk',
                ...parseToColorTilesByLevel[selectedLevel]?.[cfg.type],
              })
          }
        }
        gameObjects.obstacles.push(Sprite(cfg));
      }

      if (['A', 'a'].includes(ch)) {
        cfg.collected = false
        cfg.isVisible = ch === 'A'
        cfg.color = 'rgba(0, 0, 0, 0)'
        cfg.visibilityTime = 0
        cfg.update = function (deltaTime) {
          if (this.visibilityTime <= 0) {
            this.collected = false
            this.visibilityTime = 0
          } else {
            this.visibilityTime -= deltaTime
          }
        }
        cfg.render = function () {
          renderCollectibleFish(this.context, this.width, this.height, {
            ...parseToColorTilesByLevel[selectedLevel]?.[cfg.type],
          });
        }
        gameObjects.collectables.push(Sprite(cfg));
      }

        if (ch === 'B') {
          cfg.boundaryLeft = cfg.spawnX - 12 * tileSize
          cfg.boundaryRight = cfg.spawnX + 12 * tileSize
          cfg.canDie = true
          cfg.collisionDamage = 5 // depends on level
          cfg.decisionInterval = 2 // depend on level
          cfg.decisionTimer = 0
          cfg.facingRight = false
          cfg.health = 10 // depends on level
          cfg.isAlive = true
          cfg.isDead = false
          cfg.isJumping = true
          cfg.isMonster = true
          cfg.jumpForce = -350
          cfg.lifeSpan = 15;
          cfg.maxTrashItems = 2;
          cfg.moveSpeed = 300
          cfg.onGround = true
          cfg.spawnX = x * tileSize
          cfg.spawnY = y * tileSize
          cfg.trashTimer = 0;
          cfg.trashCooldown = 10;
          cfg.velocityX = 0
          cfg.velocityY = 0
          cfg.scale = 3
          cfg.width = 36
          cfg.height = 36

          cfg.update = function(deltaTime) {
            if (!this.isAlive) return;
            this.o = gameObjects
            this.s = Sprite

            if (!this.onGround) {
              this.velocityY += GRAVITY_DOWN * deltaTime;
            }
            if (this.o.white.y <= 200 || this.o.black.y <= 200) {
              updateMonsterBehavior(this, deltaTime)
              if (this.x < this.boundaryLeft) {
                this.x = this.boundaryLeft;
                this.velocityX = this.moveSpeed; // Разворачиваемся, если достигли левой границы
                this.facingRight = true;
              } else if (this.x > this.boundaryRight) {
                this.x = this.boundaryRight;
                this.velocityX = -this.moveSpeed; // Разворачиваемся, если достигли правой границы
                this.facingRight = false;
              }
              this.x += this.velocityX * deltaTime;
              this.y += this.velocityY * deltaTime;
              this.trashTimer += deltaTime;
              if (this.trashTimer >= this.trashCooldown) {
                createPoop(this.x, this.y, this.o, this.s, this.lifeSpan) // depends on level
                this.trashTimer = 0; // сбрасываем таймер
              }
            }
          };
          const render = renderHandlers[cfg.type][selectedLevel]
          cfg.render = function() {
            render(this, {
              ...parseToColorTilesByLevel[selectedLevel]?.[cfg.type],
            })
          }
          gameObjects.enemies.push(Sprite(cfg));
        }

      if (['E'].includes(ch)) {
        createPoop(cfg.x, cfg.y, gameObjects, Sprite, -100) // depends on level
      }

      if (ch === 'P') {
        createPoop(cfg.x, cfg.y, gameObjects, Sprite, -100) // depends on level
      }
    });
  });

  return gameObjects
}
