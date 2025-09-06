import {drawPixels, isCollided} from './utils'

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
        console.log('// Столкновение справа')
        // Столкновение справа
        enemy.x = obstacle.x - enemy.width
        enemy.direction = 'left'
        enemy.velocityX *= -1
      } else if (enemy.velocityX < 0 && enemy.x < obstacle.x + obstacle.width &&
        enemy.x + enemy.width > obstacle.x + obstacle.width) {
        console.log('// Столкновение cлева')

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
    const poopSizeReduction = 0.25 // Уменьшение размера на 25%

    // Запоминаем текущую позицию "ног" персонажа
    const bottomY = character.y + character.height

    // Уменьшаем множитель размера, но не меньше 1
    character.sizeMultiplier = Math.max(1, character.sizeMultiplier - poopSizeReduction)

    // Пересчитываем размеры
    character.width = character.originalWidth * character.sizeMultiplier
    character.height = character.originalHeight * character.sizeMultiplier

    // Корректируем позицию Y, чтобы "ноги" оставались на том же уровне
    character.y = bottomY - character.height

    character.jumpForce = character.originalJumpForce * (1 / (1 + (character.sizeMultiplier - 1) * 0.5))
    character.moveSpeed = character.originalMoveSpeed * (1 / (1 + (character.sizeMultiplier - 1) * 0.4))

    const poopSize = 15 + (character.sizeMultiplier - 1) * 5 // Размер какашки зависит от размера кота

    // Определяем положение какашки под котом
    const poopX = character.facingRight
      ? character.x - poopSize / 2
      : character.x + character.width - poopSize / 2

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
      size: poopSize,
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
      dt: 0,
      frame: 0,
      framesLength: 6,
      render() {
        renderPoop(this.context, {
          isMonster: this.isMonster,
          frameIndex: this.frame,
          scale: 1,
          flipX: this.direction !== 'left',
        })
      },
      update(deltaTime) {
        this.dt += deltaTime;
        if (this.dt > 0.07) {   // каждые 0.3 сек смена кадра
          this.frame = (this.frame + 1) % this.framesLength;
          this.dt = 0;
        }

        if (!this.isAlive) {
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
    return true // Успешно покакал
  }

  return false // Не удалось покакать (размер слишком мал)
}

export function checkEnemyCollisions(player, enemies, states) {
  enemies.forEach((enemy, index) => {
    if (isCollided(player, enemy)) {
      if (enemy.type === 'X') {
        if (player.color === 'white') {
          const canBreak = player.sizeMultiplier * player.attackDamage >= enemy.health
          if (canBreak) {
            enemies[index].health = 0
            enemies[index].isAlive = false
            enemies[index].isDead = enemy.canDie
          }
        }
      } else if (enemy.type === 'E' || enemy.type === 'P' || enemy.type === 'B') {
        if (['P','B'].includes(enemy.type) && enemy.isMonster) {
          if (player.damageInvulnerabilityLeft <= 0) {
            player.health -= enemy?.collisionDamage ?? 1
            player.damageInvulnerabilityLeft = 1000
            if (player.health <= 0) {
              if (states.PlayerState[player.color].lives > 0) {
                states.PlayerState[player.color].lives = states.PlayerState[player.color].lives - 1
                player.health = 100
              } else {
                player.isAlive = false
              }
            }
          }
        }
      }
    }
  })
  player.damageInvulnerabilityLeft = player.damageInvulnerabilityLeft <= 0 ? 0 : player.damageInvulnerabilityLeft - 10
}

export function renderPoop(ctx, options = { frameIndex: 0, scale: 1, flipX: false }) {
  const poopFrames = [
    [
      '00000000000000000000',
      '00000020000000000000',
      '00000000000000200000',
      '00000000000000000000',
      '00000000000011000000',
      '00000000000111100000',
      '00000000011111000000',
      '00000001111111100000',
      '00000000111111100000',
      '00000011111111000000',
      '00000111111111110000',
      '00001111111111110000',
      '00001111111111100000',
      '00011111111111111100',
      '01111111111111111110',
      '11111111111111111111',
    ],
    [
      '00000000000000000000',
      '00000000000000000000',
      '00000020000002000000',
      '00000000000000000000',
      '00000000000011000000',
      '00000000000111100000',
      '00000000011111000000',
      '00000001111111100000',
      '00000000111111100000',
      '00000011111111000000',
      '00000111111111110000',
      '00001111111111110000',
      '00001111111111100000',
      '00011111111111111100',
      '01111111111111111110',
      '11111111111111111111',
    ],
    [
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000200000020000000',
      '00000000000011000000',
      '00000000000111100000',
      '00000000011111000000',
      '00000001111111100000',
      '00000000111111100000',
      '00000011111111000000',
      '00000111111111110000',
      '00001111111111110000',
      '00001111111111100000',
      '00011111111111111100',
      '01111111111111111110',
      '11111111111111111111',
    ],
    [
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000000000020000000',
      '00000020000011000000',
      '00000000000111100000',
      '00000000011111000000',
      '00000001111111100000',
      '00000000111111100000',
      '00000011111111000000',
      '00000111111111110000',
      '00001111111111110000',
      '00001111111111100000',
      '00011111111111111100',
      '01111111111111111110',
      '11111111111111111111',
    ],
    [
      '00000000000000000000',
      '00000000000000000000',
      '00000000000000000000',
      '00000002000002000000',
      '00000000000011000000',
      '00000000000111100000',
      '00000000011111000000',
      '00000001111111100000',
      '00000000111111100000',
      '00000011111111000000',
      '00000111111111110000',
      '00001111111111110000',
      '00001111111111100000',
      '00011111111111111100',
      '01111111111111111110',
      '11111111111111111111',
    ],
    [
      '00000000000000000000',
      '00000000000000000000',
      '00000002000000000000',
      '00000000000000200000',
      '00000000000011000000',
      '00000000000111100000',
      '00000000011111000000',
      '00000001111111100000',
      '00000000111111100000',
      '00000011111111000000',
      '00000111111111110000',
      '00001111111111110000',
      '00001111111111100000',
      '00011111111111111100',
      '01111111111111111110',
      '11111111111111111111',
    ]
  ];

  const poopMonsterFrames = [
    [
      '00000000010100000000',
      '00000001111110000000',
      '0000111144444110000',
      '00011113333341111000',
      '00111100333341110100',
      '01111101101440011110',
      '00011100101110011110',
      '00001100001110111110',
      '10000001001110111100',
      '11100111001101111100',
      '01100111111111111000',
      '00111111111114400000',
      '00011114444444410000',
      '00001111111441110000',
      '00001111114411100000',
      '00001111144111100000',
      '00011111441111111100',
      '00011111111111111100',
      '01111111111111111110',
      '11111111111111111111',
    ],
    [
      '00000000010100000000',
      '00001111111000000000',
      '0001114444411000000',
      '00011113333341000000',
      '00111110333341111110',
      '00111111101440011111',
      '00011100101110011111',
      '00001100001110111111',
      '00110001001110111111',
      '00110111001101111100',
      '01100111111111111000',
      '00111111111114400000',
      '00011111114444410000',
      '00001114441441110000',
      '00001111111144100000',
      '00001111111144100000',
      '00011111111144411100',
      '00011111111111111100',
      '01111111111111111110',
      '11111111111111111111',
    ],
    [
      '00000000010100000000',
      '00011111111111000000',
      '00011144444111000000',
      '00011113333341000000',
      '00111110333341111110',
      '00111111101440011111',
      '00011100101110011111',
      '00011100101110011111',
      '00001100001110111111',
      '11100001001110111111',
      '11110111001101111111',
      '01100111111111111100',
      '01111111111114411000',
      '01111111114444410000',
      '00011114441441110000',
      '00001111111144100000',
      '01111111111144111000',
      '01111111111144411110',
      '01111111111111111110',
      '01111111111111111110',
      '11111111111111111111',
    ],
    [
      '00000000010100000000',
      '00001111111000000000',
      '0001114444411000000',
      '00011113333341000000',
      '00111110333341111110',
      '00111111101440011111',
      '00011100101110011111',
      '00001100001110111111',
      '00110001001110111111',
      '00110111001101111100',
      '01100111111111111000',
      '00111111111114400000',
      '00011111114444410000',
      '00001114441441110000',
      '00001111111144100000',
      '00001111111144100000',
      '00011111111144411100',
      '00011111111111111100',
      '01111111111111111110',
      '11111111111111111111',
    ],
    [
      '00001111111000000000',
      '00000011111000000000',
      '00000013333341000000',
      '00000111333341111110',
      '00000111101440011011',
      '00001100101110011011',
      '00000110001110110011',
      '00000001001110110011',
      '00000111001101100100',
      '00000111111111111000',
      '00000111111114400000',
      '00011111114444410000',
      '00001114441111000000',
      '00001144111111100000',
      '00001441111111100000',
      '00011111111111110000',
      '00011111111111110000',
      '00000111111111110000',
      '00001111111111110000',
    ],
    [
      '00000000010100000000',
      '00011111111111000000',
      '00011144444111000000',
      '00011113333341000000',
      '00111110333341111110',
      '00111111101440011111',
      '00011100101110011111',
      '00011100101110011111',
      '00001100001110111111',
      '11100001001110111111',
      '11110111001101111111',
      '01100111111111111100',
      '01111111111114411000',
      '01111111114444410000',
      '00011114441441110000',
      '00001111111144100000',
      '01111111111144111000',
      '01111111111144411110',
      '01111111111111111110',
      '01111111111111111110',
      '11111111111111111111',
    ],
  ];

  // Цвета
  const colors = [
    "rgba(255,255,255,0)", // коричневый
    "#8B4513", // коричневый
    "#000000", // зрачок
    "#ff2e9d", // зрачок
    "#ffe335", // зрачок
  ]

  drawPixels(ctx, options.isMonster ? poopMonsterFrames[options.frameIndex] : poopFrames[options.frameIndex], { scale:1, colors, flipX: options.flipX })
}
