import {renderMainMenu} from '../menus/main'
import {levelRender} from '../levels/levelHelpers'
import {renderGameOver} from '../menus/gameOver'
import {renderVictoryBlack} from '../menus/victroryBlack'
import {renderVictoryWhite} from '../menus/victoryWhite'
import {GAME_STATE} from '../consts'

export function gameLoopRenderMethod(gameObjects, { GameState, PlayerState }, canvas, context, levelBackgroundPatterns) {
    switch (GameState.currentState) {
      case GAME_STATE.MENU:
        renderMainMenu(canvas, context, GameState)
        break
      case GAME_STATE.LEVEL1:
      case GAME_STATE.LEVEL2:
      case GAME_STATE.LEVEL3:
      case GAME_STATE.LEVEL4:
        if (GameState.paused) {
          // Первый прямоугольник (чёрный)
          context.beginPath(); // Начинаем новый путь
          context.fillStyle = 'rgba(0,0,0,0.47)'
          context.rect(canvas.width / 2 - 100, canvas.height / 2 - 50, 200, 50)
          context.fill()

          context.beginPath(); // Начинаем новый путь
          context.fillStyle = PlayerState.activeCharacter === 'white' ? 'rgba(255,255,255)' : 'rgb(0,0,0)';
          context.rect(canvas.width / 2 - 98, canvas.height / 2 - 48, 198, 48)
          context.fill()

          context.fillStyle = PlayerState.activeCharacter === 'white' ? 'black' : 'white';
          context.font = '20px Arial'
          context.textAlign = 'center'
          context.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 28);
          context.font = '15px Arial'
          context.fillText('Press P to continue', canvas.width / 2, canvas.height / 2 - 8);

        } else {
          let backgrounds
          if (GameState.currentState === GAME_STATE.LEVEL1) {
            backgrounds = levelBackgroundPatterns[0]
          } else if (GameState.currentState === GAME_STATE.LEVEL2) {
            backgrounds = levelBackgroundPatterns[1]
          }

          levelRender({
            gameData: {gameObjects, GameState, PlayerState},
            kontra: {canvas, context},
          }, backgrounds)
        }
        break
      case GAME_STATE.GAMEOVER:
        renderGameOver(canvas, context)
        break
      case GAME_STATE.VICTORYBLACK:
        renderVictoryBlack(canvas, context)
        break
      case GAME_STATE.VICTORYWHITE:
        renderVictoryWhite(canvas, context)
        break
    }
}