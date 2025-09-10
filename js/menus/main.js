import {renderCatSideView} from '../gameHelpers/catHelpers'

export function renderMainMenu(cv, cx, GameState) {
  const w = cv.width
  const h = cv.height
  cx.fillStyle = 'black'
  cx.fillRect(0, 0, w, h)

  cx.fillStyle = 'white'
  cx.font = '30px Arial'
  cx.textAlign = 'center'

  cx.fillText('Meoq & Shadow', w / 2 + 5, h / 2 - 60)
  cx.fillStyle = '#ffffff'
  cx.font = '25px Arial'
  cx.fillText('Press Space to start', w / 2, h / 2 + 25)

  cx.font = '15px Arial'
  cx.fillText('Move: A & D, jump: W, switch cat: Left Shift', w / 2, h / 2 + 55)
  cx.fillText('poop (Meoq): Space, attack (Shadow): Space', w / 2, h / 2 + 78)

  cx.font = '18px Arial'
  cx.fillText('JS13K GAME 2025', w / 2, h / 2 + 110)


  cx.font = '15px Arial'
  cx.fillText('created by hostmepanda', w / 2, h / 2 + 135)
  cx.font = '12px Arial'
  cx.fillStyle = '#66ccff'
  cx.fillText('(github.com/hostmepanda)', w / 2, h / 2 + 155)

  cx.save()
  cx.translate(w / 2 - 40, h / 2 - 45)
  renderCatSideView(cx,
    {
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
  cx.translate(50, 0)
  renderCatSideView(cx,
    {
      flipX: true,
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
  cx.restore()
  cx.translate(0, 0)

  cx.fillStyle = '#ffffff'
  cx.font = '25px Arial'
  cx.fillText(GameState.musicEnabled ? '🔉' : '🔇', w - 80, h - 50)
  cx.font = '15px Arial'
  cx.fillText(`(press M to ${GameState.musicEnabled ? 'disable' : 'enable'})`, w - 80, h - 28)

  GameState.msl = {
    titlePos: { x: w / 2 + 5, y: h / 2 - 60 },
    gameNamePos: { x: w / 2, y: h / 2 + 110 },
    authorPos: { x: w / 2, y: h / 2 + 155 },
    authorWidth: cx.measureText('(github.com/hostmepanda)').width,
    authorHeight: 12
  }
}
