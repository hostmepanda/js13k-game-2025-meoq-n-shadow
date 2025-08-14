import {CANVAS, GAME_STATE} from '../states/game'

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
}

export function renderLevel1 (gameObjects, playerState) {
  const {
    white,
    black,
    enemies,
    backgrounds,
    obstacles,
    boss,
    exit,
  } = gameObjects[GAME_STATE.LEVEL1]

  white.render()
  black.render()
}