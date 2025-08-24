// TODO: import from kontra.min.mjs to reduce size before bundling for prod
import { init, Sprite } from './engine/kontra.mjs'

import {GAME_STATE, GameState} from './states/game'
import {GameLoop} from './gameHelpers/loop'
import {PlayerState} from './states/player'
import {gameLoopRenderMethod} from './gameHelpers/render'
import {gameLoopUpdateMethod} from './gameHelpers/update'
import {gameObjects} from './states/objects'
import {initMainMenu} from './menus/main'
import {level1Init} from './levels/level1'
import {level2Init} from './levels/level2'

(() => {
  const { canvas, context } = init();

  initMainMenu(gameObjects)

  level1Init(
    {PlayerState, GameState, gameObjects, selectedLevel: GAME_STATE.LEVEL1},
    {Sprite, canvas},
  )
  level2Init(
    {PlayerState, GameState, gameObjects, selectedLevel: GAME_STATE.LEVEL2},
    {Sprite, canvas},
  )
  // level3Init(gameObjects, {PlayerState, GameState}, { Sprite, canvas}, { selectedLevel: GAME_STATE.LEVEL1 })
  // level4Init(gameObjects, {PlayerState, GameState}, { Sprite, canvas}, { selectedLevel: GAME_STATE.LEVEL1 })


  new GameLoop({
    update: (deltaTime) => gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite),
    render: () => gameLoopRenderMethod(gameObjects, {GameState, PlayerState}, canvas, context),
  })
  .start();
})()