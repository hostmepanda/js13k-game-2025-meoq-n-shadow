import {loadLevel} from '../states/game'

export function initMenuScreen(gameState, canvas) {
  const handleSpaceClick = (event) => {
    if (event.code === 'Space') {
      gameState.input.space = true
    }
  }
  document.addEventListener('keydown', handleSpaceClick)

  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      gameState.input.space = false
      document.removeEventListener('keydown', handleSpaceClick)
    }
  })

  document.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Проверяем, был ли клик по тексту автора
    const halfWidth = gameState.menuScreenListeners.authorWidth / 2;
    if (y >= gameState.menuScreenListeners.authorPos.y - gameState.menuScreenListeners.authorHeight &&
      y <= gameState.menuScreenListeners.authorPos.y + 5 &&
      x >= gameState.menuScreenListeners.authorPos.x - halfWidth &&
      x <= gameState.menuScreenListeners.authorPos.x + halfWidth) {
      // Клик по тексту автора - открываем ссылку
      window.open('https://github.com/hostmepanda', '_blank');
    }
  });

}

export function updateMenuScreen({ redirectScreen, gameStates, kontra }) {
  const { gameObjects, GameState, PlayerState } = gameStates;
  const { Sprite, canvas } = kontra;
  if (GameState.input.space) {
    GameState.input.space = false;

    Object.assign(PlayerState, {
      activeCat: 'white',
      white:{lives: 10, size: 1},
      black:{lives: 10, size: 1},
    })

    loadLevel({ gameObjects, PlayerState, GameState }, { Sprite, canvas})

    GameState.currentState = redirectScreen;
    GameState.nextLevel = redirectScreen;
  }
}