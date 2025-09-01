import {loadLevel} from '../states/game'

export function initMenuScreen(gameState) {
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
}

export function updateMenuScreen({ redirectScreen, gameStates, kontra }) {
  const { gameObjects, GameState, PlayerState } = gameStates;
  const { Sprite, canvas } = kontra;
  if (GameState.input.space) {
    GameState.input.space = false;

    Object.assign(PlayerState, {
      activeCat: 'white',
      white:{lives: 0, size: 1},
      black:{lives: 10, size: 1},
    })

    loadLevel({ gameObjects, PlayerState, GameState }, { Sprite, canvas})

    GameState.currentState = redirectScreen;
    GameState.nextLevel = redirectScreen;
  }
}