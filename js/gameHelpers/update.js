import {updateLevel} from '../levels/levelHelpers'
import {initMenuScreen, updateMenuScreen} from '../menus/helpers'
import {GAME_STATE} from '../consts'

export function gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite) {
  switch (GameState.currentState) {
    case GAME_STATE.MENU:
      initMenuScreen(GameState.currentState)(gameObjects)
      updateMenuScreen(GAME_STATE.LEVEL1,{ Sprite, canvas })({ gameObjects: gameObjects[GAME_STATE.MENU], GameState, PlayerState})
      break
    case GAME_STATE.LEVEL1:
    case GAME_STATE.LEVEL2:
    case GAME_STATE.LEVEL3:
    case GAME_STATE.LEVEL4:
      console.log(gameObjects[GameState.currentState].white.x, gameObjects[GameState.currentState].white.y)
      updateLevel(GameState.currentState)({ gameObjects, GameState, PlayerState}, {canvas, context}, deltaTime, Sprite)
      break
    case GAME_STATE.GAMEOVER:
    case GAME_STATE.VICTORYBLACK:
    case GAME_STATE.VICTORYWHITE:
      initMenuScreen(GameState.currentState)(gameObjects)
      updateMenuScreen(GAME_STATE.MENU,{ Sprite, canvas })({ gameObjects: gameObjects[GameState.currentState], GameState, PlayerState})
      break
  }
}
