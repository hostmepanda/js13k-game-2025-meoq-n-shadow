// TODO: import from kontra.min.mjs to reduce size before bundling for prod
import { init, Sprite, GameLoop } from './engine/kontra.mjs'

const { canvas, context } = init();

(() => {
  new GameLoop({
    update: function() {},
    render: function() {}
  })
  .start();
})()