import {GAME_STATE} from '../states/game'
import {updateMainMenu} from '../menus/main'
import {updateLevel1} from '../levels/level1'

export function gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      updateMainMenu(gameObjects[GAME_STATE.MENU], {GameState, PlayerState}, canvas)
      break
    case GAME_STATE.LEVEL1:
      updateLevel1(gameObjects[GAME_STATE.LEVEL1], {GameState, PlayerState}, {canvas, context}, deltaTime)
      break
  }
}