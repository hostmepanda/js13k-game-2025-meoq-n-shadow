import {renderMainMenu} from '../menus/main'
import {levelRender} from '../levels/levelHelpers'
import {GAME_STATE} from '../consts'
import {renderGameScreen} from '../menus/helpers'

export function gameLoopRenderMethod(gameObjects, { GameState, PlayerState }, cs, cx, lvlBkPrns) {
    switch (GameState.currentState) {
      case GAME_STATE.MENU:
        renderMainMenu(cs, cx, GameState)
        break
      case GAME_STATE.LEVEL1:
      case GAME_STATE.LEVEL2:
      case GAME_STATE.LEVEL3:
        if (GameState.paused) {
          // Первый прямоугольник (чёрный)
          cx.beginPath(); // Начинаем новый путь
          cx.fillStyle = 'rgba(0,0,0,0.47)'
          cx.rect(cs.width / 2 - 100, cs.height / 2 - 50, 200, 50)
          cx.fill()

          cx.beginPath(); // Начинаем новый путь
          cx.fillStyle = PlayerState.activeCharacter === 'white' ? 'rgba(255,255,255)' : 'rgb(0,0,0)';
          cx.rect(cs.width / 2 - 98, cs.height / 2 - 48, 198, 48)
          cx.fill()

          cx.fillStyle = PlayerState.activeCharacter === 'white' ? 'black' : 'white';
          cx.font = '20px Arial'
          cx.textAlign = 'center'
          cx.fillText('PAUSED', cs.width / 2, cs.height / 2 - 28);
          cx.font = '15px Arial'
          cx.fillText('Press P to continue', cs.width / 2, cs.height / 2 - 8);

        } else {
          let backgrounds
          if (GameState.currentState === GAME_STATE.LEVEL1) {
            backgrounds = lvlBkPrns[0]
          } else if (GameState.currentState === GAME_STATE.LEVEL2) {
            backgrounds = lvlBkPrns[1]
          } else if (GameState.currentState === GAME_STATE.LEVEL3) {
            backgrounds = lvlBkPrns[2]
          }

          levelRender({
            gameData: {gameObjects, GameState, PlayerState},
            kontra: {canvas: cs, context: cx},
          }, backgrounds)
        }
        break
      case GAME_STATE.GAMEOVER:
        renderGameScreen(cs, ctx, 'gameOver');
        break
      case GAME_STATE.VICTORYBLACK:
        renderGameScreen(cs, cx, 'victoryBlack');
        break
      case GAME_STATE.VICTORYWHITE:
        renderGameScreen(cs, cx, 'victoryWhite');
        break
    }
}