// TODO: import from kontra.min.mjs to reduce size before bundling for prod
import { init, Sprite } from './engine/kontra.mjs'

import {GAME_STATE, GameState} from './states/game'
import {GameLoop} from './gameHelpers/loop'
import {PlayerState} from './states/player'
import {gameLoopRenderMethod} from './gameHelpers/render'
import {gameLoopUpdateMethod} from './gameHelpers/update'
import {gameObjects} from './states/objects'
import {levelInit} from './levels/levelHelpers'
import {initMenuScreen} from './menus/helpers'

(() => {
  const { canvas, context } = init();
  const menuScreens = [
    GAME_STATE.MENU,
    GAME_STATE.GAMEOVER,
    GAME_STATE.VICTORYBLACK,
    GAME_STATE.VICTORYWHITE,
  ]
  const levels = [
    GAME_STATE.LEVEL1,
    GAME_STATE.LEVEL2,
    GAME_STATE.LEVEL3,
    GAME_STATE.LEVEL4,
  ]

  menuScreens.forEach(screenName => initMenuScreen(screenName)(gameObjects))

  levels.forEach(level =>
    levelInit(level)(
      {PlayerState, GameState, gameObjects},
      {Sprite, canvas},
    ),
  )

  new GameLoop({
    update: (deltaTime) => gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite),
    render: () => gameLoopRenderMethod(gameObjects, {GameState, PlayerState}, canvas, context),
  })
  .start();
})()