// Функция для увеличения размера кота
import {GRAVITY_DOWN, GRAVITY_UP, MAX_FALL_SPEED} from './utils'

export function increaseCatSize(ch) {
  const sizeIncrement = 0.5 // Каждая еда увеличивает размер на 50%
  if (ch.sizeMultiplier < ch.maxSizeMultiplier) {
    const bottomY = ch.y + ch.height
    ch.sizeMultiplier = Math.min(ch.maxSizeMultiplier, ch.sizeMultiplier + sizeIncrement)
    ch.width = ch.originalWidth * ch.sizeMultiplier
    ch.height = ch.originalHeight * ch.sizeMultiplier
    ch.y = bottomY - ch.height
    ch.jumpForce = ch.originalJumpForce * (1 / (1 + (ch.sizeMultiplier - 1) * 0.5))
    ch.moveSpeed = ch.originalMoveSpeed * (1 / (1 + (ch.sizeMultiplier - 1) * 0.4))
  }
}

export function updateBlackCatAttack(ch, go, delta) {
  // Если кот атакует, уменьшаем таймер атаки
  if (ch.isAttacking) {
    ch.attackTimer -= delta;

    // Проверяем попадание по врагам
    go.enemies?.forEach((e, index) => {
      let inAttackRange = false;
      if (ch.facingRight) {
        // Атака вправо
        inAttackRange = (e.x >= ch.x + ch.width) &&
          (e.x <= ch.x + ch.width + ch.attackRange) &&
          (e.y + e.height >= ch.y) &&
          (e.y <= ch.y + ch.height);
      } else {
        // Атака влево
        inAttackRange = (e.x + e.width >= ch.x - ch.attackRange) &&
          (e.x <= ch.x) &&
          (e.y + e.height >= ch.y) &&
          (e.y <= ch.y + ch.height);
      }

      if (inAttackRange && e.isMonster) {
        e.health -= ch.attackDamage;
        e.hitEffect = true;
        e.hitTimer = 200 // длительность эффекта
        if (e.health <= 0) {
          e.isAlive = false
          e.isDead = e.canDie
        }
        if (e.isDead && e.type === 'B') {
          [
            ...go.obstacles,
            ...go.collectables,
          ].forEach(obstacle => {
            if (['f','a'].includes(obstacle.type)) {
              obstacle.isVisible = true
            }
          })
        }
      }
    });
    // Если таймер истек, завершаем атаку
    if (ch.attackTimer <= 0) {
      ch.isAttacking = false;
    }
  }
  // Обработка cooldown атаки
  if (!ch.canAttack) {
    ch.attackCooldownTimer -= delta;

    // Если таймер cooldown истек, разрешаем атаковать снова
    if (ch.attackCooldownTimer <= 0) {
      ch.canAttack = true;
    }
  }

}

// Функция для обновления физики персонажа с резким прыжком
export function updateCharacterPhysics(ch, dt) {
  // Применяем гравитацию с разными значениями для подъема и падения
  if (!ch.onGround) { // или !character.isOnGround, в зависимости от того, какое имя вы выберете
    // Если персонаж движется вверх (отрицательная скорость Y)
    if (ch.velocityY < 0) {
      ch.velocityY += GRAVITY_UP * dt;
    } else {
      // Если персонаж движется вниз (положительная скорость Y)
      ch.velocityY += GRAVITY_DOWN * dt;
    }

    // Ограничиваем максимальную скорость падения
    if (ch.velocityY > MAX_FALL_SPEED) {
      ch.velocityY = MAX_FALL_SPEED;
    }
  }

  // Применяем вертикальную скорость
  ch.y += ch.velocityY * dt;

  // Можно оставить только проверку верхней границы
  if (ch.y < 20) {
    ch.y = 20;
    ch.velocityY = GRAVITY_DOWN;
  }
}