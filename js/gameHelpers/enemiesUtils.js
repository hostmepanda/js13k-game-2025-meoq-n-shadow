import {isCollided} from './utils'

export function checkEnemyCollisionWithEnvironment(obstacles, enemy) {
  obstacles.forEach(obstacle => {
    if (
      enemy.x < obstacle.x + obstacle.width &&
      enemy.x + enemy.width > obstacle.x &&
      enemy.y < obstacle.y + obstacle.height &&
      enemy.y + enemy.height > obstacle.y
    ) {
      // Проверка столкновения сверху (монстр стоит на препятствии)
      if (enemy.y + enemy.height > obstacle.y &&
        enemy.y + enemy.height < obstacle.y + obstacle.height / 2) {
        enemy.y = obstacle.y - enemy.height
        enemy.velocityY = 0
        enemy.onGround = true
      }
      // Проверка боковых столкновений
      else if (enemy.velocityX > 0 && enemy.x + enemy.width > obstacle.x &&
        enemy.x < obstacle.x) {
        // Столкновение справа
        enemy.x = obstacle.x - enemy.width
        enemy.direction = 'left'
        enemy.velocityX *= -1
      } else if (enemy.velocityX < 0 && enemy.x < obstacle.x + obstacle.width &&
        enemy.x + enemy.width > obstacle.x + obstacle.width) {
        // Столкновение слева
        enemy.x = obstacle.x + obstacle.width
        enemy.direction = 'right'
        enemy.velocityX *= -1
      }
    }
  })
}

// Функция для создания какашки
export function createPoop(character, gameObjects, Sprite) {
  // Проверяем, достаточно ли большой размер кота
  if (character.sizeMultiplier > 1) {
    // Уменьшаем размер кота после какания
    const poopSizeReduction = 0.2 // Уменьшение размера на 20%

    // Запоминаем текущую позицию "ног" персонажа
    const bottomY = character.y + character.height

    // Уменьшаем множитель размера, но не меньше 1
    character.sizeMultiplier = Math.max(1, character.sizeMultiplier - poopSizeReduction)

    // Пересчитываем размеры
    character.width = character.originalWidth * character.sizeMultiplier
    character.height = character.originalHeight * character.sizeMultiplier

    // Корректируем позицию Y, чтобы "ноги" оставались на том же уровне
    character.y = bottomY - character.height

    // Регулируем физические параметры в зависимости от размера
    const BASE_JUMP_FORCE = -550
    const BASE_MOVE_SPEED = 200

    // Обновляем силу прыжка и скорость после изменения размера
    character.jumpForce = BASE_JUMP_FORCE * (1 / (1 + (character.sizeMultiplier - 1) * 0.5))
    character.moveSpeed = BASE_MOVE_SPEED * (1 / (1 + (character.sizeMultiplier - 1) * 0.4))

    // Создаем какашку
    const poopSize = 15 + (character.sizeMultiplier - 1) * 5 // Размер какашки зависит от размера кота

    // Определяем положение какашки под котом
    const poopX = character.direction === 'left'
      ? character.x + character.width - poopSize / 2
      : character.x + poopSize / 2

    // Импортируем Sprite из Kontra.js (должно быть в начале файла)
    // import { Sprite } from '../engine/kontra.mjs';

    // Создаем спрайт какашки с помощью Kontra.js
    const poop = Sprite({
      x: poopX,
      y: character.y + character.height - poopSize,
      width: poopSize,
      height: poopSize,
      color: 'brown', // Добавляем цвет
      type: 'P',
      // Свойства из оригинального объекта
      createdAt: Date.now(),
      isMonster: false,
      transformAt: Date.now() + 5000,
      velocityX: 0,
      velocityY: 0,
      direction: Math.random() > 0.5 ? 'left' : 'right',
      onGround: false,
      jumpTimer: 0,
      health: 100,
      isAlive: true,
      canDie: false,
      isDead: false,
      update(deltaTime) {
        if (!this.isAlive) {
          console.log('Какашка убита!')
          this.isMonster = false
          this.isAlive = true
          this.transformAt = Date.now() + 5000
          this.velocityX = 0
          this.velocityY = 0
          this.onGround = false
          this.jumpTimer = 0
          this.health = 100
        }

        const now = Date.now()
        if (!this.isMonster) {
          if (now >= this.transformAt) {
            this.isMonster = true
            const growFactor = 1.2
            this.width *= growFactor
            this.height *= growFactor
            this.velocityX = this.direction === 'left' ? -50 : 50
            console.log('Какашка превратилась в монстра!')
          }
        }
        if (this.isMonster) {
          this.jumpTimer -= deltaTime
          if (this.onGround && this.jumpTimer <= 0) {
            if (Math.random() < 0.02) {
              this.velocityY = -350 - Math.random() * 150 // Случайная сила прыжка
              this.onGround = false
              this.jumpTimer = 1 + Math.random() * 2 // Задержка между прыжками
            }
            if (Math.random() < 0.01) {
              this.direction = this.direction === 'left' ? 'right' : 'left'
              this.velocityX *= -1
            }
          }
        }

        if (!this.onGround) {
          this.velocityY += 980 * deltaTime
        }

        this.y += this.velocityY * deltaTime
        this.x += this.velocityX * deltaTime
        this.onGround = false
      },
    });
    gameObjects.enemies.push(poop);
    console.log('Кот покакал! Размер уменьшился до', character.sizeMultiplier.toFixed(2))
    return true // Успешно покакал
  }

  return false // Не удалось покакать (размер слишком мал)
}

export function checkEnemyCollisions(player, enemies) {
  enemies.forEach((enemy, index) => {
    if (isCollided(player, enemy)) {
      if (enemy.type === 'X') {
        if (player.color === 'white') {
          const canBreak = player.sizeMultiplier * player.attackDamage >= enemy.health
          console.log('canBreak: ', canBreak, player.sizeMultiplier, player.attackDamage, enemy.health)
          if (canBreak) {
            enemies[index].health = 0
            enemies[index].isAlive = false
            enemies[index].isDead = enemy.canDie
          } else {
            if (player.facingRight) {
              player.x = enemy.x - player.width
            } else {
              player.x = enemy.x + enemy.width;
            }
          }
        } else {
          if (player.facingRight) {
            player.x = enemy.x - player.width
          } else {
            player.x = enemy.x + enemy.width;
          }
        }
      } else if (enemy.type === 'E' || enemy.type === 'P') {
        if (enemy.type === 'P' && enemy.isMonster) {
          if (player.damageInvulnerabilityLeft <= 0) {
            player.health -= enemy?.collisionDamage ?? 1
            player.damageInvulnerabilityLeft = 1000
          }
        }
      }
    }
  })
  player.damageInvulnerabilityLeft = player.damageInvulnerabilityLeft <= 0 ? 0 : player.damageInvulnerabilityLeft - 10
}