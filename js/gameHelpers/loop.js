import {GameState} from '../states/game'

export class GameLoop {
  constructor({ update, render }) {
    this.lastTime = 0;
    this.update = update
    this.render = render
  }

  loop = (timestamp) => {
    // Рассчитываем deltaTime в секундах
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Ограничиваем deltaTime, чтобы избежать слишком больших скачков при низком FPS
    const cappedDelta = Math.min(deltaTime, 0.1);

    // Передаем deltaTime в функцию обновления
    this.update(cappedDelta)
    this.render()

    requestAnimationFrame(this.loop);
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }
}