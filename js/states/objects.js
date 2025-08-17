import {GAME_STATE} from './game'

export const gameObjects = {
  [GAME_STATE.MENU]: {
    input: {
      space: false,
    },
  },
  [GAME_STATE.LEVEL1]: {
    white: null,
    black: null,
    enemies: [],
    backgrounds: [],
    obstacles: [],
    boss:null,
    exit: null,
    keyboard: {},
    level: {},
  },
  [GAME_STATE.LEVEL2]: {
    white: null,
    black: null,
    enemies: [],
    backgrounds: [],
    obstacles: [],
    boss:null,
    exit: null,
    keyboard: {},
  },
};