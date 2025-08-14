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
    x: 0,
    y: CANVAS.height - 12,
    width: 5,
    height: 10,
    color: 'white',
  })
  gameObjects[GAME_STATE.LEVEL1].black = Sprite({
    x: 0,
    y: CANVAS.height - 12,
    width: 5,
    height: 10,
    color: 'white',
  })
}

export function renderLevel1 (gameObjects, playerState) {
  gameObjects.white.render()
  gameObjects.black.render()
}