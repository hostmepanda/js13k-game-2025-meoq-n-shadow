import {CANVAS, GAME_STATE} from '../states/game'
import {initKeyboardControls} from '../gameHelpers/keyboard'

export function level1Init (gameObjects, playerState, Sprite) {
  const levelState = {
    obstacles: {
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
    jumpForce: -500, // Отрицательное значение, т.к. ось Y направлена вниз
    onGround: true,

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
    jumpForce: -500, // Отрицательное значение, т.к. ось Y направлена вниз
    onGround: true,

  })

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

  // ЗДЕСЬ привязываем клавиши - ОДИН РАЗ при инициализации
  gameObjects[GAME_STATE.LEVEL1].keyboard.bindKey('KeyW', 'pressed', () => {
    console.log("W key pressed - trying to jump");
    if (gameObjects[GAME_STATE.LEVEL1].white.onGround) {
      console.log("Jumping white!");
      gameObjects[GAME_STATE.LEVEL1].white.velocityY = gameObjects[GAME_STATE.LEVEL1].white.jumpForce;
      gameObjects[GAME_STATE.LEVEL1].white.isJumping = true;
      gameObjects[GAME_STATE.LEVEL1].white.onGround = false;
    } else {
      console.log("White not on ground, can't jump");
    }
  });

  gameObjects[GAME_STATE.LEVEL1].keyboard.bindKey('ArrowUp', 'pressed', () => {
    console.log("Arrow Up pressed - trying to jump");
    if (gameObjects[GAME_STATE.LEVEL1].black.onGround) {
      console.log("Jumping black!");
      gameObjects[GAME_STATE.LEVEL1].black.velocityY = gameObjects[GAME_STATE.LEVEL1].black.jumpForce;
      gameObjects[GAME_STATE.LEVEL1].black.isJumping = true;
      gameObjects[GAME_STATE.LEVEL1].black.onGround = false;
    } else {
      console.log("Black not on ground, can't jump");
    }
  });

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

  // Константы для физики
  const MOVE_SPEED = 200; // пикселей в секунду
  const GRAVITY = 980; // сила гравитации (пикселей в секунду в квадрате)

  // ОБРАБОТКА ФИЗИКИ ДЛЯ БЕЛОГО ПЕРСОНАЖА

  // Применяем гравитацию
  white.velocityY += GRAVITY * deltaTime;

  // Применяем вертикальную скорость к позиции
  white.y += white.velocityY * deltaTime;

  // Проверяем приземление
  if (white.y >= obstacles.floorLine - white.height) {
    white.y = obstacles.floorLine - white.height;
    white.velocityY = 0;
    white.onGround = true;
    white.isJumping = false;
  }

  // Горизонтальное движение
  if (keyboard.isKeyPressed('KeyS')) {
    white.y += MOVE_SPEED * deltaTime;
  }
  if (keyboard.isKeyPressed('KeyA')) {
    white.x -= MOVE_SPEED * deltaTime;
  }
  if (keyboard.isKeyPressed('KeyD')) {
    white.x += MOVE_SPEED * deltaTime;
  }

  // ОБРАБОТКА ФИЗИКИ ДЛЯ ЧЕРНОГО ПЕРСОНАЖА

  // Применяем гравитацию
  black.velocityY += GRAVITY * deltaTime;

  // Применяем вертикальную скорость к позиции
  black.y += black.velocityY * deltaTime;

  // Проверяем приземление
  if (black.y >= obstacles.floorLine - black.height) {
    black.y = obstacles.floorLine - black.height;
    black.velocityY = 0;
    black.onGround = true;
    black.isJumping = false;
  }

  // Горизонтальное движение
  if (keyboard.isKeyPressed('ArrowDown')) {
    black.y += MOVE_SPEED * deltaTime;
  }
  if (keyboard.isKeyPressed('ArrowLeft')) {
    black.x -= MOVE_SPEED * deltaTime;
  }
  if (keyboard.isKeyPressed('ArrowRight')) {
    black.x += MOVE_SPEED * deltaTime;
  }
}