import {drawPixels, isCollided} from './utils'

export function checkEnemyCollisionWithEnvironment(o, e, clds) {
  o.forEach(obstacle => {
    if (!clds(obstacle, e)) return

    if (e.y + e.height > obstacle.y &&
      e.y + e.height < obstacle.y + obstacle.height / 2) {
      e.y = obstacle.y - e.height
      e.velocityY = 0
      e.onGround = true
    } else if (e.velocityX > 0 && e.x + e.width > obstacle.x &&
      e.x < obstacle.x) {
      e.x = obstacle.x - e.width
      e.facingRight = false
      e.velocityX *= -1
    } else if (e.velocityX < 0 && e.x < obstacle.x + obstacle.width &&
      e.x + e.width > obstacle.x + obstacle.width) {
      e.x = obstacle.x + obstacle.width
      e.facingRight = true
      e.velocityX *= -1
    }
  })
}

export function createPoop(x, y, gameObjects, Sprite, lifeSpan = -100) {
    gameObjects.enemies.push(
      Sprite({
        canDie: true,
        color: 'brown',
        createdAt: Date.now(),
        facingRight: Math.random() > 0.5,
        dt: 0,
        frame: 0,
        framesLength: 2,
        health: 5, //depends on level
        moveSpeed: 20, // depend on level or size
        height: 15,
        isAlive: true,
        isDead: false,
        isMonster: false,
        jumpTimer: 0,
        onGround: false,
        size: 1,
        transformAt: Date.now() + 5000,
        type: 'P',
        velocityX: 0,
        velocityY: 0,
        width: 15,
        decisionTimer: 0,
        decisionInterval: 5,
        lifeSpan,
        x,
        y,
        render() {
          renderPoop(
            this.context,
            this.width,
            this.height,
            {
              isMonster: this.isMonster,
              frameIndex: this.frame,
              scale: this.size,
              flipX: this.direction !== 'left',
            })
        },
        update(deltaTime) {
          if (!this.onGround) {
            this.velocityY += 780 * deltaTime
          }

          this.y += this.velocityY * deltaTime
          this.x += this.velocityX * deltaTime
          this.onGround = false

          this.lifeSpan -= deltaTime;
          if (this.lifeSpan <= 0 && lifeSpan > -100) {
            this.isDead = true;
            this.isAlive = false;
          }

          if (!this.isMonster) {
            this.dt += deltaTime;
            if (this.dt > 0.07) {
              this.frame = (this.frame + 1) % this.framesLength;
              this.dt = 0;
            }
            if (Date.now() >= this.transformAt) {
              this.isMonster = true
              this.velocityX = this.moveSpeed;
            }
          } else {
            updateMonsterBehavior(this, deltaTime)
          }
        },
      })
    );
}

