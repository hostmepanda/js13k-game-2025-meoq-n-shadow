import {GAME_STATE} from '../states/game'
import {GRAVITY_DOWN, isCollided} from './utils'
import {increaseCatSize} from './charactersUtils'

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
    if (food.collected) continue

    // Проверяем столкновение с едой
    if (character.x < food.x + food.width &&
      character.x + character.width > food.x &&
      character.y < food.y + food.height &&
      character.y + character.height > food.y) {

      // Отмечаем еду как собранную
      food.collected = true

      // Применяем эффект в зависимости от типа еды
      if (food.type === 'sizeFood' && character.color === 'white') {
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

export function checkEnvironmentCollisions(player, obstacles, deltaTime, GameState) {
  const collidingObstacles = obstacles.filter(({ collides }) => collides);
  collidingObstacles.forEach(obstacle => {
    if (isCollided(player, obstacle)) {
      if (obstacle.type === 'F') {
        if (player.y + player.height >= obstacle.y && player.y <= obstacle.y) {
          player.y = obstacle.y - player.height;
          player.onGround = true;
          player.isJumping = false
        } else if (
          player.isJumping &&
          player.y + player.height >= obstacle.y + obstacle.height &&
          player.y <= obstacle.y + obstacle.height
        ) {
          player.y = obstacle.y + obstacle.height
          player.velocityY = GRAVITY_DOWN;
        }
      }

      if (obstacle.type === 'W') {
        if (player.facingRight) {
          player.x = obstacle.x - player.width
        } else {
          player.x = obstacle.x + obstacle.width;
        }
      }

      if (player.y <= 10) {
        player.y = 10;
        player.velocityY = -10 * deltaTime;
      }
      if (obstacle.type === '#') {
        const currentLevelIndex = Object.values(GAME_STATE).findIndex(value => value === GameState.currentState)
        const nextLevelKey = Object.keys(GAME_STATE)?.[currentLevelIndex + 1]
        if (!GAME_STATE?.[nextLevelKey]) {
          GameState.currentState = player.activeCharacter === 'white' ? GAME_STATE.VICTORYWHITE : GAME_STATE.VICTORYBLACK
        } else {
          GameState.currentState = GAME_STATE?.[nextLevelKey]
        }
      }
    }
  })
}