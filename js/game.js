// TODO: import from kontra.min.mjs to reduce size before bundling for prod
import { init, Sprite, collides } from './engine/kontra.mjs'

import {gameLoopUpdateMethod} from './gameHelpers/update'
import {gameLoopRenderMethod} from './gameHelpers/render'
import {level1Init} from './levels/level1'
import {gameObjects} from './states/objects'
import {PlayerState} from './states/player'
import {GameState} from './states/game'
import {initMainMenu} from './menus/main'
import {GameLoop} from './gameHelpers/loop'

(() => {
  const { canvas, context } = init();

  initMainMenu(gameObjects)
  level1Init(gameObjects, {PlayerState, GameState}, Sprite, { canvas, context})


  new GameLoop({
    update: (deltaTime) => gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, { collides }),
    render: () => gameLoopRenderMethod(gameObjects, {GameState, PlayerState}, canvas, context),
  })
  .start();
})()