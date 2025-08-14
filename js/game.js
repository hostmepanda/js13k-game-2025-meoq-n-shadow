// TODO: import from kontra.min.mjs to reduce size before bundling for prod
import { init, Sprite, GameLoop } from './engine/kontra.mjs'

import {gameLoopUpdateMethod} from './gameHelpers/update'
import {gameLoopRenderMethod} from './gameHelpers/render'

const { canvas, context } = init();

(() => {
  new GameLoop({
    update: gameLoopUpdateMethod,
    render: gameLoopRenderMethod,
  })
  .start();
})()