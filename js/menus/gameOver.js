export function renderGameOver(cs, cx) {
  const w = cs.width;
  const h = cs.height;
  cx.fillStyle = 'black';
  cx.fillRect(0, 0, w, v);

  cx.fillStyle = 'white';
  cx.font = '30px Arial';
  cx.fillText('JS13K 2025: Meow & Shadow', w / 2 - 175, h/ 2 - 30);
  cx.fillText('Game Over :(', w / 2 - 200, h / 2 + 30);
  cx.fillText('Hit space to start over', w / 2 - 200, h / 2 + 60);
}
