import {GAME_STATE} from '../states/game'
import {updateMainMenu} from '../menus/main'
import {updateLevel1} from '../levels/level1'

export function gameLoopUpdateMethod(gameObjects, GameState, canvas, context, deltaTime) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      updateMainMenu(gameObjects[GAME_STATE.MENU], GameState, canvas)
      break
    case GAME_STATE.LEVEL1:
      updateLevel1(gameObjects[GAME_STATE.LEVEL1], GameState, {canvas, context}, deltaTime)
      break
  }
}