import { init, Sprite, collides } from './engine/kontra.min.mjs'

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


  document.addEventListener('keyup', (event) => {
    if (event.code === 'KeyM') {
      GameState.musicEnabled = !GameState.musicEnabled
    }

    if (event.code === 'KeyP') {
      GameState.paused = !GameState.paused
    }
  })

  const gameLoop = new GameLoop({
    update: (deltaTime) => gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite, collides),
    render: () => gameLoopRenderMethod(gameObjects, {GameState, PlayerState}, canvas, context),
  })

  gameLoop.start();
}
startGame()