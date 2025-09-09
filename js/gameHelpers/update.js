import {updateLevel} from '../levels/levelHelpers'
import {initMenuScreen, updateMenuScreen} from '../menus/helpers'
import {GAME_STATE} from '../consts'
import {loadLevel} from '../states/game'
import {playLevelMusic, stopLevelMusic} from '../sound/sounds'

export async function gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite, collides, levelBackgroundPatterns) {
  if (GameState.musicEnabled) {
    await playLevelMusic(GameState.currentState, GameState)
  } else {
    await stopLevelMusic(GameState)
  }

  switch (GameState.currentState) {
    case GAME_STATE.LEVEL1:
    case GAME_STATE.LEVEL2:
    case GAME_STATE.LEVEL3:
    case GAME_STATE.LEVEL4:
      if (GameState.paused) {

      } else {
        updateLevel(
          {
            gameStates: {gameObjects, GameState, PlayerState},
            kontra: {canvas, context, deltaTime, Sprite, collides},
          }, levelBackgroundPatterns)
      }
      break
    case GAME_STATE.MENU:
      initMenuScreen(GameState, canvas)

      updateMenuScreen({
        redirectScreen: GameState.currentState === GAME_STATE.MENU ? GAME_STATE.LEVEL1 : GAME_STATE.MENU,
        gameStates: {gameObjects: gameObjects, GameState, PlayerState},
        kontra: {Sprite, canvas}
      }, levelBackgroundPatterns)
      break
    case GAME_STATE.GAMEOVER:
    case GAME_STATE.VICTORYBLACK:
    case GAME_STATE.VICTORYWHITE:
      initMenuScreen(GameState)

      updateMenuScreen({
        redirectScreen: GameState.currentState === GAME_STATE.MENU ? GAME_STATE.LEVEL1 : GAME_STATE.MENU,
        gameStates: {gameObjects: gameObjects, GameState, PlayerState},
        kontra: {Sprite, canvas}
      })

      gameObjects.black = null
      gameObjects.white = null
      gameObjects.exit = null
      gameObjects.start = null
      gameObjects.keyboard = {}
      gameObjects.backgrounds = {}
      gameObjects.level = {}
      gameObjects.obstacles = []
      gameObjects.collectables = []
      gameObjects.enemies = []
      gameObjects.effects = []

      const updatedStates = loadLevel(GAME_STATE.LEVEL1, { gameObjects: {} }, { Sprite, canvas}, levelBackgroundPatterns)

      Object.assign(gameObjects, updatedStates.gameObjects)
      Object.assign(PlayerState, updatedStates.PlayerState)
      break
  }
}
