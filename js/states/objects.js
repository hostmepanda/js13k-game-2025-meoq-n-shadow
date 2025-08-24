import {GAME_STATE} from './game'

export const gameObjects = {
  [GAME_STATE.MENU]: {
    input: {
      space: false,
    },
  },
  ...Object.fromEntries([
    GAME_STATE.LEVEL1,
    GAME_STATE.LEVEL2,
    GAME_STATE.LEVEL3,
    GAME_STATE.LEVEL4,
  ].map((levelKey) => ([levelKey, {
      black: null,
      white: null,
      exit: null,
      start: null,
      keyboard: {},
      backgrounds: [],
      level: {},
      obstacles: [],
      collectables: [],
      enemies: [],
      effects: [],
    }]
  ))),
};