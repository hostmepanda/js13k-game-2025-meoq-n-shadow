import {GAME_STATE} from '../states/game'
import {renderLevel1} from '../levels/level1'
import {renderMainMenu} from '../menus/main'

export function gameLoopRenderMethod(gameObjects, { GameState, PlayerState }, canvas, context) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      renderMainMenu(canvas, context)
      break
    case GAME_STATE.LEVEL1:
      renderLevel1(gameObjects, {GameState, PlayerState}, { canvas, context })
      break
  }
}