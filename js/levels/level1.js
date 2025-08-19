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
  'X': 'gray'
}

const level1 = [
  // 39 F one screen width
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W..................................................W",
  "W.......................E..........................W",
  "W.............................................B....W",
  "W..................................................W",
  "W..................................................W",
  "W..................................................W",
  "W..................................................W",
  "W..................................................W",
  "WFFFFFFFFFF....FFFFFFF.....F.FF..FF....F.FF......FFW",
  "W............................................WW....W",
  "W............................................WW....W",
  "W............................................WW....W",
  "W........OOOO..............................FF......W",
  "W..................................FFFF............W",
  "W..........................FF......................W",
  "W......FF................FFWW......................W",
  "W......................FFWWWW......................W",
  "W............c.....c.FFWWWWWW......................W",
  "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
];

// Объединяем в одну карту
function combineScreens(screens) {
  const result = [];
  const height = 10; // Высота экрана в тайлах

  for (let y = 0; y < height; y++) {
    let row = '';

    for (let screen = 0; screen < screens.length; screen++) {
      const screenRows = screens[screen].split('\n');
      const currentRow = screenRows[y].trim();

      if (screen === 0) {
        row += currentRow;
      } else if (screen === screens.length - 1) {
        row += currentRow.substring(1);
      } else {
        row += currentRow.substring(1, currentRow.length - 1);
      }
    }

    result.push(row);
  }

  return result.join('\n');
}

