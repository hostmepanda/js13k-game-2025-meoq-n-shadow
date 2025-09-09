import {createDefaultLevel, createLevel} from '../levels/levelHelpers'
import {CANVAS, GAME_STATE} from '../consts'
import {createWallpaperPattern} from '../gameHelpers/backgroundHelpers'

export const GameState = {
  currentState: GAME_STATE.MENU,
  nextLevel: GAME_STATE.MENU,
  currentlyPlayingTrack: null,
  musicNode: null,
  musicEnabled: false,
  paused: false,
  previousMusicEnabled: false,
  menuScreenListeners: {

  },
  camera: {
    x: 0, // Начальная позиция камеры по X
    y: 0, // Начальная позиция камеры по Y
    width: CANVAS.width,
    height: CANVAS.height,
    // Границы уровня
    levelBounds: {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    }
  },
  input: {
    space: false,
  },
}

// Функция для обновления положения камеры
export function updateCamera(gameState, activeCharacter) {
  // Центрируем камеру на активном персонаже
  const targetX = activeCharacter.x - gameState.camera.width / 2 + activeCharacter.width / 2;
  // Плавное следование (опционально)
  const cameraSpeed = 0.1; // Скорость движения камеры (0-1)
  gameState.camera.x += (targetX - gameState.camera.x) * cameraSpeed;

  // Ограничиваем положение камеры границами уровня
  gameState.camera.x = Math.max(
    gameState.camera.levelBounds.minX,
    Math.min(gameState.camera.x, gameState.camera.levelBounds.maxX)
  );
}

export function loadLevel(targetLevel, states, drawHelpers, levelBackgroundPatterns = {}) {
  if (![GAME_STATE.LEVEL1, GAME_STATE.LEVEL2, GAME_STATE.LEVEL3, GAME_STATE.LEVEL4].includes(targetLevel)) {
    return
  }
  if (targetLevel !== GAME_STATE.LEVEL1) {
    states.gameObjects.backgrounds.length = 0
    states.gameObjects.obstacles.length = 0
    states.gameObjects.collectables.length = 0
    states.gameObjects.enemies.length = 0
    states.gameObjects.effects.length = 0
    states.gameObjects.white = null
    states.gameObjects.black = null
  }
  states.gameObjects = createDefaultLevel()

  if (targetLevel === GAME_STATE.LEVEL1) {
    states.gameObjects.backgrounds = levelBackgroundPatterns[0]
  } else if (targetLevel === GAME_STATE.LEVEL2) {
    states.gameObjects.backgrounds = levelBackgroundPatterns[1]
  }

  return createLevel({ selectedLevel: targetLevel, gameStates: states, kontra: drawHelpers })
}