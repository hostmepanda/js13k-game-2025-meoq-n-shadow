// Функция для увеличения размера кота
import {GRAVITY_DOWN, GRAVITY_UP, MAX_FALL_SPEED} from './utils'

export function increaseCatSize(character) {
  // Максимальный множитель размера: 4
  const MAX_SIZE_MULTIPLIER = 4

  // Увеличиваем множитель на определенное значение
  const sizeIncrement = 0.5 // Каждая еда увеличивает размер на 50%

  // Проверяем, не достигли ли максимального размера
  if (character.sizeMultiplier < MAX_SIZE_MULTIPLIER) {
    // Запоминаем текущую позицию "ног" персонажа
    const bottomY = character.y + character.height

    // Увеличиваем множитель размера
    character.sizeMultiplier = Math.min(MAX_SIZE_MULTIPLIER, character.sizeMultiplier + sizeIncrement)

    // Применяем новый размер
    character.width = character.originalWidth * character.sizeMultiplier
    character.height = character.originalHeight * character.sizeMultiplier

    // Корректируем позицию Y, чтобы "ноги" оставались на том же уровне
    character.y = bottomY - character.height

    // Регулируем физические параметры в зависимости от размера
    // Чем больше кот, тем ниже он прыгает
    const BASE_JUMP_FORCE = -550
    const BASE_MOVE_SPEED = 200

    // Чем больше кот, тем ниже он прыгает
    // При размере 1 -> 100% силы прыжка
    // При размере 4 -> примерно 40% силы прыжка
    character.jumpForce = BASE_JUMP_FORCE * (1 / (1 + (character.sizeMultiplier - 1) * 0.5))

    // Чем больше кот, тем медленнее он двигается
    // При размере 1 -> 100% скорости
    // При размере 4 -> примерно 45% скорости
    character.moveSpeed = BASE_MOVE_SPEED * (1 / (1 + (character.sizeMultiplier - 1) * 0.4))
  }
}

export function updateBlackCatAttack(character, gameObjects, delta) {
  // Если кот атакует, уменьшаем таймер атаки
  if (character.isAttacking) {
    character.attackTimer -= delta;

    // Проверяем попадание по врагам
    gameObjects.enemies?.forEach((enemy, index) => {
      let inAttackRange = false;
      if (character.facingRight) {
        // Атака вправо
        inAttackRange = (enemy.x >= character.x + character.width) &&
          (enemy.x <= character.x + character.width + character.attackRange) &&
          (enemy.y + enemy.height >= character.y) &&
          (enemy.y <= character.y + character.height);
      } else {
        // Атака влево
        inAttackRange = (enemy.x + enemy.width >= character.x - character.attackRange) &&
          (enemy.x <= character.x) &&
          (enemy.y + enemy.height >= character.y) &&
          (enemy.y <= character.y + character.height);
      }

      if (inAttackRange && enemy.isMonster) {
        enemy.health -= character.attackDamage;
        enemy.hitEffect = true;
        enemy.hitTimer = 200 // длительность эффекта
        if (enemy.health <= 0) {
          enemy.isAlive = false
          enemy.isDead = enemy.canDie
        }
        if (enemy.isDead && enemy.type === 'B') {
          gameObjects.obstacles.forEach(obstacle => {
            if (obstacle.type === 'f') {
              obstacle.isVisible = true
            }
          })
        }
      }
    });
    // Если таймер истек, завершаем атаку
    if (character.attackTimer <= 0) {
      character.isAttacking = false;
    }
  }
  // Обработка cooldown атаки
  if (!character.canAttack) {
    character.attackCooldownTimer -= delta;

    // Если таймер cooldown истек, разрешаем атаковать снова
    if (character.attackCooldownTimer <= 0) {
      character.canAttack = true;
    }
  }

}

// Функция для обновления физики персонажа с резким прыжком
export function updateCharacterPhysics(character, deltaTime) {
  // Применяем гравитацию с разными значениями для подъема и падения
  if (!character.onGround) { // или !character.isOnGround, в зависимости от того, какое имя вы выберете
    // Если персонаж движется вверх (отрицательная скорость Y)
    if (character.velocityY < 0) {
      character.velocityY += GRAVITY_UP * deltaTime;
    } else {
      // Если персонаж движется вниз (положительная скорость Y)
      character.velocityY += GRAVITY_DOWN * deltaTime;
    }

    // Ограничиваем максимальную скорость падения
    if (character.velocityY > MAX_FALL_SPEED) {
      character.velocityY = MAX_FALL_SPEED;
    }
  }

  // Применяем вертикальную скорость
  character.y += character.velocityY * deltaTime;

  // Можно оставить только проверку верхней границы
  if (character.y < 20) {
    character.y = 20;
    character.velocityY = GRAVITY_DOWN;
  }
}