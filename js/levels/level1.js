import {CANVAS, GAME_STATE} from '../states/game'
import {initKeyboardControls} from '../gameHelpers/keyboard'

export function level1Init (gameObjects, playerState, Sprite) {
  const levelState = {
    level: {
      floorLine: CANVAS.height - 20,
    },
    boss: {
      health: 100,
    },
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
    onGround: true,
    alpha: 1.0, // для прозрачности

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
  })
// Инициализация состояния игрока
  playerState.activeCharacter = 'white'; // По умолчанию активен белый персонаж

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

}

export function renderLevel1 (gameObjects, playerState, { canvas, context }) {
  const {
    white,
    black,
    enemies,
    backgrounds,
    obstacles,
    boss,
    exit,
  } = gameObjects[GAME_STATE.LEVEL1]

  // Рендерим фон с закатом первым, чтобы он был на заднем плане
  if (backgrounds && backgrounds.sunset) {
    // Получаем контекст из CANVAS
    backgrounds.sunset.render(context);
  }


  white.render()
  black.render()
}

export function updateLevel1(gameObjects, playerState, { canvas, context }, deltaTime) {
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
  if (playerState.activeCharacter === undefined) {
    playerState.activeCharacter = 'white'; // По умолчанию выбран белый персонаж
  }

  // Обработка переключения персонажа по нажатию Shift
  if (keyboard.isKeyPressed('ShiftLeft') || keyboard.isKeyPressed('ShiftRight')) {
    // Используем debounce, чтобы предотвратить многократное переключение при удержании
    if (!playerState.lastShiftTime || Date.now() - playerState.lastShiftTime > 300) {
      playerState.activeCharacter = playerState.activeCharacter === 'white' ? 'black' : 'white';
      playerState.lastShiftTime = Date.now();
      console.log(`Переключились на ${playerState.activeCharacter} персонажа`);
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
  const activeCharacter = playerState.activeCharacter === 'white' ? white : black;

  // Управление активным персонажем
  if (keyboard.isKeyPressed('KeyW') && activeCharacter.onGround) {
    activeCharacter.velocityY = activeCharacter.jumpForce || JUMP_FORCE;
    activeCharacter.isJumping = true;
    activeCharacter.onGround = false;
    console.log(`${playerState.activeCharacter} прыгает!`);
  }

  if (keyboard.isKeyPressed('KeyA')) {
    activeCharacter.x -= MOVE_SPEED * deltaTime;
  }
  if (keyboard.isKeyPressed('KeyD')) {
    activeCharacter.x += MOVE_SPEED * deltaTime;
  }

  // Визуальное обозначение активного персонажа
  white.alpha = playerState.activeCharacter === 'white' ? 1.0 : 0.7;
  black.alpha = playerState.activeCharacter === 'black' ? 1.0 : 0.7;
}