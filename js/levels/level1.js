import {CANVAS, GAME_STATE, GameState, updateCamera} from '../states/game'
import {initKeyboardControls} from '../gameHelpers/keyboard'
import {collides} from '../engine/kontra.mjs'

const parseToColorMapper = {
  // W = wall
  'W': 'brown',
  // F = floor
  'F': 'darkgreen',
  // C = ceiling
  'C': 'black',
  // L = lamp
  'L': 'yellow',
  // c = chair
  'c': 'sienna',
  // T = table
  'T': 'peru',
  // f = flower
  'f': 'green',
  // D = door
  'D': 'darkred',
  // O = window
  'O': 'lightblue',
  // R = wardrobe
  'R': 'saddlebrown',
  // E = enemy
  'E': 'red',
  // B = boss
  'B': 'purple',
  // X = breakable wall
  'X': 'gray',
  // P = poop
  'P': 'brown'
}

const level1 = [
  // 39 F one screen width
  "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
  "W.....................................................................................................................................................................................................................................................W",
  "W.......................E.............................................................................................................................................................................................................................W",
  "W.............................................B.......................................................................................................................................................................................................W",
  "W.........................................................................................................w...........................................................................................................................................W",
  "W.........................................................................................................w...........................................................................................................................................W",
  "W......................P..................................................................................w...........................................................................................................................................W",
  "W.........................................................................................................w...........................................................................................................................................W",
  "W........................................................................P................................W...........................................................................................................................................W",
  "W.............FFFFFFF.....F.FF..FF....F.FF......FF...........FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF.............................................FFFF...........................................................................................W",
  "W......FF....................................WW...........................................................W.............................................W.............................................................................................W",
  "W......FF..................FF................WW...........................................................W.......................................FFFFFFW.............................................................................................W",
  "W......FF..................WW................WW...........................................................W.............................................W.............................................................................................W",
  "W......FFOOOO..............WW..............FF.............................X...............................W.............................................W.............................................................................................W",
  "W......FF.........FF.......WW.............................................X...............................W.............................................W.............................................................................................W",
  "W......FF..................WW.............................................X...............................W.............................................W.............................................................................................W",
  "W......................FFFFWW.............................................X...............................WFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFW............W.............................................................................................W",
  "W......................WWWWWW.............................................X..............................XX.............................................W.............................................................................................W",
  "W............c.....c.FFWWWWWW.............................................X..........XXXXXXXXXXXXXXXXXXXXXX.............................................W.............................................................................................W",
  "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
];

