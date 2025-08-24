import {GAME_STATE} from '../states/game'
import {updateMainMenu} from '../menus/main'
import {updateLevel} from '../levels/levelHelpers'

export function gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      updateMainMenu(gameObjects[GAME_STATE.MENU], {GameState, PlayerState}, canvas)
      break
    case GAME_STATE.LEVEL1:
    case GAME_STATE.LEVEL2:
    case GAME_STATE.LEVEL3:
    case GAME_STATE.LEVEL4:
      console.log(GameState.currentState)
      updateLevel(GameState.currentState)(gameObjects[GameState.currentState], {GameState, PlayerState}, {canvas, context}, deltaTime, Sprite)
      break
  }
}
