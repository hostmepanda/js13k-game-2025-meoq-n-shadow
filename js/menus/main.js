import {renderCatSideView} from '../gameHelpers/catHelpers'

export function renderMainMenu(canvas, context, GameState) {
  // Заливка фона черным цветом
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Настройка стиля текста
  context.fillStyle = 'white';
  context.font = '30px Arial';
  context.textAlign = 'center';  // Устанавливаем выравнивание текста по центру

  // Отрисовка текста с указанием центра
  context.fillText('Meoq & Shadow', canvas.width / 2 + 5, canvas.height / 2 - 60);
  context.fillStyle = '#ffffff';
  context.font = '25px Arial';  // Меньший шрифт для имени создателя
  context.fillText('Press Space to start', canvas.width / 2, canvas.height / 2 + 25);

  context.font = '15px Arial';  // Меньший шрифт для имени создателя
  context.fillText('Move: A & D, jump: W, switch: Left Shift', canvas.width / 2, canvas.height / 2 + 55);
  context.fillText('poop (Meoq): Space, attack (Shadow): Space', canvas.width / 2, canvas.height / 2 + 78);

  context.font = '18px Arial';
  context.fillText('JS13K GAME 2025', canvas.width / 2, canvas.height / 2 + 110);

  // Добавляем информацию о создателе
  context.font = '15px Arial';  // Меньший шрифт для имени создателя
  context.fillText('created by hostmepanda', canvas.width / 2, canvas.height / 2 + 135);
  context.font = '12px Arial';  // Меньший шрифт для имени создателя
  context.fillStyle = '#66ccff';
  context.fillText('(github.com/hostmepanda)', canvas.width / 2, canvas.height / 2 + 155);

  context.save()
  context.translate(canvas.width / 2 - 40, canvas.height / 2 - 45)
  renderCatSideView(context,
    {
      pose: 'idle',
      flipX: false,
      frameIndex: 0,
      scale: 2,
      width: 40,
      heightShift: 0,
      colors: [
        'rgba(0,0,0,0)',
        '#000000',
        '#ececec',
        '#cfcfcf',
        '#7a7a7a',
        '#ecdcc9',
        '#f26060',
      ]
    })
  context.translate(50, 0)
  renderCatSideView(context,
    {
      pose: 'idle',
      flipX: true,
      frameIndex: 0,
      scale: 2,
      width: 40,
      heightShift: 0,
      colors: [
        'rgba(0,0,0,0)',
        '#000000',
        '#a2998d',
        '#5c5751',
        '#413f3a',
        '#ecdcc9',
        '#f26060',
        'rgba(255,255,255,1)',
      ]
    })
  context.restore()
  context.translate(0, 0)

  GameState.menuScreenListeners = {
    titlePos: { x: canvas.width / 2 + 5, y: canvas.height / 2 - 60 },
    gameNamePos: { x: canvas.width / 2, y: canvas.height / 2 + 110 },
    authorPos: { x: canvas.width / 2, y: canvas.height / 2 + 155 },
    authorWidth: context.measureText('(github.com/hostmepanda)').width,
    authorHeight: 12
  }
}
