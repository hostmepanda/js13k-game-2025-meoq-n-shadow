// TODO: import from kontra.min.mjs to reduce size before bundling for prod
import { init, Sprite, GameLoop } from './engine/kontra.mjs'

import {gameLoopUpdateMethod} from './gameHelpers/update'
import {gameLoopRenderMethod} from './gameHelpers/render'
import {level1Init} from './levels/level1'
import {gameObjects} from './states/objects'
import {PlayerState} from './states/palyer'
import {GameState} from './states/game'
import {initMainMenu} from './menus/main'

(() => {
  const { canvas, context } = init();

  initMainMenu(gameObjects)
  level1Init(gameObjects, PlayerState, Sprite)


  new GameLoop({
    update: () => gameLoopUpdateMethod(gameObjects, GameState, canvas, context),
    render: () => gameLoopRenderMethod(gameObjects, GameState, canvas, context),
  })
  .start();
})()