function parseLevel(levelMap, gameObjects, Sprite, tileSize = 20) {
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
        type: ch
      };

      if (['W','F','C'].includes(ch)) {
        cfg.collides = true
        gameObjects.obstacles.push(Sprite(cfg));
      }

      if (['L','c','T','f','D','O','R'].includes(ch)) {
        cfg.collides = false
        gameObjects.obstacles.push(Sprite(cfg));
      }

      if (['E','X','B'].includes(ch)) {
        cfg.isDead = false
        cfg.isAlive = true
        cfg.enemy = true
        cfg.isMonster = true
        cfg.health = 100
        cfg.canDie = true
        cfg.collisionDamage = 10
        if (ch === 'X') {
          cfg.isMonster = false
          cfg.collides = true
          cfg.health = 12
          cfg.breakable = true
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
              console.log('Какашка убита!')
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
}




export function level1Init(gameObjects, {PlayerState, GameState}, Sprite, {canvas}) {
  const levelState = {
    level: {
      floorLine: CANVAS.height - 20,
      levelWidth: canvas.width * 7,
      levelHeight: canvas.height,
    },
  }

  parseLevel(level1, gameObjects[GAME_STATE.LEVEL1], Sprite)

  GameState.camera.levelBounds = {
    minX: 0,
    maxX: levelState.level.levelWidth - CANVAS.width,
    minY: 0,
    maxY: levelState.level.levelHeight - CANVAS.height,
  }

  gameObjects[GAME_STATE.LEVEL1].white = Sprite({
    x: 20,
    y: CANVAS.height - 4 * 40,
    width: 40,
    height: 40,
    color: 'white',
    // Добавляем физические свойства
    velocityY: 0,
    isJumping: true,
    jumpForce: -550, // Отрицательное значение, т.к. ось Y направлена вниз
    moveSpeed: 200,
    onGround: false,
    alpha: 1.0, // для прозрачности
    originalWidth: 40,
    originalHeight: 40,
    sizeMultiplier: 1,
    facingRight: true,
    isMoving: false,
    attackDamage: 10, // урон от атаки
    health: 100,
    lives: 10,
    damageInvulnerabilityLeft: 0,
  })
  gameObjects[GAME_STATE.LEVEL1].black = Sprite({
    x: 40,
    y: CANVAS.height - 4 * 40,
    width: 40,
    height: 40,
    color: 'black',
    // Добавляем физические свойства
    velocityY: 0,
    isJumping: true,
    jumpForce: -550, // Отрицательное значение, т.к. ось Y направлена вниз
    onGround: false,
    alpha: 1.0, // для прозрачности
    moveSpeed: 200,
    originalWidth: 40,
    originalHeight: 40,
    sizeMultiplier: 1,
    // Добавляем свойства для атаки
    isAttacking: false,
    attackDuration: 0.03, // миллисекунды
    attackTimer: 0,
    attackRange: 60, // дальность атаки
    attackDamage: 10, // урон от атаки
    facingRight: true,
    // Свойства для cooldown
    attackCooldown: 0.5, // миллисекунды (время перезарядки)
    attackCooldownTimer: 0, // текущий таймер перезарядки
    canAttack: true, // флаг, может ли кот атаковать
    isMoving: false,
    health: 100,
    lives: 10,
    damageInvulnerabilityLeft: 0,
  })

// Инициализация состояния игрока
  PlayerState.activeCharacter = 'white' // По умолчанию активен белый персонаж

  // Инициализируем backgrounds, если его еще нет
  gameObjects[GAME_STATE.LEVEL1].backgrounds = gameObjects[GAME_STATE.LEVEL1].backgrounds || {}

  // Создаем объект фона с градиентом заката
  gameObjects[GAME_STATE.LEVEL1].backgrounds.sunset = {
    render: function (ctx) {
      // Создаем градиент от верха к низу
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS.height)

      // Добавляем цвета заката (темно-синий -> фиолетовый -> оранжевый -> желтый)
      gradient.addColorStop(0, '#1a2b56')    // Темно-синий (верх неба)
      gradient.addColorStop(0.4, '#864d9e')  // Фиолетовый
      gradient.addColorStop(0.7, '#dd5e5e')  // Оранжево-красный
      gradient.addColorStop(0.9, '#f9d423')  // Желтый (у горизонта)

      // Заполняем фон градиентом
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS.width, CANVAS.height)
    },
  }

  gameObjects[GAME_STATE.LEVEL1].keyboard = initKeyboardControls()
  gameObjects[GAME_STATE.LEVEL1].level = levelState.level

  for (let i = 0; i < 7; i++) {
    // Пропускаем первый экран для разнообразия
    if (i % 2 === 0) {
      gameObjects[GAME_STATE.LEVEL1].collectables.push({
        x: canvas.width * i + canvas.width / 2, // По центру каждого второго экрана
        y: canvas.height - 60, // Немного выше пола
        width: 15,
        height: 15,
        collected: false,
        color: 'blue', // Синий квадратик
        type: 'sizeFood', // Тип: еда для увеличения размера
      })
    }
  }

}

