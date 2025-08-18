import {CANVAS, GAME_STATE, GameState, updateCamera} from '../states/game'
import {initKeyboardControls} from '../gameHelpers/keyboard'

export function level1Init (gameObjects, { PlayerState, GameState }, Sprite, {canvas}) {
  const levelState = {
    level: {
      floorLine: CANVAS.height - 20,
      levelWidth: canvas.width * 7,
      levelHeight: canvas.height,

    },
    boss: {
      health: 100,
    },
  }
  GameState.camera.levelBounds = {
    minX: 0,
    maxX: levelState.level.levelWidth - CANVAS.width,
    minY: 0,
    maxY: levelState.level.levelHeight - CANVAS.height
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
  })

// Инициализация состояния игрока
  PlayerState.activeCharacter = 'white'; // По умолчанию активен белый персонаж

  // Инициализируем backgrounds, если его еще нет
  gameObjects[GAME_STATE.LEVEL1].backgrounds = gameObjects[GAME_STATE.LEVEL1].backgrounds || {};

  // Создаем объект фона с градиентом заката
  gameObjects[GAME_STATE.LEVEL1].backgrounds.sunset = {
    render: function(ctx) {
      // Создаем градиент от верха к низу
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS.height);

      // Добавляем цвета заката (темно-синий -> фиолетовый -> оранжевый -> желтый)
      gradient.addColorStop(0, '#1a2b56');    // Темно-синий (верх неба)
      gradient.addColorStop(0.4, '#864d9e');  // Фиолетовый
      gradient.addColorStop(0.7, '#dd5e5e');  // Оранжево-красный
      gradient.addColorStop(0.9, '#f9d423');  // Желтый (у горизонта)

      // Заполняем фон градиентом
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
    }
  };

  gameObjects[GAME_STATE.LEVEL1].keyboard = initKeyboardControls()
  gameObjects[GAME_STATE.LEVEL1].level = levelState.level
  gameObjects[GAME_STATE.LEVEL1].boss = levelState.boss

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
        type: 'sizeFood' // Тип: еда для увеличения размера
      });
    }
  }

}

