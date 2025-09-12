import {loadLevel} from '../states/game'

export function initMenuScreen(gameState, canvas) {
  const spclk = (e) => {
    if (e.code === 'Space') {
      gameState.input.space = true
    }
  }
  document.addEventListener('keydown', spclk)
  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      gameState.input.space = false
      document.removeEventListener('keydown', spclk)
    }
  })

  document.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const halfWidth = gameState.msl.authorWidth / 2;
    if (y >= gameState.msl.authorPos.y - gameState.msl.authorHeight &&
      y <= gameState.msl.authorPos.y + 5 &&
      x >= gameState.msl.authorPos.x - halfWidth &&
      x <= gameState.msl.authorPos.x + halfWidth) {
      window.open('https://github.com/hostmepanda', '_blank');
    }
  });

}

export function updateMenuScreen({ redirectScreen, gameStates, kontra }, levelBackgroundPatterns) {
  const { gameObjects, GameState, PlayerState } = gameStates;
  const { Sprite, canvas } = kontra;
  if (GameState.input.space) {
    GameState.input.space = false;

    Object.assign(PlayerState, {
      activeCat: 'white',
      white:{lives: 10, size: 1},
      black:{lives: 10, size: 1},
    })

    loadLevel({ gameObjects, PlayerState, GameState }, { Sprite, canvas}, {}, levelBackgroundPatterns)

    GameState.currentState = redirectScreen;
    GameState.nextLevel = redirectScreen;
  }
}

export function renderGameScreen(canvas, context, type) {
  const w = canvas.width;
  const h = canvas.height;

  context.fillStyle = 'black';
  context.fillRect(0, 0, w, h);

  context.fillStyle = 'white';
  context.font = '30px Arial';
  context.fillText('JS13K 2025: Meow & Shadow', w / 2 - 175, h / 2 - 30);

  let message = '';
  switch (type) {
    case 'victoryWhite':
      message = 'You have won! White cat took all the Glory!';
      break;
    case 'victoryBlack':
      message = 'You have won! Black cat took all the Glory!';
      break;
    case 'gameOver':
    default:
      message = 'Game Over :(';
      break;
  }

  context.fillText(message, w / 2 - 200, h / 2 + 30);
  context.fillText('Hit space to start over', w / 2 - 200, h / 2 + 60);
}
