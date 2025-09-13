import {updateLevel} from '../levels/levelHelpers'
import {initMenuScreen, updateMenuScreen} from '../menus/helpers'
import {GAME_STATE} from '../consts'
import {loadLevel} from '../states/game'
// import {playLevelMusic, stopLevelMusic} from '../sound/sounds'

export async function gameLoopUpdateMethod(go, {GameState, PlayerState}, cs, cx, deltaTime, Sprite, collides, levelBackgroundPatterns) {
  if (GameState.musicEnabled) {
    // await playLevelMusic(GameState.currentState, GameState)
  } else {
    // await stopLevelMusic(GameState)
  }

  switch (GameState.currentState) {
    case GAME_STATE.LEVEL1:
    case GAME_STATE.LEVEL2:
    case GAME_STATE.LEVEL3:
      if (GameState.paused) {

      } else {
        updateLevel(
          {
            gameStates: {gameObjects: go, GameState, PlayerState},
            kontra: {canvas: cs, context: cx, deltaTime, Sprite, collides},
          }, levelBackgroundPatterns)
      }
      break
    case GAME_STATE.MENU:
      initMenuScreen(GameState, cs)

      updateMenuScreen({
        redirectScreen: GameState.currentState === GAME_STATE.MENU ? GAME_STATE.LEVEL1 : GAME_STATE.MENU,
        gameStates: {gameObjects: go, GameState, PlayerState},
        kontra: {Sprite, canvas: cs}
      }, levelBackgroundPatterns)
      break
    case GAME_STATE.GAMEOVER:
    case GAME_STATE.VICTORYBLACK:
    case GAME_STATE.VICTORYWHITE:
      initMenuScreen(GameState)

      updateMenuScreen({
        redirectScreen: GameState.currentState === GAME_STATE.MENU ? GAME_STATE.LEVEL1 : GAME_STATE.MENU,
        gameStates: {gameObjects: go, GameState, PlayerState},
        kontra: {Sprite, canvas: cs}
      })

      go.black = null
      go.white = null
      go.exit = null
      go.start = null
      go.keyboard = {}
      go.backgrounds = {}
      go.level = {}
      go.obstacles = []
      go.collectables = []
      go.enemies = []
      go.effects = []

      const updatedStates = loadLevel(GAME_STATE.LEVEL1, { gameObjects: {} }, { Sprite, canvas: cs}, levelBackgroundPatterns)

      Object.assign(go, updatedStates.gameObjects)
      Object.assign(PlayerState, updatedStates.PlayerState)
      break
  }
}
