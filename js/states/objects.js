import {GAME_STATE} from './game'

export const gameObjects = {
  [GAME_STATE.MENU]: {
    input: {
      space: false,
    },
    title: null,
    startLabel: null,
  },
  [GAME_STATE.LEVEL1]: {
    white: null,
    black: null,
    enemies: [],
    obstacles: [],
    boss:null,
    exit: null,
  },
  [GAME_STATE.LEVEL2]: {
    white: null,
    black: null,
    enemies: [],
    obstacles: [],
    boss:null,
    exit: null,
  },
};