import {GAME_STATE} from '../consts'

export const gameObjects = {
  ...Object.fromEntries([
    GAME_STATE.MENU,
    GAME_STATE.GAMEOVER,
    GAME_STATE.VICTORYBLACK,
    GAME_STATE.VICTORYWHITE,
  ].map((menuKey) => [menuKey, {
    input: {
      space: false,
    },
  }])),
  ...Object.fromEntries([
    GAME_STATE.LEVEL1,
    GAME_STATE.LEVEL2,
    GAME_STATE.LEVEL3,
    GAME_STATE.LEVEL4,
  ].map((levelKey) => ([
    levelKey, {
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
    },
  ]))),
}