// TODO: import from kontra.min.mjs to reduce size before bundling for prod
import { init, Sprite, collides } from './engine/kontra.mjs'

import {GameState as defaultGameState, loadLevel} from './states/game'
import {GameLoop} from './gameHelpers/loop'
import {PlayerState as defaultPlayerState } from './states/player'
import {gameLoopRenderMethod} from './gameHelpers/render'
import {gameLoopUpdateMethod} from './gameHelpers/update'
import {GAME_STATE} from './consts'

function startGame() {
  const { canvas, context } = init();

  const {
    gameObjects,
    GameState,
    PlayerState,
  } = loadLevel(GAME_STATE.LEVEL1, { gameObjects: {}, PlayerState: defaultPlayerState, GameState: defaultGameState }, { Sprite, canvas})

  const gameLoop = new GameLoop({
    update: (deltaTime) => gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite, collides),
    render: () => gameLoopRenderMethod(gameObjects, {GameState, PlayerState}, canvas, context),
  })

  gameLoop.start();
}
startGame()