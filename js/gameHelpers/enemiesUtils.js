import {drawPixels, isCollided} from './utils'

export function checkEnemyCollisionWithEnvironment(o, e) {
  o.forEach(obstacle => {
    if (
      e.x < obstacle.x + obstacle.width &&
      e.x + e.width > obstacle.x &&
      e.y < obstacle.y + obstacle.height &&
      e.y + e.height > obstacle.y
    ) {
      if (e.y + e.height > obstacle.y &&
        e.y + e.height < obstacle.y + obstacle.height / 2) {
        e.y = obstacle.y - e.height
        e.velocityY = 0
        e.onGround = true
      }
      else if (e.velocityX > 0 && e.x + e.width > obstacle.x &&
        e.x < obstacle.x) {
        e.x = obstacle.x - e.width
        e.direction = 'left'
        e.velocityX *= -1
      } else if (e.velocityX < 0 && e.x < obstacle.x + obstacle.width &&
        e.x + e.width > obstacle.x + obstacle.width) {
        e.x = obstacle.x + obstacle.width
        e.direction = 'right'
        e.velocityX *= -1
      }
    }
  })
}

export function createPoop(ch, gameObjects, Sprite) {
  if (ch.sizeMultiplier > 1) {
    const poopSizeReduction = 0.25 // Уменьшение размера на 25%
    const bottomY = ch.y + ch.height
    ch.sizeMultiplier = Math.max(1, ch.sizeMultiplier - poopSizeReduction)
    ch.width = ch.originalWidth * ch.sizeMultiplier
    ch.height = ch.originalHeight * ch.sizeMultiplier
    ch.y = bottomY - ch.height
    ch.jumpForce = ch.originalJumpForce * (1 / (1 + (ch.sizeMultiplier - 1) * 0.5))
    ch.moveSpeed = ch.originalMoveSpeed * (1 / (1 + (ch.sizeMultiplier - 1) * 0.4))

    const poopSize = 15 + (ch.sizeMultiplier - 1) * 5
    const poopX = ch.facingRight
      ? ch.x - poopSize / 2
      : ch.x + ch.width - poopSize / 2

    const poop = Sprite({
      canDie: false,
      color: 'brown',
      createdAt: Date.now(),
      direction: Math.random() > 0.5 ? 'left' : 'right',
      dt: 0,
      frame: 0,
      framesLength: 6,
      health: 100,
      height: poopSize,
      isAlive: true,
      isDead: false,
      isMonster: false,
      jumpTimer: 0,
      onGround: false,
      size: poopSize,
      transformAt: Date.now() + 5000,
      type: 'P',
      velocityX: 0,
      velocityY: 0,
      width: poopSize,
      x: poopX,
      y: ch.y + ch.height - poopSize,
      render() {
        renderPoop(
          this.context,
          this.width,
          this.height,
          {
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
    return true
  }

  return false
}

export function checkEnemyCollisions(p, enemies, states) {
  enemies.forEach((e, index) => {
    if (isCollided(p, e)) {
      if (e.type === 'X') {
        if (p.color === 'white') {
          const canBreak = p.sizeMultiplier * p.attackDamage >= e.health
          if (canBreak) {
            enemies[index].health = 0
            enemies[index].isAlive = false
            enemies[index].isDead = e.canDie
          }
        }
      } else if (e.type === 'E' || e.type === 'P' || e.type === 'B') {
        if (['P','B'].includes(e.type) && e.isMonster) {
          if (p.dvl <= 0) {
            p.health -= e?.collisionDamage ?? 1
            p.dvl = 10

            if (p.health <= 0) {
              if (states.PlayerState[p.color].lives > 0) {
                states.PlayerState[p.color].lives = states.PlayerState[p.color].lives - 1
                p.health = 100
              } else {
                p.isAlive = false
              }
            }
          }
        }
      }
    }
  })
}

export function renderPoop(ctx, width, height, options = { frameIndex: 0, scale: 1, flipX: false }) {
  if (options.isMonster) {
    const levels = [
      { width: 20, height: 8 }, // нижний (самый широкий)
      { width: 13, height: 6 }, // средний
      { width: 4,  height: 6 },  // верхний (самый узкий)
      { width: -12,  height: -5 },  // верхний (самый узкий)
    ];
    const colors = ['#8B5A2B', '#7c4303', '#bc8000']; // тёмнее -> светлее
    let currentY = height; // начнём с низа
    for (let i = 0; i < levels.length; i++) {
      const lvl = levels[i];
      const lvlTopY = currentY - lvl.height;
      ctx.fillStyle = colors[i];
      ctx.fillRect(0 + i*5, lvlTopY, lvl.width, lvl.height);
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5+ i*5, lvlTopY + 0.5, lvl.width - 1, lvl.height - 1);
      currentY = lvlTopY; // подняться вверх для следующего уровня
    }
    return
  }

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
  const colors = [
    "rgba(255,255,255,0)",
    "#8B4513",
    "#000000",
    "#ff2e9d",
    "rgb(133,73,0)",
  ]
  drawPixels(ctx, poopFrames[options.frameIndex], { scale:1, colors, flipX: options.flipX })
}