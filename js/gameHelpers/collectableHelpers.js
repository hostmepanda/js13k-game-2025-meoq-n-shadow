export function renderCollectibleFish(context, width, height, options = {}) {
  const {
    fishColor = 'rgb(60, 120, 255)', // Синий по умолчанию
  } = options;

  context.save();
  context.translate(width / 2, height / 2);

  const fishWidth = width * 0.9;
  const fishHeight = height * 0.5;

  // Рисуем тело рыбки
  context.fillStyle = fishColor;

  // Основное тело рыбки
  context.beginPath();
  context.ellipse(0, 0, fishWidth / 2, fishHeight / 2, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = 'rgb(0,0,0)';
  context.lineWidth = 1;
  context.stroke();

  // Хвост рыбки
  context.beginPath();
  context.moveTo(fishWidth / 2, 0);
  context.lineTo(fishWidth / 3 + fishWidth * 0.5, fishHeight * 0.6);
  context.lineTo(fishWidth / 3 + fishWidth * 0.5, -fishHeight * 0.6);
  context.closePath();
  context.fill();
  context.strokeStyle = 'rgb(0,0,0)';
  context.lineWidth = 1;
  context.stroke();
  context.restore();
}