export function renderLevel1 (gameObjects, {PlayerState}, { canvas, context }) {
  const {
    white,
    black,
    enemies,
    backgrounds,
    obstacles,
    boss,
    exit,
  } = gameObjects[GAME_STATE.LEVEL1]

  function renderWithCamera(context, camera, drawFunction) {
    context.save();

    // Смещаем всё на отрицательное положение камеры
    context.translate(-camera.x, -camera.y);

    // Выполняем функцию отрисовки
    drawFunction(context);

    context.restore();
  }
  function renderBackground(context, canvas, camera) {
    // Градиентный фон, если нет изображения
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F7FA');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Очищаем весь холст
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Отрисовываем фон с учетом камеры
  renderBackground(context, canvas, GameState.camera);

  // Отрисовываем все объекты с учетом положения камеры
  renderWithCamera(context, GameState.camera, (ctx) => {
    // Отрисовка всех игровых объектов

    // Например, отрисовка земли
    ctx.fillStyle = 'brown';
    ctx.fillRect(0, canvas.height - 20, canvas.width * 7, 20);

    if (gameObjects[GAME_STATE.LEVEL1].collectables.length > 0) {
      renderFoodItems(context, gameObjects[GAME_STATE.LEVEL1].collectables)
    }

    white.render()
    black.render()
  });

  // Интерфейс поверх всего (без смещения камеры)
  // renderUI(context, playerState);
}

export function updateLevel1(gameObjects, {GameState, PlayerState}, { canvas, context }, deltaTime) {
  const {
    white,
    black,
    enemies,
    backgrounds,
    obstacles,
    boss,
    exit,
    keyboard,
  } = gameObjects;

  // Проверяем наличие объектов
  if (!white || !black) {
    console.error('Персонажи не определены!');
    return;
  }

  // Создаем obstacles, если его нет
  if (!obstacles || obstacles.floorLine === undefined) {
    if (!gameObjects.obstacles) {
      gameObjects.obstacles = {};
    }
    gameObjects.obstacles.floorLine = canvas.height - 20;
    console.warn(`Создан floorLine на уровне ${gameObjects.obstacles.floorLine}`);
  }

  // Инициализируем состояние для активного персонажа, если его нет
  if (PlayerState.activeCharacter === undefined) {
    PlayerState.activeCharacter = 'white'; // По умолчанию выбран белый персонаж
  }

  // Обработка переключения персонажа по нажатию Shift
  if (keyboard.isKeyPressed('ShiftLeft') || keyboard.isKeyPressed('ShiftRight')) {
    // Используем debounce, чтобы предотвратить многократное переключение при удержании
    if (!PlayerState.lastShiftTime || Date.now() - PlayerState.lastShiftTime > 300) {
      PlayerState.activeCharacter = PlayerState.activeCharacter === 'white' ? 'black' : 'white';
      PlayerState.lastShiftTime = Date.now();
      console.log(`Переключились на ${PlayerState.activeCharacter} персонажа`);
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
    if (!character.onGround) {
      // Если персонаж движется вверх (отрицательная скорость Y)
      if (character.velocityY < 0) {
        character.velocityY += GRAVITY_UP * deltaTime
      } else {
        // Если персонаж движется вниз (положительная скорость Y)
        character.velocityY += GRAVITY_DOWN * deltaTime
      }

      // Ограничиваем максимальную скорость падения
      if (character.velocityY > MAX_FALL_SPEED) {
        character.velocityY = MAX_FALL_SPEED
      }
    }

    // Применяем вертикальную скорость
    character.y += character.velocityY * deltaTime

    // Проверяем приземление
    if (character.y >= obstacles.floorLine - character.height) {
      character.y = obstacles.floorLine - character.height
      character.velocityY = 0
      character.onGround = true
      character.isJumping = false
    }

    // Ограничиваем верхнюю границу
    if (character.y < 0) {
      character.y = 0
      character.velocityY = 0
    }
  }


  // Обновляем физику для обоих персонажей
  updateCharacterPhysics(white);
  updateCharacterPhysics(black);

  // Получаем активного персонажа
  const activeCharacter = PlayerState.activeCharacter === 'white' ? white : black;

  // Управление активным персонажем
  if (keyboard.isKeyPressed('KeyW') && activeCharacter.onGround) {
    activeCharacter.velocityY = activeCharacter.jumpForce || JUMP_FORCE;
    activeCharacter.isJumping = true;
    activeCharacter.onGround = false;
    console.log(`${PlayerState.activeCharacter} прыгает!`);
  }
  const currentMoveSpeed = activeCharacter.moveSpeed || MOVE_SPEED;

  if (keyboard.isKeyPressed('KeyA')) {
    activeCharacter.x -= currentMoveSpeed * deltaTime;
  }
  if (keyboard.isKeyPressed('KeyD')) {
    activeCharacter.x += currentMoveSpeed * deltaTime;
  }

  // Проверка столкновений с едой для белого кота
  checkFoodCollision(white, gameObjects.collectables);

  // Ограничиваем движение персонажей границами уровня
  white.x = Math.max(0, Math.min(white.x, canvas.width * 7 - white.width));
  black.x = Math.max(0, Math.min(black.x, canvas.width * 7 - black.width));

  updateCamera(GameState, activeCharacter);

  // Визуальное обозначение активного персонажа
  white.alpha = PlayerState.activeCharacter === 'white' ? 1.0 : 0.7;
  black.alpha = PlayerState.activeCharacter === 'black' ? 1.0 : 0.7;
}

// Функция для проверки столкновения с едой и её сбора
function checkFoodCollision(character, foodItems) {
  for (let i = 0; i < foodItems.length; i++) {
    const food = foodItems[i];

    // Пропускаем уже собранную еду
    if (food.collected) continue;

    // Проверяем столкновение с едой
    if (character.x < food.x + food.width &&
      character.x + character.width > food.x &&
      character.y < food.y + food.height &&
      character.y + character.height > food.y) {

      // Отмечаем еду как собранную
      food.collected = true;

      // Применяем эффект в зависимости от типа еды
      if (food.type === 'sizeFood' && character.color === 'white') {
        // Увеличиваем размер белого кота
        increaseCatSize(character);
      }

      // Можно добавить звуковой эффект или анимацию здесь
      console.log("Еда собрана!");

      return true;
    }
  }

  return false;
}

// Функция для увеличения размера кота
function increaseCatSize(character) {
  // Максимальный множитель размера: 4
  const MAX_SIZE_MULTIPLIER = 4;

  // Увеличиваем множитель на определенное значение
  const sizeIncrement = 0.5; // Каждая еда увеличивает размер на 50%

  // Проверяем, не достигли ли максимального размера
  if (character.sizeMultiplier < MAX_SIZE_MULTIPLIER) {
    // Запоминаем текущую позицию "ног" персонажа
    const bottomY = character.y + character.height;

    // Увеличиваем множитель размера
    character.sizeMultiplier = Math.min(MAX_SIZE_MULTIPLIER, character.sizeMultiplier + sizeIncrement);

    // Применяем новый размер
    character.width = character.originalWidth * character.sizeMultiplier;
    character.height = character.originalHeight * character.sizeMultiplier;

    // Корректируем позицию Y, чтобы "ноги" оставались на том же уровне
    character.y = bottomY - character.height;

    // Регулируем физические параметры в зависимости от размера
    // Чем больше кот, тем ниже он прыгает
    const BASE_JUMP_FORCE = -550;
    const BASE_MOVE_SPEED = 200;

    // Чем больше кот, тем ниже он прыгает
    // При размере 1 -> 100% силы прыжка
    // При размере 4 -> примерно 40% силы прыжка
    character.jumpForce = BASE_JUMP_FORCE * (1 / (1 + (character.sizeMultiplier - 1) * 0.5));

    // Чем больше кот, тем медленнее он двигается
    // При размере 1 -> 100% скорости
    // При размере 4 -> примерно 45% скорости
    character.moveSpeed = BASE_MOVE_SPEED * (1 / (1 + (character.sizeMultiplier - 1) * 0.4));


    console.log(`Кот увеличился! Новый множитель: ${character.sizeMultiplier}`);
    console.log(`Новая сила прыжка: ${character.jumpForce}, Новая скорость: ${character.moveSpeed}`);
  }
}


function renderFoodItems(context, foodItems) {
  foodItems.forEach(food => {
    // Рисуем только несобранную еду
    if (!food.collected) {
      context.fillStyle = food.color;
      context.fillRect(food.x, food.y, food.width, food.height);

      // Можно добавить эффект "свечения" для лучшей видимости
      context.shadowColor = 'rgba(0, 0, 255, 0.7)';
      context.shadowBlur = 10;
      context.fillRect(food.x, food.y, food.width, food.height);
      context.shadowBlur = 0;
    }
  });
}
