import {GRAVITY_DOWN} from './utils'
import {renderWoodConcreteFloor} from './tileHelpers'

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

      if (['W','M','m','N','w','F','C', '#', 'f'].includes(ch)) {
        if (ch === 'f') {
          cfg.isVisible = false
        }
        cfg.collides = true
        if (ch === 'F') {
          cfg.render = function (deltaTime) {
            renderWoodConcreteFloor(this.context, this.width, this.height, this.x, this.y)
          }
        } else if (['M','W','N'].includes(ch)) {
          cfg.render = function (deltaTime) {
            this.context.save();

            // Создаем простой псевдослучайный генератор на основе позиции блока
            const seed = (this.x * 10000 + this.y);
            let seedValue = seed;
            const random = function() {
              let x = Math.sin(seedValue++) * 10000;
              return x - Math.floor(x);
            };

            // Определяем основные цвета
            const concreteColor = "rgb(180, 180, 180)"; // Бетон
            const dryWallColor = "rgb(240, 235, 225)"; // Гипсокартон/обои (светло-бежевый)

            // Определяем ширину панели гипсокартона
            const panelWidth = 4 + Math.floor(random() * 2); // 4-5 пикселей для гипсокартона

            // Сначала заполняем весь блок бетонным цветом (как основа)
            this.context.fillStyle = concreteColor;
            this.context.fillRect(0, 0, this.width, this.height);

            // В зависимости от типа блока добавляем гипсокартонные панели
            this.context.fillStyle = dryWallColor;

            if (this.type === "W") {
              // Панель слева
              this.context.fillRect(0, 0, panelWidth, this.height);

              // Добавляем рамку для левой панели
              this.context.fillStyle = dryWallColor;
              this.context.fillRect(0, 0, panelWidth, 1); // Верхний левый угол
              this.context.fillRect(0, this.height - 1, panelWidth, 1); // Нижний левый угол
              this.context.fillRect(0, 0, 1, this.height); // Левая граница
            }
            else if (this.type === "M") {
              // Панель справа
              this.context.fillRect(this.width - panelWidth, 0, panelWidth, this.height);

              // Добавляем рамку для правой панели
              this.context.fillStyle = dryWallColor;
              this.context.fillRect(this.width - panelWidth, 0, panelWidth, 1); // Верхний правый угол
              this.context.fillRect(this.width - panelWidth, this.height - 1, panelWidth, 1); // Нижний правый угол
              this.context.fillRect(this.width - 1, 0, 1, this.height); // Правая граница
            }
            else if (this.type === "N") {
              // Панели слева и справа
              this.context.fillRect(0, 0, panelWidth, this.height); // Левая панель
              this.context.fillRect(this.width - panelWidth, 0, panelWidth, this.height); // Правая панель

              // Добавляем рамку для обеих панелей
              this.context.fillStyle = dryWallColor;
              // Для левой панели
              this.context.fillRect(0, 0, panelWidth, 1); // Верхний левый угол
              this.context.fillRect(0, this.height - 1, panelWidth, 1); // Нижний левый угол
              this.context.fillRect(0, 0, 1, this.height); // Левая граница
              // Для правой панели
              this.context.fillRect(this.width - panelWidth, 0, panelWidth, 1); // Верхний правый угол
              this.context.fillRect(this.width - panelWidth, this.height - 1, panelWidth, 1); // Нижний правый угол
              this.context.fillRect(this.width - 1, 0, 1, this.height); // Правая граница
            }

            // Добавляем оставшиеся части рамки для бетонной части
            this.context.fillStyle = concreteColor;

            if (this.type === "W") {
              // Бетонная часть справа при левой панели
              this.context.fillRect(panelWidth, 0, this.width - panelWidth, 1); // Верхняя граница (бетонная часть)
              this.context.fillRect(panelWidth, this.height - 1, this.width - panelWidth, 1); // Нижняя граница (бетонная часть)
              this.context.fillRect(this.width - 1, 0, 1, this.height); // Правая граница
            }
            else if (this.type === "M") {
              // Бетонная часть слева при правой панели
              this.context.fillRect(0, 0, this.width - panelWidth, 1); // Верхняя граница (бетонная часть)
              this.context.fillRect(0, this.height - 1, this.width - panelWidth, 1); // Нижняя граница (бетонная часть)
              this.context.fillRect(0, 0, 1, this.height); // Левая граница
            }
            else if (this.type === "N") {
              // Бетонная часть посередине
              this.context.fillRect(panelWidth, 0, this.width - panelWidth * 2, 1); // Верхняя граница (бетонная часть)
              this.context.fillRect(panelWidth, this.height - 1, this.width - panelWidth * 2, 1); // Нижняя граница (бетонная часть)
            }
            else {
              // Если тип не определен, то рисуем полностью бетонную рамку
              this.context.fillRect(0, 0, this.width, 1); // Верхняя граница
              this.context.fillRect(0, this.height - 1, this.width, 1); // Нижняя граница
              this.context.fillRect(0, 0, 1, this.height); // Левая граница
              this.context.fillRect(this.width - 1, 0, 1, this.height); // Правая граница
            }

            // Добавляем текстуру бетона (случайные точки и маленькие пятна)
            const maxSpotSize = 1;

            for (let i = 0; i < 80; i++) {
              // Определяем область для текстуры бетона в зависимости от типа
              let x, y;

              if (this.type === "W") {
                x = panelWidth + 1 + random() * (this.width - panelWidth - 2); // Бетон справа
                y = 1 + random() * (this.height - 2);
              }
              else if (this.type === "M") {
                x = 1 + random() * (this.width - panelWidth - 2); // Бетон слева
                y = 1 + random() * (this.height - 2);
              }
              else if (this.type === "N") {
                x = panelWidth + 1 + random() * (this.width - panelWidth * 2 - 2); // Бетон в центре
                y = 1 + random() * (this.height - 2);
              }
              else {
                x = 1 + random() * (this.width - 2); // Весь блок бетон
                y = 1 + random() * (this.height - 2);
              }

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

            const crackCount = 1 + Math.floor(random() * 2); // 1-2 трещины

            for (let i = 0; i < crackCount; i++) {
              // Определяем область для трещин в зависимости от типа
              let startX, startY;

              if (this.type === "W") {
                startX = panelWidth + 5 + random() * (this.width - panelWidth - 10); // Трещины в бетоне справа
                startY = 5 + random() * (this.height - 10);
              }
              else if (this.type === "M") {
                startX = 5 + random() * (this.width - panelWidth - 10); // Трещины в бетоне слева
                startY = 5 + random() * (this.height - 10);
              }
              else if (this.type === "N") {
                startX = panelWidth + 5 + random() * (this.width - panelWidth * 2 - 10); // Трещины в бетоне в центре
                startY = 5 + random() * (this.height - 10);
              }
              else {
                startX = 5 + random() * (this.width - 10); // Трещины по всему блоку
                startY = 5 + random() * (this.height - 10);
              }

              this.context.beginPath();
              this.context.moveTo(startX, startY);

              let currentX = startX;
              let currentY = startY;

              const segments = 2 + Math.floor(random() * 3);

              for (let j = 0; j < segments; j++) {
                const deltaX = -3 + random() * 6;
                const deltaY = -3 + random() * 6;

                currentX += deltaX;
                currentY += deltaY;

                // Ограничиваем координаты в пределах бетонной части
                currentY = Math.max(2, Math.min(this.height - 2, currentY));

                if (this.type === "W") {
                  currentX = Math.max(panelWidth + 2, Math.min(this.width - 2, currentX));
                }
                else if (this.type === "M") {
                  currentX = Math.max(2, Math.min(this.width - panelWidth - 2, currentX));
                }
                else if (this.type === "N") {
                  currentX = Math.max(panelWidth + 2, Math.min(this.width - panelWidth - 2, currentX));
                }
                else {
                  currentX = Math.max(2, Math.min(this.width - 2, currentX));
                }

                this.context.lineTo(currentX, currentY);
              }

              this.context.stroke();
            }

            // Добавляем текстуру для гипсокартона/обоев
            if (this.type === "W" || this.type === "M" || this.type === "N") {
              const useStripedPattern = random() < 0.5;

              if (useStripedPattern) {
                // Полосатый узор
                this.context.strokeStyle = "rgba(200, 190, 180, 0.3)";
                this.context.lineWidth = 0.5;

                if (this.type === "W" || this.type === "N") {
                  // Левая панель - вертикальные полосы
                  for (let i = 1; i < panelWidth; i += 1.5) {
                    this.context.beginPath();
                    this.context.moveTo(i, 0);
                    this.context.lineTo(i, this.height);
                    this.context.stroke();
                  }
                }

                if (this.type === "M" || this.type === "N") {
                  // Правая панель - вертикальные полосы
                  for (let i = this.width - panelWidth + 1; i < this.width; i += 1.5) {
                    this.context.beginPath();
                    this.context.moveTo(i, 0);
                    this.context.lineTo(i, this.height);
                    this.context.stroke();
                  }
                }
              }
              else {
                // Мелкий узор
                // Для левой панели (если есть)
                if (this.type === "W" || this.type === "N") {
                  for (let i = 0; i < 20; i++) {
                    const x = 1 + random() * (panelWidth - 2);
                    const y = 1 + random() * (this.height - 2);
                    const size = 0.5 + random() * 0.7;

                    // Мелкий узор немного другого оттенка
                    this.context.fillStyle = `rgba(${210 + Math.floor(random() * 30)}, ${
                      200 + Math.floor(random() * 30)}, ${
                      190 + Math.floor(random() * 30)}, 0.2)`;

                    this.context.beginPath();
                    this.context.rect(x, y, size, size);
                    this.context.fill();
                  }
                }

                // Для правой панели (если есть)
                if (this.type === "M" || this.type === "N") {
                  for (let i = 0; i < 20; i++) {
                    const x = this.width - panelWidth + 1 + random() * (panelWidth - 2);
                    const y = 1 + random() * (this.height - 2);
                    const size = 0.5 + random() * 0.7;

                    // Мелкий узор немного другого оттенка
                    this.context.fillStyle = `rgba(${210 + Math.floor(random() * 30)}, ${
                      200 + Math.floor(random() * 30)}, ${
                      190 + Math.floor(random() * 30)}, 0.2)`;

                    this.context.beginPath();
                    this.context.rect(x, y, size, size);
                    this.context.fill();
                  }
                }
              }
            }

            // Добавляем линии соединения между бетоном и гипсокартоном
            this.context.strokeStyle = "rgba(140, 140, 140, 0.4)";
            this.context.lineWidth = 1;

            if (this.type === "W" || this.type === "N") {
              // Граница между бетоном и левой панелью
              this.context.beginPath();
              this.context.moveTo(panelWidth, 0);
              this.context.lineTo(panelWidth, this.height);
              this.context.stroke();
            }

            if (this.type === "M" || this.type === "N") {
              // Граница между бетоном и правой панелью
              this.context.beginPath();
              this.context.moveTo(this.width - panelWidth, 0);
              this.context.lineTo(this.width - panelWidth, this.height);
              this.context.stroke();
            }

            this.context.restore();
          }
        } else if (ch === 'w' || ch === 'm') {
          cfg.render = function (deltaTime) {
            this.context.save();

            // Создаем простой псевдослучайный генератор на основе позиции блока
            const seed = (this.x * 10000 + this.y);
            let seedValue = seed;
            const random = function() {
              let x = Math.sin(seedValue++) * 10000;
              return x - Math.floor(x);
            };

            // Определяем основные цвета
            const concreteColor = "rgb(180, 180, 180)"; // Бетон
            const dryWallColor = "rgb(240, 235, 225)"; // Гипсокартон/обои (светло-бежевый)

            // Определяем высоту панели гипсокартона
            const panelHeight = 4 + Math.floor(random() * 2); // 4-5 пикселей для гипсокартона

            // Сначала заполняем весь блок бетонным цветом (как основа)
            this.context.fillStyle = concreteColor;
            this.context.fillRect(0, 0, this.width, this.height);

            // В зависимости от типа блока добавляем гипсокартонную панель снизу или сверху
            this.context.fillStyle = dryWallColor;

            if (this.type === "w") {
              // Панель снизу
              this.context.fillRect(0, this.height - panelHeight, this.width, panelHeight); // Нижняя панель

              // Добавляем рамку для нижней панели
              this.context.fillStyle = dryWallColor;
              this.context.fillRect(0, this.height - panelHeight, 1, panelHeight); // Нижний левый угол
              this.context.fillRect(this.width - 1, this.height - panelHeight, 1, panelHeight); // Нижний правый угол
              this.context.fillRect(0, this.height - 1, this.width, 1); // Нижняя граница
            }
            else if (this.type === "m") {
              // Панель сверху
              this.context.fillRect(0, 0, this.width, panelHeight); // Верхняя панель

              // Добавляем рамку для верхней панели
              this.context.fillStyle = dryWallColor;
              this.context.fillRect(0, 0, 1, panelHeight); // Верхний левый угол
              this.context.fillRect(this.width - 1, 0, 1, panelHeight); // Верхний правый угол
              this.context.fillRect(0, 0, this.width, 1); // Верхняя граница
            }

            // Добавляем оставшиеся части рамки для бетонной части
            this.context.fillStyle = concreteColor;

            if (this.type === "w") {
              // Бетонная часть сверху при нижней панели
              this.context.fillRect(0, 0, this.width, 1); // Верхняя граница
              this.context.fillRect(0, 0, 1, this.height - panelHeight); // Левая граница (бетонная часть)
              this.context.fillRect(this.width - 1, 0, 1, this.height - panelHeight); // Правая граница (бетонная часть)
            }
            else if (this.type === "m") {
              // Бетонная часть снизу при верхней панели
              this.context.fillRect(0, this.height - 1, this.width, 1); // Нижняя граница
              this.context.fillRect(0, panelHeight, 1, this.height - panelHeight); // Левая граница (бетонная часть)
              this.context.fillRect(this.width - 1, panelHeight, 1, this.height - panelHeight); // Правая граница (бетонная часть)
            }
            else {
              // Если тип не m и не w, то рисуем полностью бетонную рамку
              this.context.fillRect(0, 0, this.width, 1); // Верхняя граница
              this.context.fillRect(0, this.height - 1, this.width, 1); // Нижняя граница
              this.context.fillRect(0, 0, 1, this.height); // Левая граница
              this.context.fillRect(this.width - 1, 0, 1, this.height); // Правая граница
            }

            // Добавляем текстуру бетона (случайные точки и маленькие пятна)
            const maxSpotSize = 1;

            for (let i = 0; i < 80; i++) {
              // Определяем область для текстуры бетона в зависимости от типа
              let x, y;

              if (this.type === "w") {
                x = 1 + random() * (this.width - 2);
                y = 1 + random() * (this.height - panelHeight - 2); // Бетон сверху
              }
              else if (this.type === "m") {
                x = 1 + random() * (this.width - 2);
                y = panelHeight + 1 + random() * (this.height - panelHeight - 2); // Бетон снизу
              }
              else {
                x = 1 + random() * (this.width - 2);
                y = 1 + random() * (this.height - 2); // Весь блок бетон
              }

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

            const crackCount = 1 + Math.floor(random() * 2); // 1-2 трещины

            for (let i = 0; i < crackCount; i++) {
              // Определяем область для трещин в зависимости от типа
              let startX, startY;

              if (this.type === "w") {
                startX = 5 + random() * (this.width - 10);
                startY = 5 + random() * (this.height - panelHeight - 10); // Трещины в бетоне сверху
              }
              else if (this.type === "m") {
                startX = 5 + random() * (this.width - 10);
                startY = panelHeight + 5 + random() * (this.height - panelHeight - 10); // Трещины в бетоне снизу
              }
              else {
                startX = 5 + random() * (this.width - 10);
                startY = 5 + random() * (this.height - 10); // Трещины по всему блоку
              }

              this.context.beginPath();
              this.context.moveTo(startX, startY);

              let currentX = startX;
              let currentY = startY;

              const segments = 2 + Math.floor(random() * 3);

              for (let j = 0; j < segments; j++) {
                const deltaX = -3 + random() * 6;
                const deltaY = -3 + random() * 6;

                currentX += deltaX;
                currentY += deltaY;

                // Ограничиваем координаты в пределах бетонной части
                currentX = Math.max(2, Math.min(this.width - 2, currentX));

                if (this.type === "w") {
                  currentY = Math.max(2, Math.min(this.height - panelHeight - 2, currentY));
                }
                else if (this.type === "m") {
                  currentY = Math.max(panelHeight + 2, Math.min(this.height - 2, currentY));
                }
                else {
                  currentY = Math.max(2, Math.min(this.height - 2, currentY));
                }

                this.context.lineTo(currentX, currentY);
              }

              this.context.stroke();
            }

            // Добавляем текстуру для гипсокартона/обоев
            if (this.type === "w" || this.type === "m") {
              const useStripedPattern = random() < 0.5;

              if (useStripedPattern) {
                // Полосатый узор
                this.context.strokeStyle = "rgba(200, 190, 180, 0.3)";
                this.context.lineWidth = 0.5;

                if (this.type === "w") {
                  // Нижняя панель - горизонтальные полосы
                  for (let i = this.height - panelHeight + 1; i < this.height; i += 1.5) {
                    this.context.beginPath();
                    this.context.moveTo(0, i);
                    this.context.lineTo(this.width, i);
                    this.context.stroke();
                  }
                }
                else if (this.type === "m") {
                  // Верхняя панель - горизонтальные полосы
                  for (let i = 1; i < panelHeight; i += 1.5) {
                    this.context.beginPath();
                    this.context.moveTo(0, i);
                    this.context.lineTo(this.width, i);
                    this.context.stroke();
                  }
                }
              }
              else {
                // Мелкий узор
                let startY, endY;

                if (this.type === "w") {
                  startY = this.height - panelHeight + 1;
                  endY = this.height - 1;
                }
                else if (this.type === "m") {
                  startY = 1;
                  endY = panelHeight - 1;
                }

                for (let i = 0; i < 20; i++) {
                  const x = 1 + random() * (this.width - 2);
                  const y = startY + random() * (endY - startY);
                  const size = 0.5 + random() * 0.7;

                  // Мелкий узор немного другого оттенка
                  this.context.fillStyle = `rgba(${210 + Math.floor(random() * 30)}, ${
                    200 + Math.floor(random() * 30)}, ${
                    190 + Math.floor(random() * 30)}, 0.2)`;

                  this.context.beginPath();
                  this.context.rect(x, y, size, size);
                  this.context.fill();
                }
              }
            }

            // Добавляем линию соединения между бетоном и гипсокартоном
            this.context.strokeStyle = "rgba(140, 140, 140, 0.4)";
            this.context.lineWidth = 1;

            if (this.type === "w") {
              // Граница между бетоном и нижней панелью
              this.context.beginPath();
              this.context.moveTo(0, this.height - panelHeight);
              this.context.lineTo(this.width, this.height - panelHeight);
              this.context.stroke();
            }
            else if (this.type === "m") {
              // Граница между бетоном и верхней панелью
              this.context.beginPath();
              this.context.moveTo(0, panelHeight);
              this.context.lineTo(this.width, panelHeight);
              this.context.stroke();
            }

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
