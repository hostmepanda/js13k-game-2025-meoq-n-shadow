export class GameLoop {
  constructor({ update, render }) {
    this.lastTime = 0;
    this.update = update
    this.render = render
  }

  loop = (timestamp) => {
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    const cappedDelta = Math.min(deltaTime, 0.1);
    this.update(cappedDelta)
    this.render()
    requestAnimationFrame(this.loop);
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }
}