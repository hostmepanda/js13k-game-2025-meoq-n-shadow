export const GAME_STATE = {
  MENU: 'm',
  LEVEL1: 'l1',
  LEVEL2: 'l2',
  LEVEL3: 'l3',
  LEVEL4: 'l4',
  GAMEOVER: 'go',
  VICTORYWHITE: 'vw',
  VICTORYBLACK: 'vb',
}

export const CANVAS = {
  width: 800,
  height: 400,
}


export const GameState = {
  currentState: GAME_STATE.MENU,
  nextLevel: GAME_STATE.MENU,
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
  }
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