function parseLevel(levelMap, gameObjects, Sprite, tileSize = 20) {

  levelMap.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
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
        cfg.collides = true
        cfg.enemy = true
        if (ch === 'X') {
          cfg.breakable = true
        }
        gameObjects.enemies.push(Sprite(cfg));
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
    y: CANVAS.height - 12 - 40,
    width: 40,
    height: 40,
    color: 'white',
    // Добавляем физические свойства
    velocityY: 0,
    isJumping: false,
    jumpForce: -550, // Отрицательное значение, т.к. ось Y направлена вниз
    moveSpeed: 200,
    onGround: true,
    alpha: 1.0, // для прозрачности
    originalWidth: 40,
    originalHeight: 40,
    sizeMultiplier: 1,
    facingRight: true,
  })
  gameObjects[GAME_STATE.LEVEL1].black = Sprite({
    x: 40,
    y: CANVAS.height - 12 - 40,
    width: 40,
    height: 40,
    color: 'black',
    // Добавляем физические свойства
    velocityY: 0,
    isJumping: false,
    jumpForce: -550, // Отрицательное значение, т.к. ось Y направлена вниз
    onGround: true,
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
      renderPoops(context, gameObjects[GAME_STATE.LEVEL1].enemies)

      gameObjects[GAME_STATE.LEVEL1].enemies.forEach(enemy => {
        enemy?.render?.()
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
  // renderUI(context, playerState);
}

export function updateLevel1(gameObjects, {GameState, PlayerState}, {canvas, context}, deltaTime) {
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

  // Создаем obstacles, если его нет
  if (!level || level.floorLine === undefined) {
    if (!gameObjects.level) {
      gameObjects.level = {}
    }
    gameObjects.level.floorLine = canvas.height - 20
    console.warn(`Создан floorLine на уровне ${gameObjects.level.floorLine}`)
  }

  // Инициализируем состояние для активного персонажа, если его нет
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
  const GRAVITY_UP = 1200   // Гравитация при движении вверх
  const GRAVITY_DOWN = 1500 // Гравитация при падении
  const JUMP_FORCE = -550   // Начальная скорость прыжка
  const MAX_FALL_SPEED = 800 // Максимальная скорость падения


  // Функция для обновления физики персонажа с резким прыжком
  function updateCharacterPhysics(character) {
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
    if (character.y < 0) {
      character.y = 0;
      character.velocityY = 0;
    }
  }

  const activeCharacter = PlayerState.activeCharacter === 'white' ? white : black

  // Обновляем физику для обоих персонажей
  updateCharacterPhysics(white)
  updateCharacterPhysics(black)
  checkEnvironmentCollisions(white, gameObjects.obstacles);
  checkEnvironmentCollisions(black, gameObjects.obstacles);

  updatePoops(gameObjects, deltaTime, {canvas, context})

  updateBlackCatAttack(activeCharacter, gameObjects.enemies, deltaTime)

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
  }
  if (keyboard.isKeyPressed('KeyD')) {
    activeCharacter.x += currentMoveSpeed * deltaTime
    activeCharacter.facingRight = true;
  }

  if (keyboard.isKeyPressed('Space') && !activeCharacter.poopCooldown) {
    if (PlayerState.activeCharacter === 'white') {
      if (createPoop(activeCharacter, gameObjects)) {
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
}

function isCollided(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function checkEnvironmentCollisions(player, obstacles) {
  const collidableObstacles = obstacles.filter(({ collides }) => collides);
  collidableObstacles.forEach(obstacle => {
    if (isCollided(player, obstacle)) {
      player.velocityY = 500

      const playerLeft = player.x;
      const playerTop = player.y;
      const playerRight = playerLeft + player.width;
      const playerBottom = playerTop + player.height;

      const obstacleLeft = obstacle.x;
      const obstacleTop = obstacle.y;
      const obstacleRight = obstacleLeft + obstacle.width;
      const obstacleBottom = obstacleTop + obstacle.height;

      if (obstacle.type === 'F') {
        if (playerBottom >= obstacleBottom) {
          player.y = obstacleBottom
        }
        if (playerBottom >= obstacleTop && playerTop <= obstacleTop) {
          player.y = obstacleTop - player.height
          player.onGround = true
        }
      }

      if (obstacle.type === 'W') {
        if (player.facingRight) {
          player.x = obstacleLeft - player.width
        } else {
          player.x = obstacleRight
        }
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
function createPoop(character, gameObjects) {
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

    // Добавляем какашку в массив
    gameObjects.enemies.push({
      x: poopX,
      y: character.y + character.height - poopSize,
      width: poopSize,
      height: poopSize,
      createdAt: Date.now(),
      isMonster: false,                    // Флаг монстра
      transformAt: Date.now() + 5000,      // Время превращения (через 5 секунд)
      velocityX: 0,                        // Скорость по X (для движения монстра)
      velocityY: 0,                        // Скорость по Y
      direction: Math.random() > 0.5 ? 'left' : 'right', // Случайное направление
      onGround: false,                     // Флаг нахождения на земле
      jumpTimer: 0,                         // Таймер для прыжков
    })

    console.log('Кот покакал! Размер уменьшился до', character.sizeMultiplier.toFixed(2))

    // Добавляем эффект
    if (gameObjects.effects) {
      gameObjects.effects.push({
        x: character.x + character.width / 2,
        y: character.y - 20,
        text: 'Покакал! Размер ↓',
        color: 'brown',
        alpha: 1,
        type: 'poopText',
        createdAt: Date.now(),
        duration: 1500,
        offsetY: 0,
      })
    }

    return true // Успешно покакал
  }

  return false // Не удалось покакать (размер слишком мал)
}

// Функция для отрисовки какашек
function renderPoops(context, poops) {
  poops.forEach(poop => {
    if (poop.isMonster) {
      // Рисуем монстра
      context.fillStyle = '#5D2906' // Темно-коричневый для монстра
      context.fillRect(poop.x, poop.y, poop.width, poop.height)

      // Рисуем глаза монстру
      context.fillStyle = 'white'

      // Определяем позицию глаз в зависимости от направления
      const eyeSize = poop.width * 0.15
      const eyeY = poop.y + poop.height * 0.3

      let leftEyeX, rightEyeX

      if (poop.direction === 'left') {
        leftEyeX = poop.x + poop.width * 0.2
        rightEyeX = poop.x + poop.width * 0.5
      } else {
        leftEyeX = poop.x + poop.width * 0.5
        rightEyeX = poop.x + poop.width * 0.8
      }

      // Рисуем глаза
      context.fillRect(leftEyeX, eyeY, eyeSize, eyeSize)
      context.fillRect(rightEyeX, eyeY, eyeSize, eyeSize)

      // Рисуем зрачки
      context.fillStyle = 'red'
      context.fillRect(leftEyeX + eyeSize * 0.25, eyeY + eyeSize * 0.25, eyeSize * 0.5, eyeSize * 0.5)
      context.fillRect(rightEyeX + eyeSize * 0.25, eyeY + eyeSize * 0.25, eyeSize * 0.5, eyeSize * 0.5)

      // Рисуем рот
      context.fillStyle = 'black'
      context.beginPath()
      context.arc(
        poop.x + poop.width / 2,
        poop.y + poop.height * 0.7,
        poop.width * 0.3,
        0.1 * Math.PI,
        0.9 * Math.PI,
        false,
      )
      context.fill()

      // Рисуем зубы
      context.fillStyle = 'white'
      const teethWidth = poop.width * 0.08
      const teethHeight = poop.height * 0.08
      const teethY = poop.y + poop.height * 0.65

      // Рисуем 3 зуба
      for (let i = 0; i < 3; i++) {
        const teethX = poop.x + poop.width * (0.35 + i * 0.15)
        context.fillRect(teethX, teethY, teethWidth, teethHeight)
      }

    } else {
      // Рисуем обычную какашку (старый код)
      context.fillStyle = '#8B4513' // Коричневый цвет
      context.fillRect(poop.x, poop.y, poop.width, poop.height)

      // Добавляем более темные точки для текстуры
      context.fillStyle = '#5D2906' // Темно-коричневый

      // Рисуем несколько случайно расположенных точек
      const numDots = 3 + Math.floor(poop.width / 5)
      for (let i = 0; i < numDots; i++) {
        const dotSize = 2 + Math.random() * 3
        const dotX = poop.x + Math.random() * (poop.width - dotSize)
        const dotY = poop.y + Math.random() * (poop.height - dotSize)
        context.fillRect(dotX, dotY, dotSize, dotSize)
      }
    }
  })
}

function updatePoops(gameObjects, deltaTime, {canvas, context}) {
  const now = Date.now()
  const {enemies, obstacles, effects} = gameObjects

  for (let i = 0; i < enemies.length; i++) {
    const poop = enemies[i]

    // Проверяем, не пора ли превратиться в монстра
    if (!poop.isMonster && now >= poop.transformAt) {
      // Превращаем какашку в монстра
      poop.isMonster = true

      // Добавляем эффект трансформации
      if (gameObjects.effects) {
        gameObjects.effects.push({
          x: poop.x + poop.width / 2,
          y: poop.y - 20,
          text: 'Ожило!',
          color: 'darkred',
          alpha: 1,
          type: 'transformText',
          createdAt: now,
          duration: 1500,
          offsetY: 0,
        })
      }

      // Увеличиваем немного размер при превращении
      const growFactor = 1.2
      poop.width *= growFactor
      poop.height *= growFactor

      // Начальная скорость для монстра
      poop.velocityX = poop.direction === 'left' ? -50 : 50

      console.log('Какашка превратилась в монстра!')
    }

    // Обновляем поведение монстра
    if (poop.isMonster) {
      // Применяем гравитацию
      if (!poop.onGround) {
        poop.velocityY += 980 * deltaTime // Гравитация
      }

      // Обновляем позицию по Y
      poop.y += poop.velocityY * deltaTime

      // Обновляем позицию по X
      poop.x += poop.velocityX * deltaTime

      // Проверка столкновения с землей и препятствиями
      poop.onGround = false

      // Проверяем столкновение с препятствиями
      for (const obstacle of obstacles) {
        // Проверка столкновения по X
        if (
          poop.x < obstacle.x + obstacle.width &&
          poop.x + poop.width > obstacle.x &&
          poop.y < obstacle.y + obstacle.height &&
          poop.y + poop.height > obstacle.y
        ) {
          // Проверка столкновения сверху (монстр стоит на препятствии)
          if (poop.y + poop.height > obstacle.y &&
            poop.y + poop.height < obstacle.y + obstacle.height / 2) {
            poop.y = obstacle.y - poop.height
            poop.velocityY = 0
            poop.onGround = true
          }
          // Проверка боковых столкновений
          else if (poop.velocityX > 0 && poop.x + poop.width > obstacle.x &&
            poop.x < obstacle.x) {
            // Столкновение справа
            poop.x = obstacle.x - poop.width
            poop.direction = 'left'
            poop.velocityX *= -1
          } else if (poop.velocityX < 0 && poop.x < obstacle.x + obstacle.width &&
            poop.x + poop.width > obstacle.x + obstacle.width) {
            // Столкновение слева
            poop.x = obstacle.x + obstacle.width
            poop.direction = 'right'
            poop.velocityX *= -1
          }
        }
      }

      // Проверка падения на землю
      if (poop.y > gameObjects.level.floorLine - poop.height) {
        poop.y = gameObjects.level.floorLine - poop.height
        poop.velocityY = 0
        poop.onGround = true
      }

      // Случайные прыжки
      poop.jumpTimer -= deltaTime

      if (poop.onGround && poop.jumpTimer <= 0) {
        // Случайный шанс прыжка
        if (Math.random() < 0.02) {
          poop.velocityY = -350 - Math.random() * 150 // Случайная сила прыжка
          poop.onGround = false
          poop.jumpTimer = 1 + Math.random() * 2 // Задержка между прыжками
        }

        // Случайный шанс изменить направление
        if (Math.random() < 0.01) {
          poop.direction = poop.direction === 'left' ? 'right' : 'left'
          poop.velocityX *= -1
        }
      }
    }
  }
}

function updateBlackCatAttack(character, enemies, delta) {
  // Если кот атакует, уменьшаем таймер атаки
  if (character.isAttacking) {
    character.attackTimer -= delta;

    // Проверяем попадание по врагам
    enemies?.forEach(enemy => {
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

      if (inAttackRange) {
        // Наносим урон врагу
        enemy.health -= character.attackDamage;

        // Визуальный эффект получения урона
        enemy.hitEffect = true;
        enemy.hitTimer = 200; // длительность эффекта
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
