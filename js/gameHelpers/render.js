import {GAME_STATE} from '../states/game'
import {renderMainMenu} from '../menus/main'
import {levelRender} from '../levels/levelHelpers'
import {renderGameOver} from '../menus/gameOver'
import {renderVictoryBlack} from '../menus/victroryBlack'
import {renderVictoryWhite} from '../menus/victoryWhite'

export function gameLoopRenderMethod(gameObjects, { GameState, PlayerState }, canvas, context) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      renderMainMenu(canvas, context)
      break
    case GAME_STATE.LEVEL1:
    case GAME_STATE.LEVEL2:
    case GAME_STATE.LEVEL3:
    case GAME_STATE.LEVEL4:
      levelRender(GameState.currentState)(gameObjects, {GameState, PlayerState}, { canvas, context })
      break
    case GAME_STATE.GAMEOVER:
      renderGameOver(canvas, context)
      break
    case GAME_STATE.VICTORYBLACK:
      renderVictoryWhite(canvas, context)
      break
    case GAME_STATE.VICTORYWHITE:
      renderVictoryBlack(canvas, context)
      break
  }
}