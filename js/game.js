// TODO: import from kontra.min.mjs to reduce size before bundling for prod
import { init, Sprite } from './engine/kontra.mjs'

import {GAME_STATE, GameState} from './states/game'
import {GameLoop} from './gameHelpers/loop'
import {PlayerState} from './states/player'
import {gameLoopRenderMethod} from './gameHelpers/render'
import {gameLoopUpdateMethod} from './gameHelpers/update'
import {gameObjects} from './states/objects'
import {initMainMenu} from './menus/main'
import {levelInit} from './levels/utils'

(() => {
  const { canvas, context } = init();
  const levels = [
    GAME_STATE.LEVEL1,
    // GAME_STATE.LEVEL2,
    // GAME_STATE.LEVEL3,
    // GAME_STATE.LEVEL4,
  ]

  initMainMenu(gameObjects)

  levels.forEach(level => {
      const levelInitHandler = levelInit(level)
      levelInitHandler(
        {PlayerState, GameState, gameObjects},
        {Sprite, canvas},
      )
    },
  )

  new GameLoop({
    update: (deltaTime) => gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite),
    render: () => gameLoopRenderMethod(gameObjects, {GameState, PlayerState}, canvas, context),
  })
  .start();
})()