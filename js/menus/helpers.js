import {GAME_STATE} from '../consts'
import {setLevels} from '../states/game'

export function initMenuScreen({selectedScreen, gameStates }) {
  const { gameObjects } = gameStates;
  const handleSpaceClick = (event) => {
    if (event.code === 'Space') {
      gameObjects[selectedScreen].input.space = true
    }
  }
  document.addEventListener('keydown', handleSpaceClick)

  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      gameObjects[selectedScreen].input.space = false
      document.removeEventListener('keydown', handleSpaceClick)
    }
  })
}

export function updateMenuScreen({ redirectScreen, gameStates, kontra }) {
  const { gameObjects, GameState, PlayerState } = gameStates;
  const { Sprite, canvas } = kontra;
  if (gameObjects.input.space) {
    gameObjects.input.space = false;

    Object.assign(PlayerState, {
      activeCat: 'white',
      white:{lives: 0, size: 1},
      black:{lives: 10, size: 1},
    })

    // Чистим старые уровни
    ;[GAME_STATE.LEVEL1, GAME_STATE.LEVEL2, GAME_STATE.LEVEL3, GAME_STATE.LEVEL4].forEach(level => {
      delete gameObjects[level]
    })

    setLevels({ gameObjects, PlayerState, GameState }, { Sprite, canvas})

    GameState.currentState = redirectScreen;
    GameState.nextLevel = redirectScreen;
  }
}