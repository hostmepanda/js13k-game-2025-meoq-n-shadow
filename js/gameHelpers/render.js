import {renderMainMenu} from '../menus/main'
import {levelRender} from '../levels/levelHelpers'
import {renderGameOver} from '../menus/gameOver'
import {renderVictoryBlack} from '../menus/victroryBlack'
import {renderVictoryWhite} from '../menus/victoryWhite'
import {GAME_STATE} from '../consts'

export function gameLoopRenderMethod(gameObjects, { GameState, PlayerState }, canvas, context) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      renderMainMenu(canvas, context, GameState)
      break
    case GAME_STATE.LEVEL1:
    case GAME_STATE.LEVEL2:
    case GAME_STATE.LEVEL3:
    case GAME_STATE.LEVEL4:
      levelRender({
        gameData: {gameObjects, GameState, PlayerState},
        kontra: {canvas, context},
      })
      break
    case GAME_STATE.GAMEOVER:
      renderGameOver(canvas, context)
      break
    case GAME_STATE.VICTORYBLACK:
      renderVictoryBlack(canvas, context)
      break
    case GAME_STATE.VICTORYWHITE:
      renderVictoryWhite(canvas, context)
      break
  }
}