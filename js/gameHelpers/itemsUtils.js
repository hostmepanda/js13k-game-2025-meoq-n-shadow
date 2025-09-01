import {GRAVITY_DOWN, isCollided} from './utils'
import {increaseCatSize} from './charactersUtils'
import {GAME_STATE} from '../consts'

export function renderFoodItems(context, foodItems) {
  foodItems.forEach(food => {
    // Рисуем только несобранную еду
    if (!food.collected) {
      context.fillStyle = food.color
      context.fillRect(food.x, food.y, food.width, food.height)

      // Можно добавить эффект "свечения" для лучшей видимости
      context.shadowColor = 'rgba(0, 0, 255, 0.7)'
      context.shadowBlur = 10
      context.fillRect(food.x, food.y, food.width, food.height)
      context.shadowBlur = 0
    }
  })
}

export function checkFoodCollision(character, foodItems) {
  for (let i = 0; i < foodItems.length; i++) {
    const food = foodItems[i]

    // Пропускаем уже собранную еду
    if (food.collected) {
      continue
    }

    // Проверяем столкновение с едой
    if (character.x < food.x + food.width &&
      character.x + character.width > food.x &&
      character.y < food.y + food.height &&
      character.y + character.height > food.y) {

      // Отмечаем еду как собранную
      food.collected = true

      // Применяем эффект в зависимости от типа еды
      if (food.type === 'A' && character.color === 'white') {
        // Увеличиваем размер белого кота
        increaseCatSize(character)
      }

      // Можно добавить звуковой эффект или анимацию здесь
      console.log('Еда собрана!')

      return true
    }
  }

  return false
}

export function checkEnvironmentCollisions(player, obstacles, deltaTime, GameState, collides) {
  player.onGround = false;
  obstacles
  .forEach(obstacle => {
    if (!collides(player, obstacle)) return;

    // вычисляем перекрытия
    const overlapX = Math.min(
      player.x + player.width - obstacle.x,
      obstacle.x + obstacle.width - player.x
    );
    const overlapY = Math.min(
      player.y + player.height - obstacle.y,
      obstacle.y + obstacle.height - player.y
    );

    if (overlapX < overlapY) {
      // горизонтальная коллизия
      if (player.x < obstacle.x) {
        player.x = obstacle.x - player.width;
      } else {
        player.x = obstacle.x + obstacle.width;
      }
      player.velocityX = 0;
    } else {
      // вертикальная коллизия
      if (player.y < obstacle.y) {
        // сверху
        player.y = obstacle.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
        player.isJumping = false;
      } else {
        // снизу (удар головой)
        player.y = obstacle.y + obstacle.height;
        player.velocityY = 0; // или GRAVITY_DOWN, если хочешь отскок
      }
    }

    // Дополнительные типы тайлов
    if (obstacle.type === '#') {
      const currentLevelIndex = Object.values(GAME_STATE).findIndex(
        value => value === GameState.currentState
      );
      const nextLevelKey = Object.keys(GAME_STATE)?.[currentLevelIndex + 1];
      if (GAME_STATE?.[nextLevelKey] === GAME_STATE.GAMEOVER) {
        GameState.nextLevel =
          player.color === 'white'
            ? GAME_STATE.VICTORYWHITE
            : GAME_STATE.VICTORYBLACK;
      } else {
        GameState.nextLevel = GAME_STATE?.[nextLevelKey];
      }
    }
  });

  // ограничение по верхней границе карты
  if (player.y <= 10) {
    player.y = 10;
    player.velocityY = -10 * deltaTime;
  }
}
