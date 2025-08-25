// TODO: import from kontra.min.mjs to reduce size before bundling for prod
import { init, Sprite } from './engine/kontra.mjs'

import {GameState, setLevels} from './states/game'
import {GameLoop} from './gameHelpers/loop'
import {PlayerState} from './states/player'
import {gameLoopRenderMethod} from './gameHelpers/render'
import {gameLoopUpdateMethod} from './gameHelpers/update'
import {gameObjects} from './states/objects'

(() => {
  const { canvas, context } = init();
  setLevels({ gameObjects, PlayerState, GameState }, { Sprite, canvas})
  new GameLoop({
    update: (deltaTime) => gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite),
    render: () => gameLoopRenderMethod(gameObjects, {GameState, PlayerState}, canvas, context),
  })
  .start();
})()