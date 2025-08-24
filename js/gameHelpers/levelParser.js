export const parseToColorMapper = {
  '#': 'yellow', /* # = level exit */
  'A': 'blue', /* fish */
  'B': 'purple', /* B = boss */
  'C': 'black', /* C = ceiling */
  'D': 'darkred', /* D = door */
  'E': 'red', /* E = enemy */
  'F': 'darkgreen', /* F = floor */
  'L': 'yellow', /* L = lamp */
  'M': 'white', /* white cat */
  'O': 'lightblue', /* O = window */
  'P': 'brown', /* P = poop */
  'R': 'saddlebrown', /* R = wardrobe */
  'S': 'black', /* black cat */
  'T': 'peru', /* T = table */
  'W': 'brown', /* W = wall */
  'X': 'gray', /* X = breakable wall */
  'c': 'sienna', /* c = chair */
  'f': 'green', /* f = flower */
}

export function parseLevel({ levelMap, gameObjects, Sprite, tileSize = 20}) {
  levelMap.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ".") {
        return
      }

      let cfg = {
        x: x * tileSize,
        y: y * tileSize,
        width: tileSize,
        height: tileSize,
        color: parseToColorMapper?.[ch] ?? "gray",
        type: ch
      };

      if (ch === 'M') {
        gameObjects.white = Sprite({
          x: x * tileSize,
          y: y * tileSize,
          width: 40,
          height: 40,
          color: 'white',
          // Добавляем физические свойства
          velocityY: 0,
          isJumping: true,
          jumpForce: -550, // Отрицательное значение, т.к. ось Y направлена вниз
          moveSpeed: 200,
          onGround: false,
          alpha: 1.0, // для прозрачности
          originalWidth: 40,
          originalHeight: 40,
          sizeMultiplier: 1,
          facingRight: true,
          isMoving: false,
          attackDamage: 10, // урон от атаки
          health: 100,
          lives: 10,
          damageInvulnerabilityLeft: 0,
        })
      }

      if (ch === 'S') {
        gameObjects.black = Sprite({
          x: x * tileSize,
          y: y * tileSize,
          width: 40,
          height: 40,
          color: 'black',
          // Добавляем физические свойства
          velocityY: 0,
          isJumping: true,
          jumpForce: -550, // Отрицательное значение, т.к. ось Y направлена вниз
          onGround: false,
          alpha: 1.0, // для прозрачности
          moveSpeed: 200,
          originalWidth: 40,
          originalHeight: 40,
          sizeMultiplier: 1,
          // Добавляем свойства для атаки
          isAttacking: false,
          attackDuration: 0.03, // миллисекунды
          attackTimer: 0,
          attackRange: 60, // дальность атаки
          attackDamage: 10, // урон от атаки
          facingRight: true,
          // Свойства для cooldown
          attackCooldown: 0.5, // миллисекунды (время перезарядки)
          attackCooldownTimer: 0, // текущий таймер перезарядки
          canAttack: true, // флаг, может ли кот атаковать
          isMoving: false,
          health: 100,
          lives: 10,
          damageInvulnerabilityLeft: 0,
        })
      }

      if (['W','F','C', '#'].includes(ch)) {
        cfg.collides = true
        gameObjects.obstacles.push(Sprite(cfg));
      }

      if (['L','c','T','f','D','O','R'].includes(ch)) {
        cfg.collides = false
        gameObjects.obstacles.push(Sprite(cfg));
      }

      if (['A'].includes(ch)) {
        cfg.collected = false
        gameObjects.collectables.push(Sprite(cfg));
      }

      if (['E','X','B'].includes(ch)) {
        cfg.isDead = false
        cfg.isAlive = true
        cfg.enemy = true
        cfg.isMonster = true
        cfg.health = 100
        cfg.canDie = true
        cfg.collisionDamage = 10
        if (ch === 'X') {
          cfg.isMonster = false
          cfg.collides = true
          cfg.health = 12
          cfg.breakable = true
        }
        gameObjects.enemies.push(Sprite(cfg));
      }

      if (ch === 'P') {
        gameObjects.enemies.push(Sprite({
          type: 'P',
          x: cfg.x,
          y: cfg.y,
          width: cfg.width,
          height: cfg.height,
          color: 'brown', // Добавляем цвет

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
        }))
      }
    });
  });
}