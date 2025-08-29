import {updateLevel} from '../levels/levelHelpers'
import {initMenuScreen, updateMenuScreen} from '../menus/helpers'
import {GAME_STATE} from '../consts'

export function gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      initMenuScreen({selectedScreen: GameState.currentState, gameStates: {gameObjects} })
      updateMenuScreen({
        redirectScreen: GAME_STATE.LEVEL1,
        gameStates: {gameObjects: gameObjects[GAME_STATE.MENU], GameState, PlayerState},
        kontra: {Sprite, canvas}
      })
      break
    case GAME_STATE.LEVEL1:
    case GAME_STATE.LEVEL2:
    case GAME_STATE.LEVEL3:
    case GAME_STATE.LEVEL4:
      updateLevel(
        {
          selectedLevel: GameState.currentState,
          gameStates: {gameObjects, GameState, PlayerState},
          kontra: {canvas, context, deltaTime, Sprite},
        })
      break
    case GAME_STATE.GAMEOVER:
    case GAME_STATE.VICTORYBLACK:
    case GAME_STATE.VICTORYWHITE:
      initMenuScreen({selectedScreen: GameState.currentState, gameStates: {gameObjects} })
      updateMenuScreen({
        redirectScreen: GAME_STATE.MENU,
        gameStates: {gameObjects: gameObjects[GameState.currentState], GameState, PlayerState},
        kontra: {Sprite, canvas}
      })
      break
  }
}
