import {GAME_STATE} from '../states/game'
import {renderLevel1} from '../levels/level1'
import {renderMainMenu} from '../menus/main'

export function gameLoopRenderMethod(gameObjects, GameState, canvas, context) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      renderMainMenu(canvas, context)
      break
    case GAME_STATE.LEVEL1:
      renderLevel1(gameObjects, GameState, { canvas, context })
      break
  }
}