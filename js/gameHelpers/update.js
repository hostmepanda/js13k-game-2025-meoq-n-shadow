import {GAME_STATE} from '../states/game'
import {updateMainMenu} from '../menus/main'

export function gameLoopUpdateMethod(gameObjects, GameState, canvas) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      updateMainMenu(gameObjects[GAME_STATE.MENU], GameState, canvas)
      break
    case GAME_STATE.LEVEL1:
      break
  }
}