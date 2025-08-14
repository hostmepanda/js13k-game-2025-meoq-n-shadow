import { init, Sprite, GameLoop } from './kontra.mjs'

const { canvas, context } = init({
  width: 800,
  height: 600,
});

(() => {
  GameLoop({
    update: function() {},
    render: function() {}
  })
  .start();
})()