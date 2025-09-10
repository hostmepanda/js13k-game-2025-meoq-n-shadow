import {GRAVITY_DOWN} from './utils'
import {renderLamp, renderPalmTree, renderPottedTree, renderTable, renderWoodConcreteFloor} from './tileHelpers'
import {renderCollectibleFish} from './collectableHelpers'
import {renderCatSideView} from './catHelpers'
import {GAME_STATE} from '../consts'

const parseToColorMapper = {
  '#': 'yellow', /* # = level exit */
  'A': 'blue', /* fish */
  'B': 'purple', /* B = boss */
  'C': 'black', /* C = ceiling */
  'D': 'darkred', /* D = door */
  'E': 'red', /* E = enemy */
  'F': 'darkgreen', /* F = floor */
  'L': 'yellow', /* L = lamp */
  '2': 'white', /* white cat */
  'O': 'lightblue', /* O = window */
  'P': 'brown', /* P = poop */
  'R': 'saddlebrown', /* R = wardrobe */
  '1': 'black', /* black cat */
  'T': 'peru', /* T = table */
  'W': 'brown', /* W = wall */
  'X': 'gray', /* X = breakable wall */
  'c': 'sienna', /* c = chair */
  'Q': 'green', /* Q = flower */
  'f': 'darkgreen', // f - invisible when boss is alive
}

