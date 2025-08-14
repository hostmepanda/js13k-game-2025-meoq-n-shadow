import { init, Sprite, GameLoop } from './kontra.mjs'

const { canvas, context } = init();

(() => {
  GameLoop({
    update: function() {},
    render: function() {}
  })
  .start();
})()