export function checkEnemyCollisions(p, enemies, states) {
  enemies.forEach((e) => {
    if (isCollided(p, e)) {
      if (e.type === 'E' || e.type === 'P' || e.type === 'B') {
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
      '00002200002200000000',
      '00000200002200000000',
      '00000000000000000020',
      '02000022000011000020',
      '02000000000111100000',
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
      '00000022000000000000',
      '02000022000002200000',
      '00000000000000000000',
      '00002000000011000000',
      '00002000000111100000',
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

export function updateMonsterBehavior(monster, deltaTime) {
  monster.decisionTimer -= deltaTime;
  if (monster.decisionTimer <= 0) {
    monster.decisionTimer = monster.decisionInterval;
    const decision = Math.floor(Math.random() * 4);

    if (decision === 0) {
      monster.velocityX = 0;
    } else if (decision === 1) {
      monster.velocityX = -monster.moveSpeed;
      monster.facingRight = false;
    } else if (decision === 2) {
      monster.velocityX = monster.moveSpeed;
      monster.facingRight = true;
    } else if (decision === 3 && monster.onGround) {
      monster.velocityY = monster.jumpForce;
      monster.onGround = false;
    }
  }
  return monster;
}

export function rndrRobotVac(sprite, {
  baseColor = "#555",
  frameColor = "#b1b1b1",
  buttonColor = "#0f0"
} = {}) {
  const { context, width, height } = sprite;

  // Используем fillRect вместо rect + fill
  // Рисуем прямоугольники
  context.fillStyle = baseColor;
  context.fillRect(0, height - 8, width, 10);

  context.fillStyle = frameColor;
  context.fillRect(0, height - 13, width, 5);

  context.fillStyle = "#222";
  context.fillRect(0, height - 19, width * 0.2, height * 0.3);

  // Кнопка на крышке
  context.fillStyle = buttonColor;
  context.beginPath();
  context.arc(13, height - 15, height * 0.15, 0, Math.PI * 2);
  context.fill();
}

export function rndrTrashCan(sprite, {
  bodyColor = "#444",
  lidColor = "#333",
  highlightColor = "#555",
  scale = 1
} = {}) {
  const { context, width, height } = sprite;

  const w = width;
  const h = height;

  context.save();
  context.translate(w / 2, h / 2);
  context.scale(scale, scale);
  context.translate(-w / 2, -h / 2);

  // Группируем элементы по цвету для минимизации переключений fillStyle
  // 1. Элементы цвета bodyColor
  context.fillStyle = bodyColor;
  context.fillRect(w * 0.1, h * 0.3, w * 0.8, h * 0.7);

  // 2. Элементы цвета lidColor
  context.fillStyle = lidColor;
  context.fillRect(w * 0.05, h * 0.2, w * 0.9, h * 0.1);
  context.fillRect(w * 0.1, h * 0.9, w * 0.8, h * 0.1);

  // 3. Элементы цвета highlightColor (полосы)
  context.fillStyle = highlightColor;
  // Рисуем все полосы за один цикл
  const stripes = [
    [w * 0.25, h * 0.3, w * 0.05, h * 0.7],  // левая
    [w * 0.475, h * 0.3, w * 0.05, h * 0.7], // центральная
    [w * 0.7, h * 0.3, w * 0.05, h * 0.7]    // правая
  ];

  for (const [x, y, width, height] of stripes) {
    context.fillRect(x, y, width, height);
  }

  // 4. Отверстие для мусора
  context.fillStyle = "#111";
  context.fillRect(w * 0.3, h * 0.22, w * 0.4, h * 0.06);

  // 5. Блик сверху
  context.fillStyle = "rgba(255,255,255,0.1)";
  context.fillRect(w * 0.1, h * 0.3, w * 0.8, h * 0.05);

  context.restore();
}

export function renderRat(sprite, options = { }) {
  const {context: ctx } = sprite;
  const {
    frameIndex = 0,
    scale = 1,
    flipX = false,
  } = options;

  if (scale === 3) {
    ctx.translate(0, -19);
  }

  const walkFrame = [
    [
      '00000000000000000000000110000000',
      '00000000000000001111001771000000',
      '00000000000000113333111753111110',
      '00000000000011338888332533333351',
      '00000000111133888888888888188810',
      '00000011756188888888888888881100',
      '00000177111128888288888881110000',
      '00001711000018882222288810000000',
      '00017100000018821111188210000000',
      '01171000000018211100018110000000',
      '17710000000015116100001510000000',
      '01100000000015516100001571000000',
      '00000000000001111000000110000000',
    ],[
      '00000000000000000000000000000000',
      '00000000000000011110000110000000',
      '00000000000011133331101771000000',
      '00000000111133388883311753111110',
      '00000011756188888888832533333351',
      '00000177111128888888888888888810',
      '00001711000018882888888888881100',
      '00017100000018822222888881110000',
      '01171000000018211111188210000000',
      '17710000000182101100182111000000',
      '01100000001751001611511166100000',
      '00000000001510001661551016100000',
      '00000000000100000110110001000000',

    ],
  ];
  const colors = [
    "rgba(255,255,255,0)",
    "#000000",
    "#292929",
    "#4d4d4d",
    "rgba(133,73,0,0)",
    "#9c6974",
    "#6e4a52",
    "#c08d98",
    "#3c3c3c",
  ]
  drawPixels(ctx, walkFrame[frameIndex], {scale, colors, flipX,})
}