const parseToColorTilesByLevel = {
  [GAME_STATE.LEVEL1]: {
    F: {
      bodyColor: 'rgb(180, 180, 180)',
      coverColor: 'rgb(170, 120, 70)',
      injectColor: 'rgb(101,101,101)',
    },
    f: {
      bodyColor: 'rgb(180, 180, 180)',
      coverColor: 'rgb(170, 120, 70)',
      injectColor: 'rgb(101,101,101)',
    },
    M: {
      bodyColor: 'rgb(180, 180, 180)',
      coverColor: 'rgb(142,142,142)',
      injectColor: 'rgb(101,101,101)',
      closingColor: 'rgb(142,142,142)',
      rotation: 1,
    },
    m: {
      bodyColor: 'rgb(180, 180, 180)',
      coverColor: 'rgb(142,142,142)',
      injectColor: 'rgb(101,101,101)',
      rotation: 2,
    },
    N: {
      bodyColor: 'rgb(180, 180, 180)',
      coverColor: 'rgb(142,142,142)',
      injectColor: 'rgb(101,101,101)',
      rotation: 1,
    },
    n: {
      bodyColor: 'rgb(180, 180, 180)',
      injectColor: 'rgb(101,101,101)',
    },
    W: {
      bodyColor: 'rgb(180, 180, 180)',
      coverColor: 'rgb(142,142,142)',
      injectColor: 'rgb(101,101,101)',
    },
    w: {
      bodyColor: 'rgb(180, 180, 180)',
      coverColor: 'rgb(142,142,142)',
      injectColor: 'rgb(101,101,101)',
    },
    O: {
      bodyColor: 'rgb(150,236,255)',
      coverColor: 'rgb(115,183,197)',
    },
    o: {
      bodyColor: 'rgb(150,236,255)',
      coverColor: 'rgb(115,183,197)',
    },
  },
  [GAME_STATE.LEVEL2]: {
    F: {
      bodyColor: 'rgb(37,37,37)',
      coverColor: 'rgb(117,115,63)',
      injectColor: 'rgb(2,174,2)',
    },
    f: {
      bodyColor: 'rgb(37,37,37)',
      coverColor: 'rgb(117,115,63)',
      injectColor: 'rgb(2,174,2)',
    },
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
      bodyColor: 'rgba(39,150,230,0.51)',
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
}

export function parseLevel({ selectedLevel, gameObjects, levelMap, Sprite, tileSize = 20}) {
  levelMap.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ".") {
        return
      }

      let cfg = {
        x: x * tileSize,
        y: y * tileSize,
        width: tileSize,
        height: tileSize,
        color: parseToColorMapper?.[ch] ?? "gray",
        type: ch,
        isVisible: true,
      };

      if (ch === 'G') {
        gameObjects.white = Sprite({
          x: x * tileSize,
          y: y * tileSize,
          width: 40,
          height: 31,
          color: 'white',
          // Добавляем физические свойства
          velocityY: 0,
          isJumping: true,
          jumpForce: -450, // Отрицательное значение, т.к. ось Y направлена вниз
          moveSpeed: 200,
          onGround: false,
          alpha: 1.0, // для прозрачности
          originalJumpForce: -450,
          originalMoveSpeed: 200,
          originalWidth: 40,
          originalHeight: 31,
          sizeMultiplier: 1,
          maxSizeMultiplier: 2,
          facingRight: true,
          isMoving: false,
          attackDamage: 10, // урон от атаки
          health: 100,
          damageInvulnerabilityLeft: 0,
          frame: 0,
          framesLength: 4,
          dt: 0,
          update(dt) {
            this.dt += dt;
            if (this.dt > 0.07) {   // каждые 0.3 сек смена кадра
              this.frame = (this.frame + 1) % this.framesLength;
              this.dt = 0;
            }
            this.damageInvulnerabilityLeft = Math.max(0, this.damageInvulnerabilityLeft - this.dt);
          },
          render() {
            const isJumping = this.isJumping
            const isWalking = this.isMoving && !isJumping
            const isPooping = this.isPooping
            let pose

            if (isJumping) {
              pose = 'jump'
            } else if (isWalking) {
              pose = 'walk'
            } else if (isPooping) {
              pose = 'attack'
            } else {
              pose = 'idle'
            }

            renderCatSideView(this.context,
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
          x: x * tileSize,
          y: y * tileSize,
          width: 40,
          height: 31,
          color: 'rgba(0,0,0,0)',
          // Добавляем физические свойства
          velocityY: 0,
          isJumping: true,
          jumpForce: -550, // Отрицательное значение, т.к. ось Y направлена вниз
          onGround: false,
          alpha: 1.0, // для прозрачности
          moveSpeed: 200,
          originalWidth: 40,
          originalHeight: 40,
          originalAttackRange: 15,
          maxAttackMultiplier: 3,
          attackMultiplier: 1,
          // Добавляем свойства для атаки
          isAttacking: false,
          attackDuration: 0.03, // миллисекунды
          attackTimer: 0,
          attackRange: 15, // дальность атаки
          attackDamage: 10, // урон от атаки
          facingRight: true,
          // Свойства для cooldown
          attackCooldown: 0.5, // миллисекунды (время перезарядки)
          attackCooldownTimer: 0, // текущий таймер перезарядки
          canAttack: true, // флаг, может ли кот атаковать
          isMoving: false,
          health: 100,
          damageInvulnerabilityLeft: 0,
          frame: 0,
          framesLength: 4,
          dt: 0,
          update(dt) {
            this.dt += dt
            if (this.isAttacking) {
              if (this.dt > 0.07) {   // каждые 0.3 сек смена кадра
                this.frame = (this.frame + 1) % 10
                this.dt = 0
              }
            } else {
              if (this.dt > 0.07) {   // каждые 0.3 сек смена кадра
                this.frame = (this.frame + 1) % this.framesLength
                this.dt = 0
              }
            }
            this.damageInvulnerabilityLeft = Math.max(0, this.damageInvulnerabilityLeft - this.dt);
          },
          render() {
            const isJumping = this.isJumping
            const isWalking = this.isMoving && !isJumping
            const isAttacking = this.isAttacking
            let pose

            if (isJumping) {
              pose = 'jump'
            } else if (isWalking) {
              pose = 'walk'
            } else if (isAttacking) {
              pose = 'attack'
            } else {
              pose = 'idle'
            }

            renderCatSideView(this.context,
              {
                pose,
                flipX: !this.facingRight,
                frameIndex: this.frame,
                scale: 2,
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

      if (['W','M','m','N','n','w','F','C', '#', 'f','O','o'].includes(ch)) {
        if (ch === 'f') {
          cfg.isVisible = false
        }
        cfg.collides = true
        if (['W','M','m','N','n','w','F','f','O','o'].includes(ch)) {
          cfg.render = function () {
            renderWoodConcreteFloor(
              this.context,
              this.width,
              this.height,
              {
                  ...parseToColorTilesByLevel[selectedLevel][cfg.type],
              })
          }
        }
        gameObjects.obstacles.push(Sprite(cfg));
      }

      if (['L','c','T','f','D','O','R','Q', 'd'].includes(ch)) {
        cfg.collides = false
        if (ch === 'Q') {
          cfg.width = 40
          cfg.height = 40
          cfg.y = y * tileSize - tileSize + 5
          cfg.render = function () {
            renderLamp(this.context, this.width , this.height)
          }
        } else if (ch === 'T') {
          cfg.width = 40
          cfg.height = 40
          cfg.y = y * tileSize - tileSize + 5
          cfg.render = function () {
            renderTable(this.context, this.width , this.height)
          }
        } else if (ch === 'D') {
          cfg.width = 40
          cfg.height = 40
          cfg.y = y * tileSize - tileSize + 5
          cfg.render = function () {
            renderPalmTree(this.context, this.width , this.height)
          }
        } else if (ch === 'd') {
          cfg.width = 40
          cfg.height = 40
          cfg.y = y * tileSize - tileSize + 5
          cfg.render = function () {
            renderPottedTree(this.context, this.width , this.height)
          }
        }
        gameObjects.obstacles.push(Sprite(cfg));
      }

      if (['A', 'a'].includes(ch)) {
        cfg.collected = false
        cfg.isVisible = ch === 'A'
        cfg.color = 'rgba(0, 0, 0, 0)'
        cfg.visibilityTime = 0
        if (ch === 'a') {
          cfg.update = function (deltaTime) {
            if (this.visibilityTime <= 0) {
              this.collected = false
              this.visibilityTime = 0
            } else {
              this.visibilityTime -= deltaTime
            }
          }
        }

        cfg.render = function () {
          renderCollectibleFish(this.context, this.width, this.height, {
            fishColor: 'rgb(255, 210, 40)',
            glowColor: 'rgb(255,255,255)'
          });
        }
        gameObjects.collectables.push(Sprite(cfg));
      }

      if (['E','X','B'].includes(ch)) {
        cfg.canDie = true
        cfg.isDead = false
        cfg.isAlive = true
        cfg.enemy = true
        cfg.isMonster = true
        cfg.health = 100
        cfg.collisionDamage = 50
        if (ch === 'B') {
          cfg.health = 2 // 200
          cfg.collisionDamage = 25
          cfg.velocityY = 0
          cfg.velocityX = 0
          cfg.isJumping = true
          cfg.jumpForce = -350 // Меньше, чем у игрока
          cfg.moveSpeed = 300
          cfg.onGround = true
          cfg.facingRight = false

          // Запоминаем начальную позицию
          cfg.spawnX = x * tileSize
          cfg.spawnY = y * tileSize

          // Границы перемещения (10 тайлов в каждую сторону)
          cfg.boundaryLeft = cfg.spawnX - 12 * tileSize
          cfg.boundaryRight = cfg.spawnX + 12 * tileSize

          // Таймеры для принятия решений
          cfg.decisionTimer = 0
          cfg.decisionInterval = 1 // секунды между сменой поведения

          cfg.trashItems = []; // массив для хранения мусора
          cfg.maxTrashItems = 2; // максимальное количество мусора
          cfg.trashCooldown = 5; // секунды между созданием мусора
          cfg.trashTimer = 0; // таймер для отсчета
          cfg.trashLifespan = 10; // время жизни мусора в секундах
          cfg.trashDamage = 20; // урон от столкновения с мусором
          cfg.trashWidth = tileSize / 2; // размер мусора
          cfg.trashHeight = tileSize / 2;

          cfg.update = function(deltaTime) {
            if (!this.isAlive) return;

            // Гравитация
            if (!this.onGround) {
              this.velocityY += GRAVITY_DOWN * deltaTime; // Сила гравитации
            }

            // Обновляем таймер принятия решений
            this.decisionTimer -= deltaTime;
            if (this.decisionTimer <= 0) {
              // Время принять новое решение
              this.decisionTimer = this.decisionInterval;

              // Случайное решение: 0 - стоять, 1 - идти влево, 2 - идти вправо, 3 - прыгнуть
              const decision = Math.floor(Math.random() * 4);

              if (decision === 0) {
                // Стоять на месте
                this.velocityX = 0;
              } else if (decision === 1) {
                // Идти влево
                this.velocityX = -this.moveSpeed;
                this.facingRight = false;
              } else if (decision === 2) {
                // Идти вправо
                this.velocityX = this.moveSpeed;
                this.facingRight = true;
              } else if (decision === 3 && this.onGround) {
                // Прыгнуть, если на земле
                this.velocityY = this.jumpForce;
                this.onGround = false;
              }
            }

            // Проверяем границы
            if (this.x < this.boundaryLeft) {
              this.x = this.boundaryLeft;
              this.velocityX = this.moveSpeed; // Разворачиваемся, если достигли левой границы
              this.facingRight = true;
            } else if (this.x > this.boundaryRight) {
              this.x = this.boundaryRight;
              this.velocityX = -this.moveSpeed; // Разворачиваемся, если достигли правой границы
              this.facingRight = false;
            }

            // Применяем движение
            this.x += this.velocityX * deltaTime;
            this.y += this.velocityY * deltaTime;

            // Логика создания мусора
            this.trashTimer += deltaTime;
            if (this.trashTimer >= this.trashCooldown && this.trashItems.length < this.maxTrashItems) {
              // Создаем новый мусор
              this.trashItems.push(Sprite({
                x: this.x + this.width / 2 - this.trashWidth / 2, // центрируем относительно босса
                y: this.y + this.height - this.trashHeight, // внизу босса
                width: this.trashWidth,
                height: this.trashHeight,
                timeLeft: this.trashLifespan, // время жизни в секундах
                canDie: true,
                isDead: false,
                isAlive: true,
                enemy: true,
                isMonster: true,
                health: 50,
                collisionDamage: 15,
                isVisible: true,
                type: 'B',
              }));

              this.trashTimer = 0; // сбрасываем таймер
            }

            // Обновляем все существующие мусоры
            for (let i = this.trashItems.length - 1; i >= 0; i--) {
              const trash = this.trashItems[i];
              trash.timeLeft -= deltaTime;

              // Удаляем мусор, если его время истекло
              if (trash.timeLeft <= 0) {
                this.trashItems.splice(i, 1);
              }
            }

            // Здесь нужна будет проверка коллизий с землей и препятствиями
            // ...
          };

          cfg.renderTrash = function() {
            for (const trash of this.trashItems) {
              this.context.save()
              const r = trash.width
              this.context.translate(trash.x, trash.y);
              this.context.beginPath();
              this.context.arc(0, 0, r, 0, Math.PI * 2);
              this.context.fillStyle = "#eee";
              this.context.fill();
              this.context.strokeStyle = "#aaa";
              this.context.stroke();

              // пара складок
              this.context.strokeStyle = "rgba(0,0,0,0.2)";
              this.context.beginPath();
              this.context.moveTo(-r/2, -r/4);
              this.context.lineTo(r/3, r/5);
              this.context.moveTo(-r/3, r/4);
              this.context.lineTo(r/2, -r/5);
              this.context.stroke();
              this.context.restore()

              // // Отрисовка мусора (простой квадрат)
              // this.context.fillStyle = 'rgba(150, 75, 0, 0.8)'; // коричневый с прозрачностью
              // this.context.fillRect(trash.x, trash.y, trash.width, trash.height);
              //
              // // Можно добавить детали, чтобы он выглядел как мусор
              // this.fillStyle = 'rgba(100, 50, 0, 0.9)';
              // const segments = 3;
              // const segWidth = trash.width / segments;
              // const segHeight = trash.height / segments;
              //
              // for (let i = 0; i < segments; i++) {
              //   for (let j = 0; j < segments; j++) {
              //     if ((i + j) % 2 === 0) {
              //       this.context.fillRect(
              //         trash.x + i * segWidth,
              //         trash.y + j * segHeight,
              //         segWidth,
              //         segHeight
              //       );
              //     }
              //   }
              // }
            }
          };
          cfg.render = function() {
            // корпус (низкая шайба)
            this.context.fillStyle = "#555";
            this.context.beginPath();
            this.context.rect(0, this.height - 8, this.width, 10); // прямоугольник-основа
            this.context.fill();

            // корпус (низкая шайба)
            this.context.fillStyle = "#b1b1b1";
            this.context.beginPath();
            this.context.rect(0, this.height - 13, this.width, 5); // прямоугольник-основа
            this.context.fill();

            // сенсор (выпуклость сверху)
            this.context.fillStyle = "#222";
            this.context.beginPath();
            this.context.rect(0, this.height - 19, this.width*0.2, this.height *0.3);
            this.context.fill();

            // кнопка на крышке
            this.context.fillStyle = "#0f0";
            this.context.beginPath();
            this.context.arc(13, this.height - 15, this.height*0.15, 0, Math.PI*2);
            this.context.fill();
          }

        }
        if (ch === 'X') {
          cfg.isMonster = false
          cfg.collides = true
          cfg.health = 12
          cfg.breakable = true
        }
        if (ch === 'E') {
          cfg.update = function (deltaTime) {
            if (!this.isAlive) {
              this.isMonster = false
              this.isAlive = true
              this.transformAt = Date.now() + 5000
              this.velocityX = 0
              this.velocityY = 0
              this.onGround = false
              this.jumpTimer = 0
              this.health = 100
            }

            const now = Date.now()
            if (!this.isMonster) {
              if (now >= this.transformAt) {
                this.isMonster = true
                const growFactor = 1.2
                this.width *= growFactor
                this.height *= growFactor
                this.velocityX = this.direction === 'left' ? -50 : 50
                console.log('Какашка превратилась в монстра!')
              }
            }
            if (this.isMonster) {
              this.jumpTimer -= deltaTime
              if (this.onGround && this.jumpTimer <= 0) {
                if (Math.random() < 0.02) {
                  this.velocityY = -350 - Math.random() * 150 // Случайная сила прыжка
                  this.onGround = false
                  this.jumpTimer = 1 + Math.random() * 2 // Задержка между прыжками
                }
                if (Math.random() < 0.01) {
                  this.direction = this.direction === 'left' ? 'right' : 'left'
                  this.velocityX *= -1
                }
              }
            }

            if (!this.onGround) {
              this.velocityY += 980 * deltaTime
            }

            this.y += this.velocityY * deltaTime
            this.x += this.velocityX * deltaTime
            this.onGround = false
          }
        }
        gameObjects.enemies.push(Sprite(cfg));
      }

      if (ch === 'P') {
        gameObjects.enemies.push(Sprite({
          type: 'P',
          x: cfg.x,
          y: cfg.y,
          width: cfg.width,
          height: cfg.height,
          color: 'brown', // Добавляем цвет

          // Свойства из оригинального объекта
          createdAt: Date.now(),
          isMonster: false,
          transformAt: Date.now() + 5000,
          velocityX: 0,
          velocityY: 0,
          direction: Math.random() > 0.5 ? 'left' : 'right',
          onGround: false,
          jumpTimer: 0,
          health: 100,
          isAlive: true,
          canDie: false,
          isDead: false,
          update(deltaTime) {
            if (!this.isAlive) {
              this.isMonster = false
              this.isAlive = true
              this.transformAt = Date.now() + 5000
              this.velocityX = 0
              this.velocityY = 0
              this.onGround = false
              this.jumpTimer = 0
              this.health = 100
            }

            const now = Date.now()
            if (!this.isMonster) {
              if (now >= this.transformAt) {
                this.isMonster = true
                const growFactor = 1.2
                this.width *= growFactor
                this.height *= growFactor
                this.velocityX = this.direction === 'left' ? -50 : 50
                console.log('Какашка превратилась в монстра!')
              }
            }
            if (this.isMonster) {
              this.jumpTimer -= deltaTime
              if (this.onGround && this.jumpTimer <= 0) {
                if (Math.random() < 0.02) {
                  this.velocityY = -350 - Math.random() * 150 // Случайная сила прыжка
                  this.onGround = false
                  this.jumpTimer = 1 + Math.random() * 2 // Задержка между прыжками
                }
                if (Math.random() < 0.01) {
                  this.direction = this.direction === 'left' ? 'right' : 'left'
                  this.velocityX *= -1
                }
              }
            }

            if (!this.onGround) {
              this.velocityY += 980 * deltaTime
            }

            this.y += this.velocityY * deltaTime
            this.x += this.velocityX * deltaTime
            this.onGround = false
          },
        }))
      }
    });
  });

  return gameObjects
}