export function renderLevel1(gameObjects, {PlayerState}, {canvas, context}) {
  const {
    white,
    black,
  } = gameObjects[GAME_STATE.LEVEL1]

  function renderWithCamera(context, camera, drawFunction) {
    context.save()

    // Смещаем всё на отрицательное положение камеры
    context.translate(-camera.x, -camera.y)

    // Выполняем функцию отрисовки
    drawFunction(context)

    context.restore()
  }

  function renderBackground(context, canvas, camera) {
    // Градиентный фон, если нет изображения
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#87CEEB')
    gradient.addColorStop(1, '#E0F7FA')

    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Очищаем весь холст
  context.clearRect(0, 0, canvas.width, canvas.height)

  // Отрисовываем фон с учетом камеры
  renderBackground(context, canvas, GameState.camera)

  // Отрисовываем все объекты с учетом положения камеры
  renderWithCamera(context, GameState.camera, (ctx) => {
    // Отрисовка всех игровых объектов

    // Например, отрисовка земли
    ctx.fillStyle = 'brown'
    ctx.fillRect(0, canvas.height - 20, canvas.width * 7, 20)

    if (gameObjects[GAME_STATE.LEVEL1].backgrounds.length > 0) {
      gameObjects[GAME_STATE.LEVEL1].backgrounds.forEach(background => {
        background.render()
      })
    }

    if (gameObjects[GAME_STATE.LEVEL1].obstacles.length > 0) {
      gameObjects[GAME_STATE.LEVEL1].obstacles.forEach(background => {
        background.render()
      })
    }

    if (gameObjects[GAME_STATE.LEVEL1].collectables.length > 0) {
      renderFoodItems(context, gameObjects[GAME_STATE.LEVEL1].collectables)
      gameObjects[GAME_STATE.LEVEL1].collectables.forEach(collectable => {collectable?.render?.()})
    }

    if (gameObjects[GAME_STATE.LEVEL1].boss) {
      gameObjects[GAME_STATE.LEVEL1].boss.render()
    }

    if (gameObjects[GAME_STATE.LEVEL1].enemies.length > 0) {
      gameObjects[GAME_STATE.LEVEL1].enemies.forEach(enemy => {
        enemy?.render?.()
      })
    }

    if (gameObjects[GAME_STATE.LEVEL1].effects.length > 0) {
      gameObjects[GAME_STATE.LEVEL1].enemies.forEach(effect => {
        effect?.render?.()
      })
    }

    white.render()
    black.render()

    // Если кот атакует, добавляем визуализацию атаки
    if (black.isAttacking) {
      context.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Красное свечение

      // Направление атаки зависит от свойства facingRight
      if (black.facingRight) {
        // Атака вправо
        const attackX = black.x + black.width;
        context.fillRect(attackX, black.y, black.attackRange, black.height);
      } else {
        // Атака влево
        const attackX = black.x - black.attackRange;
        context.fillRect(attackX, black.y, black.attackRange, black.height);
      }
    }


  })

  // Интерфейс поверх всего (без смещения камеры)
  renderUI(context, {PlayerState, white: gameObjects[GAME_STATE.LEVEL1].white, black: gameObjects[GAME_STATE.LEVEL1].black});
}

/**
 * Отрисовывает пользовательский интерфейс поверх игрового мира
 * @param {CanvasRenderingContext2D} context - Контекст канваса для отрисовки
 * @param {Object} playerState - Объект с состоянием игрока (здоровье, оружие и т.д.)
 */
function renderUI(context, playerState) {
  // Сохраняем текущее состояние контекста
  context.save();

  // Устанавливаем параметры текста
  context.font = '10px Arial';
  context.fillStyle = 'white';
  context.textAlign = 'left';

  // Отрисовываем здоровье игрока
  context.fillText(`Health white: ${playerState.white.health}`, 20, 20);
  context.fillText(`Health black: ${playerState.black.health}`, 20, 40);

  // Отрисовываем патроны/боеприпасы
  context.fillText(`Weapon: ${playerState?.ammo}`, 20, 60);

  // Отрисовка полоски здоровья
  const healthBarWidth = 150;
  const healthBarHeight = 15;
  const healthPercentage = Math.max(0, playerState.health / 100);

  // Фон полоски здоровья
  context.fillStyle = 'rgba(0, 0, 0, 0.5)';
  context.fillRect(20, 80, healthBarWidth, healthBarHeight);

  // Сама полоска здоровья
  context.fillStyle = playerState.health > 30 ? 'green' : 'red';
  context.fillRect(20, 80, healthBarWidth * healthPercentage, healthBarHeight);


  // Отрисовываем активное оружие
  if (playerState?.weapon) {
    context.fillText(`Оружие: ${playerState.weapon.name}`, 20, 110);
  }

  // Отрисовка счета или других игровых параметров
  context.textAlign = 'right';
  context.fillStyle = 'white';
  context.fillText(`Счет: ${playerState.score}`, context.canvas.width - 20, 30);

  // Если игрок получает урон, показываем индикатор урона
  if (playerState?.damageTaken > 0) {
    const alpha = Math.min(0.7, playerState.damageTaken / 100);
    context.fillStyle = `rgba(255, 0, 0, ${alpha})`;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  // Восстанавливаем состояние контекста
  context.restore();
}


export function updateLevel1(gameObjects, {GameState, PlayerState}, {canvas, context}, deltaTime, Sprite) {
  const {
    white,
    black,
    enemies,
    backgrounds,
    obstacles,
    level,
    boss,
    exit,
    keyboard,
  } = gameObjects

  // Проверяем наличие объектов
  if (!white || !black) {
    console.error('Персонажи не определены!')
    return
  }

  if (PlayerState.activeCharacter === undefined) {
    PlayerState.activeCharacter = 'white' // По умолчанию выбран белый персонаж
  }

  // Обработка переключения персонажа по нажатию Shift
  if (keyboard.isKeyPressed('ShiftLeft') || keyboard.isKeyPressed('ShiftRight')) {
    // Используем debounce, чтобы предотвратить многократное переключение при удержании
    if (!PlayerState.lastShiftTime || Date.now() - PlayerState.lastShiftTime > 300) {
      PlayerState.activeCharacter = PlayerState.activeCharacter === 'white' ? 'black' : 'white'
      PlayerState.lastShiftTime = Date.now()
      console.log(`Переключились на ${PlayerState.activeCharacter} персонажа`)
    }
  }

  // Константы для физики
  const MOVE_SPEED = 200    // пикселей в секунду
  const JUMP_FORCE = -550   // Начальная скорость прыжка

  const activeCharacter = PlayerState.activeCharacter === 'white' ? white : black

  // Обновляем физику для обоих персонажей
  updateCharacterPhysics(white, deltaTime)
  updateCharacterPhysics(black, deltaTime)
  checkEnemyCollisions(white, gameObjects)
  checkEnemyCollisions(black, gameObjects)
  checkEnvironmentCollisions(white, gameObjects.obstacles);
  checkEnvironmentCollisions(black, gameObjects.obstacles);

  enemies.forEach((enemy) => {
    enemy.update(deltaTime)
    checkEnemyCollisionWithEnvironment(
      [
        ...gameObjects.obstacles.filter(({ collides }) => collides),
        ...gameObjects.enemies.filter(({ collides }) => collides),
      ],
      enemy,
    )
  })

  updateBlackCatAttack(activeCharacter, gameObjects, deltaTime)

  // Управление активным персонажем
  if (keyboard.isKeyPressed('KeyW') && activeCharacter.onGround) {
    activeCharacter.velocityY = activeCharacter.jumpForce || JUMP_FORCE
    activeCharacter.isJumping = true
    activeCharacter.onGround = false

    console.log(`${PlayerState.activeCharacter} прыгает!`)
  }
  const currentMoveSpeed = activeCharacter.moveSpeed || MOVE_SPEED

  if (keyboard.isKeyPressed('KeyA')) {
    activeCharacter.x -= currentMoveSpeed * deltaTime
    activeCharacter.facingRight = false;
    activeCharacter.isMoving = true;
  }
  if (keyboard.isKeyPressed('KeyD')) {
    activeCharacter.x += currentMoveSpeed * deltaTime
    activeCharacter.facingRight = true;
    activeCharacter.isMoving = true;
  }

  if (!keyboard.isKeyPressed('KeyA') && !keyboard.isKeyPressed('KeyD')) {
    activeCharacter.isMoving = false;
  }

  if (keyboard.isKeyPressed('Space') && !activeCharacter.poopCooldown) {
    if (PlayerState.activeCharacter === 'white') {
      if (createPoop(activeCharacter, gameObjects, Sprite)) {
        // Устанавливаем задержку на какание, чтобы не спамить
        activeCharacter.poopCooldown = true

        // Сбрасываем задержку через 1 секунду
        setTimeout(() => {
          activeCharacter.poopCooldown = false
        }, 1000)
      }
    }
    if (PlayerState.activeCharacter === 'black' && !activeCharacter.isAttacking && activeCharacter.canAttack) {
      activeCharacter.isAttacking = true;
      activeCharacter.attackTimer = activeCharacter.attackDuration;
      activeCharacter.canAttack = false; // Запрещаем атаковать до истечения cooldown
      activeCharacter.attackCooldownTimer = activeCharacter.attackCooldown; // Устанавливаем таймер перезарядки

      // Здесь можно добавить звук атаки, если есть
      // playSound('blackAttack');
    }
  }

  // Проверка столкновений с едой для белого кота
  checkFoodCollision(white, gameObjects.collectables)

  // Ограничиваем движение персонажей границами уровня
  white.x = Math.max(0, Math.min(white.x, canvas.width * 7 - white.width))
  black.x = Math.max(0, Math.min(black.x, canvas.width * 7 - black.width))

  updateCamera(GameState, activeCharacter)

  // Визуальное обозначение активного персонажа
  white.alpha = PlayerState.activeCharacter === 'white' ? 1.0 : 0.7
  black.alpha = PlayerState.activeCharacter === 'black' ? 1.0 : 0.7
  gameObjects.enemies = gameObjects.enemies.filter(({ isDead }) => !isDead )
}

const GRAVITY_UP = 1200   // Гравитация при движении вверх
const GRAVITY_DOWN = 1500 // Гравитация при падении
const MAX_FALL_SPEED = 800 // Максимальная скорость падения

// Функция для обновления физики персонажа с резким прыжком
function updateCharacterPhysics(character, deltaTime) {
  // Применяем гравитацию с разными значениями для подъема и падения
  if (!character.onGround) { // или !character.isOnGround, в зависимости от того, какое имя вы выберете
    // Если персонаж движется вверх (отрицательная скорость Y)
    if (character.velocityY < 0) {
      character.velocityY += GRAVITY_UP * deltaTime;
    } else {
      // Если персонаж движется вниз (положительная скорость Y)
      character.velocityY += GRAVITY_DOWN * deltaTime;
    }

    // Ограничиваем максимальную скорость падения
    if (character.velocityY > MAX_FALL_SPEED) {
      character.velocityY = MAX_FALL_SPEED;
    }
  }

  // Применяем вертикальную скорость
  character.y += character.velocityY * deltaTime;

  // Можно оставить только проверку верхней границы
  if (character.y < 20) {
    character.y = 20;
    character.velocityY = GRAVITY_DOWN;
  }
}

function isCollided(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function checkEnemyCollisions(player, gameObjects, deltaTime) {
  gameObjects.enemies.forEach((enemy, index) => {
    if (isCollided(player, enemy)) {
      if (enemy.type === 'X') {
        if (player.color === 'white') {
          const canBreak = player.sizeMultiplier * player.attackDamage >= enemy.health
          console.log('canBreak: ', canBreak, player.sizeMultiplier, player.attackDamage, enemy.health)
          if (canBreak) {
            gameObjects.enemies[index].health = 0
            gameObjects.enemies[index].isAlive = false
            gameObjects.enemies[index].isDead = enemy.canDie
          } else {
            if (player.facingRight) {
              player.x = enemy.x - player.width
            } else {
              player.x = enemy.x + enemy.width;
            }
          }
        } else {
          if (player.facingRight) {
            player.x = enemy.x - player.width
          } else {
            player.x = enemy.x + enemy.width;
          }
        }
      } else if (enemy.type === 'E' || enemy.type === 'P') {
        if (enemy.type === 'P' && enemy.isMonster) {
          if (player.damageInvulnerabilityLeft <= 0) {
            player.health -= enemy?.collisionDamage ?? 1
            player.damageInvulnerabilityLeft = 1000
          }
        }
      }
    }
  })
  player.damageInvulnerabilityLeft = player.damageInvulnerabilityLeft <= 0 ? 0 : player.damageInvulnerabilityLeft - 10
  console.log('player.damageInvulnerabilityLeft: ', player.damageInvulnerabilityLeft)
}

function checkEnvironmentCollisions(player, obstacles, deltaTime) {
  const collidingObstacles = obstacles.filter(({ collides }) => collides);
  collidingObstacles.forEach(obstacle => {
    if (isCollided(player, obstacle)) {
      if (obstacle.type === 'F') {
        if (player.y + player.height >= obstacle.y && player.y <= obstacle.y) {
          player.y = obstacle.y - player.height;
          player.onGround = true;
          player.isJumping = false
          player.velocityY = GRAVITY_DOWN;
        } else if (
          player.isJumping &&
          player.y + player.height >= obstacle.y + obstacle.height &&
          player.y <= obstacle.y + obstacle.height
        ) {
          player.y = obstacle.y + obstacle.height
          player.velocityY = GRAVITY_DOWN;
        }
      }

      if (obstacle.type === 'W') {
        if (player.facingRight) {
          player.x = obstacle.x - player.width
        } else {
          player.x = obstacle.x + obstacle.width;
        }
      }

      if (player.y <= 10) {
        player.y = 10;
        player.velocityY = -10 * deltaTime;
      }
    }
  })
}

// Функция для проверки столкновения с едой и её сбора
function checkFoodCollision(character, foodItems) {
  for (let i = 0; i < foodItems.length; i++) {
    const food = foodItems[i]

    // Пропускаем уже собранную еду
    if (food.collected) continue

    // Проверяем столкновение с едой
    if (character.x < food.x + food.width &&
      character.x + character.width > food.x &&
      character.y < food.y + food.height &&
      character.y + character.height > food.y) {

      // Отмечаем еду как собранную
      food.collected = true

      // Применяем эффект в зависимости от типа еды
      if (food.type === 'sizeFood' && character.color === 'white') {
        // Увеличиваем размер белого кота
        increaseCatSize(character)
      }

      // Можно добавить звуковой эффект или анимацию здесь
      console.log('Еда собрана!')

      return true
    }
  }

  return false
}

// Функция для увеличения размера кота
function increaseCatSize(character) {
  // Максимальный множитель размера: 4
  const MAX_SIZE_MULTIPLIER = 4

  // Увеличиваем множитель на определенное значение
  const sizeIncrement = 0.5 // Каждая еда увеличивает размер на 50%

  // Проверяем, не достигли ли максимального размера
  if (character.sizeMultiplier < MAX_SIZE_MULTIPLIER) {
    // Запоминаем текущую позицию "ног" персонажа
    const bottomY = character.y + character.height

    // Увеличиваем множитель размера
    character.sizeMultiplier = Math.min(MAX_SIZE_MULTIPLIER, character.sizeMultiplier + sizeIncrement)

    // Применяем новый размер
    character.width = character.originalWidth * character.sizeMultiplier
    character.height = character.originalHeight * character.sizeMultiplier

    // Корректируем позицию Y, чтобы "ноги" оставались на том же уровне
    character.y = bottomY - character.height

    // Регулируем физические параметры в зависимости от размера
    // Чем больше кот, тем ниже он прыгает
    const BASE_JUMP_FORCE = -550
    const BASE_MOVE_SPEED = 200

    // Чем больше кот, тем ниже он прыгает
    // При размере 1 -> 100% силы прыжка
    // При размере 4 -> примерно 40% силы прыжка
    character.jumpForce = BASE_JUMP_FORCE * (1 / (1 + (character.sizeMultiplier - 1) * 0.5))

    // Чем больше кот, тем медленнее он двигается
    // При размере 1 -> 100% скорости
    // При размере 4 -> примерно 45% скорости
    character.moveSpeed = BASE_MOVE_SPEED * (1 / (1 + (character.sizeMultiplier - 1) * 0.4))


    console.log(`Кот увеличился! Новый множитель: ${character.sizeMultiplier}`)
    console.log(`Новая сила прыжка: ${character.jumpForce}, Новая скорость: ${character.moveSpeed}`)
  }
}


function renderFoodItems(context, foodItems) {
  foodItems.forEach(food => {
    // Рисуем только несобранную еду
    if (!food.collected) {
      context.fillStyle = food.color
      context.fillRect(food.x, food.y, food.width, food.height)

      // Можно добавить эффект "свечения" для лучшей видимости
      context.shadowColor = 'rgba(0, 0, 255, 0.7)'
      context.shadowBlur = 10
      context.fillRect(food.x, food.y, food.width, food.height)
      context.shadowBlur = 0
    }
  })
}

// Функция для создания какашки
function createPoop(character, gameObjects, Sprite) {
  // Проверяем, достаточно ли большой размер кота
  if (character.sizeMultiplier > 1) {
    // Уменьшаем размер кота после какания
    const poopSizeReduction = 0.2 // Уменьшение размера на 20%

    // Запоминаем текущую позицию "ног" персонажа
    const bottomY = character.y + character.height

    // Уменьшаем множитель размера, но не меньше 1
    character.sizeMultiplier = Math.max(1, character.sizeMultiplier - poopSizeReduction)

    // Пересчитываем размеры
    character.width = character.originalWidth * character.sizeMultiplier
    character.height = character.originalHeight * character.sizeMultiplier

    // Корректируем позицию Y, чтобы "ноги" оставались на том же уровне
    character.y = bottomY - character.height

    // Регулируем физические параметры в зависимости от размера
    const BASE_JUMP_FORCE = -550
    const BASE_MOVE_SPEED = 200

    // Обновляем силу прыжка и скорость после изменения размера
    character.jumpForce = BASE_JUMP_FORCE * (1 / (1 + (character.sizeMultiplier - 1) * 0.5))
    character.moveSpeed = BASE_MOVE_SPEED * (1 / (1 + (character.sizeMultiplier - 1) * 0.4))

    // Создаем какашку
    const poopSize = 15 + (character.sizeMultiplier - 1) * 5 // Размер какашки зависит от размера кота

    // Определяем положение какашки под котом
    const poopX = character.direction === 'left'
      ? character.x + character.width - poopSize / 2
      : character.x + poopSize / 2

    // Импортируем Sprite из Kontra.js (должно быть в начале файла)
    // import { Sprite } from '../engine/kontra.mjs';

    // Создаем спрайт какашки с помощью Kontra.js
    const poop = Sprite({
      x: poopX,
      y: character.y + character.height - poopSize,
      width: poopSize,
      height: poopSize,
      color: 'brown', // Добавляем цвет
      type: 'P',
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
          console.log('Какашка убита!')
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
    });
    gameObjects.enemies.push(poop);
    console.log('Кот покакал! Размер уменьшился до', character.sizeMultiplier.toFixed(2))
    return true // Успешно покакал
  }

  return false // Не удалось покакать (размер слишком мал)
}

function checkEnemyCollisionWithEnvironment(obstacles, enemy) {
  obstacles.forEach(obstacle => {
    if (
      enemy.x < obstacle.x + obstacle.width &&
      enemy.x + enemy.width > obstacle.x &&
      enemy.y < obstacle.y + obstacle.height &&
      enemy.y + enemy.height > obstacle.y
    ) {
      // Проверка столкновения сверху (монстр стоит на препятствии)
      if (enemy.y + enemy.height > obstacle.y &&
        enemy.y + enemy.height < obstacle.y + obstacle.height / 2) {
        enemy.y = obstacle.y - enemy.height
        enemy.velocityY = 0
        enemy.onGround = true
      }
      // Проверка боковых столкновений
      else if (enemy.velocityX > 0 && enemy.x + enemy.width > obstacle.x &&
        enemy.x < obstacle.x) {
        // Столкновение справа
        enemy.x = obstacle.x - enemy.width
        enemy.direction = 'left'
        enemy.velocityX *= -1
      } else if (enemy.velocityX < 0 && enemy.x < obstacle.x + obstacle.width &&
        enemy.x + enemy.width > obstacle.x + obstacle.width) {
        // Столкновение слева
        enemy.x = obstacle.x + obstacle.width
        enemy.direction = 'right'
        enemy.velocityX *= -1
      }
    }
  })
}

function updateBlackCatAttack(character, gameObjects, delta) {
  // Если кот атакует, уменьшаем таймер атаки
  if (character.isAttacking) {
    character.attackTimer -= delta;

    // Проверяем попадание по врагам
    gameObjects.enemies?.forEach((enemy, index) => {
      let inAttackRange = false;
      if (character.facingRight) {
        // Атака вправо
        inAttackRange = (enemy.x >= character.x + character.width) &&
          (enemy.x <= character.x + character.width + character.attackRange) &&
          (enemy.y + enemy.height >= character.y) &&
          (enemy.y <= character.y + character.height);
      } else {
        // Атака влево
        inAttackRange = (enemy.x + enemy.width >= character.x - character.attackRange) &&
          (enemy.x <= character.x) &&
          (enemy.y + enemy.height >= character.y) &&
          (enemy.y <= character.y + character.height);
      }

      if (inAttackRange && enemy.isMonster) {
        enemy.health -= character.attackDamage;
        enemy.hitEffect = true;
        enemy.hitTimer = 200 // длительность эффекта
        if (enemy.health <= 0) {
          gameObjects.enemies[index].isAlive = false
          gameObjects.enemies[index].isDead = enemy.canDie
        }
      }
    });
    // Если таймер истек, завершаем атаку
    if (character.attackTimer <= 0) {
      character.isAttacking = false;
    }
  }
  // Обработка cooldown атаки
  if (!character.canAttack) {
    character.attackCooldownTimer -= delta;

    // Если таймер cooldown истек, разрешаем атаковать снова
    if (character.attackCooldownTimer <= 0) {
      character.canAttack = true;
    }
  }

}
