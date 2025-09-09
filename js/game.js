import { init, Sprite, collides } from './engine/kontra.min.mjs'

import {GameState as defaultGameState, loadLevel} from './states/game'
import {GameLoop} from './gameHelpers/loop'
import {PlayerState as defaultPlayerState } from './states/player'
import {gameLoopRenderMethod} from './gameHelpers/render'
import {gameLoopUpdateMethod} from './gameHelpers/update'
import {GAME_STATE} from './consts'
import {createWallpaperPattern} from './gameHelpers/backgroundHelpers'

const levelBackground = {
  [GAME_STATE.LEVEL1]: {
    layers:[
      { speed: 1, alpha: 1 },
      { speed: 1, alpha: 1 },
      { speed: 1, alpha: 1 },
    ],
    tileSize: 390,
    patterns: [
      {
        style: 'stripes',
        tileSize: 390,
        bgColor: 'rgba(115,65,0,0.85)',
        fgColor: 'rgb(255,228,116)',
        accentColor: 'rgb(244,244,244)',
        scale: 2
      },{
        scale: 2,
        tileSize: 390,
        style: 'stripes',
        bgColor: 'rgba(255,236,156,0.38)',
        fgColor: 'rgba(124,98,0,0.18)',
        accentColor: 'rgb(244,244,244)',
      },{
        bgColor: 'rgba(255,227,53,0.41)',
        accentColor: 'rgba(255,0,0,0.31)',
        tileSize: 390,
        scale: 3,
        style: 'damask',
        fgColor: 'rgba(246,255,167,0.13)',
      }
    ],
  },
  [GAME_STATE.LEVEL2]: {
    tileSize: 390,
    layers:[
      { speed: 1, alpha: 1 },
      { speed: 1, alpha: 1 },
      { speed: 1, alpha: 1 },
    ],
    patterns: [
      {
        style: 'dots',
        tileSize: 100,
        bgColor: 'rgba(0,45,76,0.66)',
        fgColor: 'rgba(255,255,255,0.66)',
        accentColor: 'rgba(0,45,76,0.66)',
        scale: 15,
      },{
        scale: 45,
        tileSize: 100,
        style: 'damask',
        bgColor: 'rgba(0,17,25,0.66)',
        fgColor: 'rgba(0,17,25,0.66)',
        accentColor: 'rgb(255,201,201)',
      },{
        bgColor: 'rgba(255,227,53,0.11)',
        accentColor: 'rgb(255,227,53)',
        tileSize: 85,
        scale: 30,
        style: 'damask',
        fgColor: 'rgba(255,227,53,0.47)',
      }
    ],
  }
}

function startGame() {
  const { canvas, context } = init();

  const levelBackgroundPatterns = [GAME_STATE.LEVEL1, GAME_STATE.LEVEL2].map(
    (level) => ({
      layers:[{ speed: 1, alpha: 1 }, { speed: 1, alpha: 1 }, { speed: 1, alpha: 1 }],
      tileSize: 390,
      patternTiles: levelBackground[level].patterns.map((patterSchema) => createWallpaperPattern(context, patterSchema))
    })
  )

  const {
    gameObjects,
    GameState,
    PlayerState,
  } = loadLevel(GAME_STATE.LEVEL1, { gameObjects: {}, PlayerState: defaultPlayerState, GameState: defaultGameState }, { Sprite, canvas}, levelBackgroundPatterns)

  document.addEventListener('keyup', (event) => {
    if (event.code === 'KeyM') {
      GameState.musicEnabled = !GameState.musicEnabled
    }

    if (event.code === 'KeyP') {
      GameState.paused = !GameState.paused
    }
  })

  const gameLoop = new GameLoop({
    update: (deltaTime) => gameLoopUpdateMethod(gameObjects, {GameState, PlayerState}, canvas, context, deltaTime, Sprite, collides, levelBackgroundPatterns),
    render: () => gameLoopRenderMethod(gameObjects, {GameState, PlayerState}, canvas, context, levelBackgroundPatterns),
  })

  gameLoop.start();
}
startGame()