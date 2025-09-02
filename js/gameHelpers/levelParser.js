import {GRAVITY_DOWN} from './utils'

const parseToColorMapper = {
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
  'Q': 'green', /* Q = flower */
  'f': 'darkgreen', // f - invisible when boss is alive
}

export function parseLevel({ gameObjects, levelMap, Sprite, tileSize = 20}) {
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
        type: ch,
        isVisible: true,
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
          jumpForce: -450, // Отрицательное значение, т.к. ось Y направлена вниз
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
          damageInvulnerabilityLeft: 0,
        })
      }

      if (['W','F','C', '#', 'f'].includes(ch)) {
        if (ch === 'f') {
          cfg.isVisible = false
        }
        cfg.collides = true
        if (ch === 'F') {
          cfg.render = function(deltaTime) {
            this.context.save();

            // Создаем простой псевдослучайный генератор на основе позиции блока
            const seed = (this.x * 10000 + this.y);
            let seedValue = seed;
            const random = function() {
              let x = Math.sin(seedValue++) * 10000;
              return x - Math.floor(x);
            };

            // Определяем основные цвета
            const woodColor = "rgb(170, 120, 70)";
            const concreteColor = "rgb(180, 180, 180)";

            // Верхняя часть - деревянный пол
            const woodHeight = 7 + Math.floor(random() * 3); // 7-10 пикселей для деревянной части

            // Сначала заполняем весь блок бетонным цветом (как фон)
            this.context.fillStyle = concreteColor;
            this.context.fillRect(0, 0, this.width, this.height);

            // Затем заполняем верхнюю часть деревянным цветом
            this.context.fillStyle = woodColor;
            this.context.fillRect(0, 0, this.width, woodHeight);

            // Добавляем рамку слева и справа, которая будет иметь два цвета
            // Верхняя часть - цвет дерева
            this.context.fillStyle = woodColor;
            this.context.fillRect(0, 0, 1, woodHeight); // Левая сторона
            this.context.fillRect(this.width - 1, 0, 1, woodHeight); // Правая сторона

            // Нижняя часть боковых рамок - цвет бетона
            this.context.fillStyle = concreteColor;
            this.context.fillRect(0, woodHeight, 1, this.height - woodHeight); // Левая сторона
            this.context.fillRect(this.width - 1, woodHeight, 1, this.height - woodHeight); // Правая сторона

            // Верхняя и нижняя рамки
            this.context.fillStyle = woodColor;
            this.context.fillRect(0, 0, this.width, 1); // Верхняя рамка

            this.context.fillStyle = concreteColor;
            this.context.fillRect(0, this.height - 1, this.width, 1); // Нижняя рамка

            // Добавляем текстуру дерева (горизонтальные волокна)
            this.context.strokeStyle = "rgba(120, 80, 40, 0.3)";
            this.context.lineWidth = 1;

            // Горизонтальные линии для имитации деревянных волокон
            for (let i = 2; i < woodHeight - 1; i += 2) {
              this.context.beginPath();
              this.context.moveTo(1, i);
              this.context.lineTo(this.width - 1, i);
              this.context.stroke();
            }

            // Добавляем несколько вертикальных разделителей, имитирующих стыки досок
            this.context.strokeStyle = "rgba(100, 70, 40, 0.5)";
            this.context.lineWidth = 1;

            const boardCount = 2 + Math.floor(random() * 3); // 2-4 доски
            const boardWidth = (this.width - 2) / boardCount;

            for (let i = 1; i < boardCount; i++) {
              const x = i * boardWidth + 1; // +1 для учета отступа
              this.context.beginPath();
              this.context.moveTo(x, 1);
              this.context.lineTo(x, woodHeight - 1);
              this.context.stroke();
            }

            // Добавляем текстуру бетона (случайные точки и маленькие пятна)
            const maxSpotSize = 1;

            for (let i = 0; i < 50; i++) {
              const x = 2 + random() * (this.width - 4); // Отступ 2px от краев
              const y = woodHeight + 2 + random() * (this.height - woodHeight - 4);
              const size = 0.5 + random() * 0.5;

              this.context.fillStyle = `rgba(${120 + Math.floor(random() * 50)}, ${
                120 + Math.floor(random() * 50)}, ${
                120 + Math.floor(random() * 50)}, 0.3)`;

              this.context.beginPath();
              this.context.rect(x, y, size, size);
              this.context.fill();
            }

            // Добавляем несколько трещин в бетоне
            this.context.strokeStyle = "rgba(100, 100, 100, 0.2)";
            this.context.lineWidth = 0.5;

            const crackCount = Math.floor(random() * 3); // 0-2 трещины

            for (let i = 0; i < crackCount; i++) {
              const startX = 5 + random() * (this.width - 10);
              const startY = woodHeight + 5 + random() * ((this.height - woodHeight) / 2 - 5);

              this.context.beginPath();
              this.context.moveTo(startX, startY);

              let currentX = startX;
              let currentY = startY;

              const segments = 2 + Math.floor(random() * 3);

              for (let j = 0; j < segments; j++) {
                const deltaX = -3 + random() * 6;
                const deltaY = 3 + random() * 6;

                currentX += deltaX;
                currentY += deltaY;

                // Ограничиваем координаты с учетом отступа 2px от края
                currentX = Math.max(2, Math.min(this.width - 2, currentX));
                currentY = Math.max(woodHeight + 2, Math.min(this.height - 2, currentY));

                this.context.lineTo(currentX, currentY);
              }

              this.context.stroke();
            }

            // Линия раздела между деревом и бетоном
            this.context.strokeStyle = "rgba(100, 100, 100, 0.4)";
            this.context.lineWidth = 1;
            this.context.beginPath();
            this.context.moveTo(1, woodHeight);
            this.context.lineTo(this.width - 1, woodHeight);
            this.context.stroke();

            this.context.restore();
          }
        }
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
        cfg.canDie = true
        cfg.isDead = false
        cfg.isAlive = true
        cfg.enemy = true
        cfg.isMonster = true
        cfg.health = 100
        cfg.collisionDamage = 50
        if (ch === 'B') {
          cfg.health = 2 // 200
          cfg.collisionDamage = 25
          cfg.velocityY = 0
          cfg.velocityX = 0
          cfg.isJumping = true
          cfg.jumpForce = -350 // Меньше, чем у игрока
          cfg.moveSpeed = 300
          cfg.onGround = true
          cfg.facingRight = false

          // Запоминаем начальную позицию
          cfg.spawnX = x * tileSize
          cfg.spawnY = y * tileSize

          // Границы перемещения (10 тайлов в каждую сторону)
          cfg.boundaryLeft = cfg.spawnX - 12 * tileSize
          cfg.boundaryRight = cfg.spawnX + 12 * tileSize

          // Таймеры для принятия решений
          cfg.decisionTimer = 0
          cfg.decisionInterval = 1 // секунды между сменой поведения

          cfg.trashItems = []; // массив для хранения мусора
          cfg.maxTrashItems = 2; // максимальное количество мусора
          cfg.trashCooldown = 5; // секунды между созданием мусора
          cfg.trashTimer = 0; // таймер для отсчета
          cfg.trashLifespan = 10; // время жизни мусора в секундах
          cfg.trashDamage = 20; // урон от столкновения с мусором
          cfg.trashWidth = tileSize / 2; // размер мусора
          cfg.trashHeight = tileSize / 2;

          cfg.update = function(deltaTime) {
            if (!this.isAlive) return;

            // Гравитация
            if (!this.onGround) {
              this.velocityY += GRAVITY_DOWN * deltaTime; // Сила гравитации
            }

            // Обновляем таймер принятия решений
            this.decisionTimer -= deltaTime;
            if (this.decisionTimer <= 0) {
              // Время принять новое решение
              this.decisionTimer = this.decisionInterval;

              // Случайное решение: 0 - стоять, 1 - идти влево, 2 - идти вправо, 3 - прыгнуть
              const decision = Math.floor(Math.random() * 4);

              if (decision === 0) {
                // Стоять на месте
                this.velocityX = 0;
              } else if (decision === 1) {
                // Идти влево
                this.velocityX = -this.moveSpeed;
                this.facingRight = false;
              } else if (decision === 2) {
                // Идти вправо
                this.velocityX = this.moveSpeed;
                this.facingRight = true;
              } else if (decision === 3 && this.onGround) {
                // Прыгнуть, если на земле
                this.velocityY = this.jumpForce;
                this.onGround = false;
              }
            }

            // Проверяем границы
            if (this.x < this.boundaryLeft) {
              this.x = this.boundaryLeft;
              this.velocityX = this.moveSpeed; // Разворачиваемся, если достигли левой границы
              this.facingRight = true;
            } else if (this.x > this.boundaryRight) {
              this.x = this.boundaryRight;
              this.velocityX = -this.moveSpeed; // Разворачиваемся, если достигли правой границы
              this.facingRight = false;
            }

            // Применяем движение
            this.x += this.velocityX * deltaTime;
            this.y += this.velocityY * deltaTime;

            // Логика создания мусора
            this.trashTimer += deltaTime;
            if (this.trashTimer >= this.trashCooldown && this.trashItems.length < this.maxTrashItems) {
              // Создаем новый мусор
              this.trashItems.push(Sprite({
                x: this.x + this.width / 2 - this.trashWidth / 2, // центрируем относительно босса
                y: this.y + this.height - this.trashHeight, // внизу босса
                width: this.trashWidth,
                height: this.trashHeight,
                timeLeft: this.trashLifespan, // время жизни в секундах
                canDie: true,
                isDead: false,
                isAlive: true,
                enemy: true,
                isMonster: true,
                health: 50,
                collisionDamage: 15,
                isVisible: true,
                type: 'B'
              }));

              this.trashTimer = 0; // сбрасываем таймер
            }

            // Обновляем все существующие мусоры
            for (let i = this.trashItems.length - 1; i >= 0; i--) {
              const trash = this.trashItems[i];
              trash.timeLeft -= deltaTime;

              // Удаляем мусор, если его время истекло
              if (trash.timeLeft <= 0) {
                this.trashItems.splice(i, 1);
              }
            }

            // Здесь нужна будет проверка коллизий с землей и препятствиями
            // ...
          };

          cfg.renderTrash = function(ctx) {
            for (const trash of this.trashItems) {
              // Отрисовка мусора (простой квадрат)
              this.context.fillStyle = 'rgba(150, 75, 0, 0.8)'; // коричневый с прозрачностью
              this.context.fillRect(trash.x, trash.y, trash.width, trash.height);

              // Можно добавить детали, чтобы он выглядел как мусор
              this.fillStyle = 'rgba(100, 50, 0, 0.9)';
              const segments = 3;
              const segWidth = trash.width / segments;
              const segHeight = trash.height / segments;

              for (let i = 0; i < segments; i++) {
                for (let j = 0; j < segments; j++) {
                  if ((i + j) % 2 === 0) {
                    this.context.fillRect(
                      trash.x + i * segWidth,
                      trash.y + j * segHeight,
                      segWidth,
                      segHeight
                    );
                  }
                }
              }
            }
          };
        }
        if (ch === 'X') {
          cfg.isMonster = false
          cfg.collides = true
          cfg.health = 12
          cfg.breakable = true
        }
        if (ch === 'E') {
          cfg.update = function (deltaTime) {
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
          }
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

  return gameObjects
}
