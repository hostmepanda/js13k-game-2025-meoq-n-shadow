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
  })
  gameObjects[GAME_STATE.LEVEL1].black = Sprite({
    x: 40,
    y: CANVAS.height - 12 - 40,
    width: 40,
    height: 40,
    color: 'black',
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

  const keyboard = initKeyboardControls();

  // Биндим клавиши для управления белым персонажем
  keyboard.bindKey('KeyW', 'pressed', () => {
    gameObjects[GAME_STATE.LEVEL1].white.y -= 5; // Движение вверх
  });

  keyboard.bindKey('KeyS', 'pressed', () => {
    gameObjects[GAME_STATE.LEVEL1].white.y += 5; // Движение вниз
  });

  keyboard.bindKey('KeyA', 'pressed', () => {
    gameObjects[GAME_STATE.LEVEL1].white.x -= 5; // Движение влево
  });

  keyboard.bindKey('KeyD', 'pressed', () => {
    gameObjects[GAME_STATE.LEVEL1].white.x += 5; // Движение вправо
  });

  // Биндим клавиши для управления черным персонажем
  keyboard.bindKey('ArrowUp', 'pressed', () => {
    gameObjects[GAME_STATE.LEVEL1].black.y -= 5; // Движение вверх
  });

  keyboard.bindKey('ArrowDown', 'pressed', () => {
    gameObjects[GAME_STATE.LEVEL1].black.y += 5; // Движение вниз
  });

  keyboard.bindKey('ArrowLeft', 'pressed', () => {
    gameObjects[GAME_STATE.LEVEL1].black.x -= 5; // Движение влево
  });

  keyboard.bindKey('ArrowRight', 'pressed', () => {
    gameObjects[GAME_STATE.LEVEL1].black.x += 5; // Движение вправо
  });

  // Сохраняем контроллер клавиатуры для доступа из других функций
  gameObjects[GAME_STATE.LEVEL1].keyboard = keyboard;


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

export function updateLevel1 (gameObjects, playerState, { canvas, context }) {
  const {
    white,
    black,
    enemies,
    backgrounds,
    obstacles,
    boss,
    exit,
    keyboard,
  } = gameObjects[GAME_STATE.LEVEL1]

  if (keyboard.isKeyPressed('KeyW')) {
    white.y -= 200 * deltaTime; // Скорость * время
  }

  if (keyboard.isKeyPressed('KeyS')) {
    white.y += 200 * deltaTime;
  }
}