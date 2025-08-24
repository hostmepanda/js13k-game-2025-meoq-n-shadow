export function renderVictoryBlack(canvas, context) {
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'white';
  context.font = '30px Arial';
  context.fillText('JS13K 2025: Meow & Shadow', canvas.width / 2 - 175, canvas.height / 2 - 30);
  context.fillText('You have won! Black cat took all the Glory!', canvas.width / 2 - 200, canvas.height / 2 + 30);
  context.fillText('Hit space to start over', canvas.width / 2 - 200, canvas.height / 2 + 60);
}