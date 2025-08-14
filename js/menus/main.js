import {GAME_STATE} from '../states/game'

export function initMainMenu(gameObjects) {
  const handleSpaceClick = (event) => {
    if (event.code === 'Space') {
      gameObjects[GAME_STATE.MENU].input.space = true
    }
  }
  document.addEventListener('keydown', handleSpaceClick)

  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      gameObjects[GAME_STATE.MENU].input.space = false
      document.removeEventListener('keydown', handleSpaceClick)
    }
  })
}

export function renderMainMenu(canvas, context) {
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'white';
  context.font = '30px Arial';
  context.fillText('JS13K 2025: Meow & Shadow', canvas.width / 2 - 175, canvas.height / 2 - 30);
  context.fillText('Нажмите пробел, чтобы начать', canvas.width / 2 - 200, canvas.height / 2 + 30);
}

export function updateMainMenu(gameObjects, GameState, canvas) {
  if (gameObjects.input.space) {
    gameObjects.input.space = false;
    GameState.currentState = GAME_STATE.LEVEL1;
  }
}