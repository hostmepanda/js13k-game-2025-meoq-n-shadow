export function renderVictoryBlack(cs, cx) {
  const w = cs.width;
  const h = cs.height;
  cx.fillStyle = 'black';
  cx.fillRect(0, 0, w, h);

  cx.fillStyle = 'white';
  cx.font = '30px Arial';
  cx.fillText('JS13K 2025: Meow & Shadow', w / 2 - 175, h / 2 - 30);
  cx.fillText('You have won! Black cat took all the Glory!', w / 2 - 200, h / 2 + 30);
  cx.fillText('Hit space to start over', w / 2 - 200, h / 2 + 60);
}