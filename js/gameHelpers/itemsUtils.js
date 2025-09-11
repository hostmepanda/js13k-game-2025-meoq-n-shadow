import {increaseCatSize} from './charactersUtils'
import {GAME_STATE} from '../consts'

export function checkFoodCollision(character, foodItems, collides) {
  for (let i = 0; i < foodItems.length; i++) {
    const food = foodItems[i]
    const hasMaximum = character.color === 'white'
      ? character.sizeMultiplier >= character.maxSizeMultiplier
      : character.attackMultiplier >= character.maxAttackMultiplier
    if (food.collected || hasMaximum) {
      continue
    }

    if (collides(character, food) && !food.collected && !hasMaximum) {
      if (character.color === 'white') {
        increaseCatSize(character)
      } else {
        character.attackMultiplier = Math.min(character.maxAttackMultiplier, character.attackMultiplier * (character.attackMultiplier + 1))
        character.attackRange = character.originalAttackRange * character.attackMultiplier
      }
      food.collected = true
      food.visibilityTime = 10
    }
  }
}

export function checkEnvironmentCollisions(player, obstacles, deltaTime, GameState, collides) {
  player.onGround = false;
  obstacles
  .forEach(obstacle => {
    if (!collides(player, obstacle)) {
      return
    }

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
