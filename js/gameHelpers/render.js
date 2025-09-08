import {renderMainMenu} from '../menus/main'
import {levelRender} from '../levels/levelHelpers'
import {renderGameOver} from '../menus/gameOver'
import {renderVictoryBlack} from '../menus/victroryBlack'
import {renderVictoryWhite} from '../menus/victoryWhite'
import {GAME_STATE} from '../consts'

export function gameLoopRenderMethod(gameObjects, { GameState, PlayerState }, canvas, context) {
    switch (GameState.currentState) {
      case GAME_STATE.MENU:
        renderMainMenu(canvas, context, GameState)
        break
      case GAME_STATE.LEVEL1:
      case GAME_STATE.LEVEL2:
      case GAME_STATE.LEVEL3:
      case GAME_STATE.LEVEL4:
        if (GameState.paused) {
          context.font = '20px Arial'
          context.fillStyle = 'white';
          context.textAlign = 'center';  // Устанавливаем выравнивание текста по центру
          context.fillText('Press P to continue', canvas.width / 2, canvas.height / 2 + 25);

          // Первый прямоугольник (чёрный)
          context.beginPath(); // Начинаем новый путь
          context.fillStyle = 'rgba(0,0,0,0.47)'
          context.rect(canvas.width / 2 - 100, canvas.height / 2 - 50, 200, 50)
          context.fill()

          // Второй прямоугольник (зелёный)
          context.beginPath(); // Начинаем новый путь
          context.fillStyle = 'rgba(99,213,99,0.51)'
          context.rect(canvas.width / 2 - 98, canvas.height / 2 - 48, 199, 49)
          context.fill()

          // Текст PAUSED (поместил его после прямоугольников, чтобы он был поверх)
          context.fillStyle = 'white';
          context.fillText('PAUSED', canvas.width / 2, canvas.height / 2);

        } else {
          levelRender({
            gameData: {gameObjects, GameState, PlayerState},
            kontra: {canvas, context},
          })
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