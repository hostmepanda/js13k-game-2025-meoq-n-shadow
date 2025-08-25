import {GAME_STATE} from '../consts'
import {setLevels} from '../states/game'
import {createDefaultLevel} from '../levels/levelHelpers'

export function initMenuScreen(selectedScreen) {
  return function (gameObjects) {
    const handleSpaceClick = (event) => {
      if (event.code === 'Space') {
        gameObjects[selectedScreen].input.space = true
      }
    }
    document.addEventListener('keydown', handleSpaceClick)

    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        gameObjects[selectedScreen].input.space = false
        document.removeEventListener('keydown', handleSpaceClick)
      }
    })
  }
}

export function updateMenuScreen(redirectScreen, { Sprite, canvas }) {
  return function ({ gameObjects, GameState, PlayerState }) {
    if (gameObjects.input.space) {
      gameObjects.input.space = false;

      console.log("Перед удалением:", JSON.stringify({
        l1Obstacles: gameObjects[GAME_STATE.LEVEL1]?.obstacles?.length,
        l2Obstacles: gameObjects[GAME_STATE.LEVEL2]?.obstacles?.length,
      }));

      delete gameObjects[GAME_STATE.LEVEL1];
      delete gameObjects[GAME_STATE.LEVEL2];
      delete gameObjects[GAME_STATE.LEVEL3];
      delete gameObjects[GAME_STATE.LEVEL4];

      console.log("После удаления:", gameObjects[GAME_STATE.LEVEL1], gameObjects[GAME_STATE.LEVEL2]);

      gameObjects[GAME_STATE.LEVEL1] = createDefaultLevel()
      gameObjects[GAME_STATE.LEVEL2] = createDefaultLevel()
      gameObjects[GAME_STATE.LEVEL3] = createDefaultLevel()
      gameObjects[GAME_STATE.LEVEL4] = createDefaultLevel()


      console.log("После создания новых уровней:",
        gameObjects[GAME_STATE.LEVEL1].obstacles.length,
        gameObjects[GAME_STATE.LEVEL2].obstacles.length
      );


      PlayerState.activeCat = 'white'
      PlayerState.white = {lives: 10, size: 1 }
      PlayerState.black = {lives: 10, size: 1 }

      setLevels({ gameObjects, PlayerState, GameState }, { Sprite, canvas})


      console.log("После setLevels:",
        gameObjects[GAME_STATE.LEVEL1].obstacles.length,
        gameObjects[GAME_STATE.LEVEL2].obstacles.length
      );


      GameState.currentState = redirectScreen;
      GameState.nextLevel = redirectScreen;
    }
  }
}