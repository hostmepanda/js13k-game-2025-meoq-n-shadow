import {loadLevel, updateCamera} from '../states/game'
import {parseLevel} from '../gameHelpers/levelParser'
import {initKeyboardControls} from '../gameHelpers/keyboard'
import {LEVEL_MAPS} from './maps'
import {JUMP_FORCE, MOVE_SPEED, renderBackground, renderUI, renderWithCamera} from '../gameHelpers/utils'
import {checkEnvironmentCollisions, checkFoodCollision, renderFoodItems} from '../gameHelpers/itemsUtils'
import {updateBlackCatAttack, updateCharacterPhysics} from '../gameHelpers/charactersUtils'
import {checkEnemyCollisions, checkEnemyCollisionWithEnvironment, createPoop} from '../gameHelpers/enemiesUtils'
import {CANVAS, GAME_STATE} from '../consts'
import {PlayerState as DefaultPlayerState} from '../states/player'
import {renderParallaxBackground} from '../gameHelpers/backgroundHelpers'

export function createLevel({ selectedLevel, gameStates, kontra}) {
  const {Sprite, canvas} = kontra

  const levelState = {
    level: {
      levelWidth: canvas.width * 5,
      levelHeight: canvas.height,
    },
  }

  Object.assign(
    gameStates.gameObjects,
    parseLevel({
      gameObjects: gameStates.gameObjects,
      levelMap: LEVEL_MAPS[selectedLevel],
      Sprite,
    }),
  )

  if (gameStates?.GameState) {
    gameStates.GameState.camera.levelBounds = {
      minX: 0,
      maxX: levelState.level.levelWidth - CANVAS.width,
      minY: 0,
      maxY: levelState.level.levelHeight - CANVAS.height,
    }
  }

  if (gameStates?.PlayerState) {
    Object.assign(gameStates.PlayerState, DefaultPlayerState)
  }

  gameStates.gameObjects.backgrounds.sunset = {
    render: function (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS.height)
      gradient.addColorStop(0, '#1a2b56')    // Темно-синий (верх неба)
      gradient.addColorStop(0.4, '#864d9e')  // Фиолетовый
      gradient.addColorStop(0.7, '#dd5e5e')  // Оранжево-красный
      gradient.addColorStop(0.9, '#f9d423')  // Желтый (у горизонта)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS.width, CANVAS.height)
    },
  }

  gameStates.gameObjects.keyboard = initKeyboardControls()
  gameStates.gameObjects.level = levelState.level

  return {
    gameObjects: gameStates.gameObjects,
    PlayerState: gameStates.PlayerState,
    GameState: gameStates.GameState,
  }
}

export function levelRender({ gameData, kontra}) {
  const {PlayerState, GameState, gameObjects } = gameData
  const { canvas, context} = kontra
  context.clearRect(0, 0, canvas.width, canvas.height)

  // renderBackground(context, canvas)
  renderParallaxBackground(context, GameState.camera.width, GameState.camera.height, GameState.camera.x, GameState.camera.y)

  renderWithCamera(context, GameState.camera, (ctx) => {
    if (gameObjects.obstacles.length > 0) {
      gameObjects.obstacles
      .filter(obstacle => obstacle.isVisible)
      .forEach(obstacle => {
        obstacle.render()
      })
    }

    if (gameObjects.collectables.length > 0) {
      renderFoodItems(context, gameObjects.collectables.filter(({ isVisible }) => isVisible))
      gameObjects.collectables
      .filter(({ isVisible }) => isVisible)
      .forEach(collectable => {collectable?.render?.()})
    }

    if (gameObjects.enemies.length > 0) {
      gameObjects.enemies
      .forEach(enemy => {
        enemy?.render?.()
        if (enemy.type === 'B') {
          enemy.renderTrash()
        }
      })
    }

    if (gameObjects.effects.length > 0) {
      gameObjects.effects.forEach(effect => {
        effect?.render?.()
      })
    }
    gameObjects.white.render()
    gameObjects.black.render()

    // Если кот атакует, добавляем визуализацию атаки
    if (gameObjects.black.isAttacking) {
      context.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Красное свечение

      // Направление атаки зависит от свойства facingRight
      if (gameObjects.black.facingRight) {
        // Атака вправо
        const attackX = gameObjects.black.x + gameObjects.black.width;
        context.fillRect(attackX, gameObjects.black.y, gameObjects.black.attackRange, gameObjects.black.height);
      } else {
        // Атака влево
        const attackX = gameObjects.black.x - gameObjects.black.attackRange;
        context.fillRect(attackX, gameObjects.black.y, gameObjects.black.attackRange, gameObjects.black.height);
      }
    }
  })

  renderUI(context, {
    currentLevel: GameState.currentState,
    cats: [
      {
        name: "Meoq",
        health: gameObjects.white.health,
        lives: PlayerState.white.lives,
        isActive: PlayerState.activeCharacter === 'white',
      },
      {
        name: "Shadow",
        health: gameObjects.black.health,
        lives: PlayerState.black.lives,
        isActive: PlayerState.activeCharacter === 'black',
      }
    ],
  });
}

export function updateLevel({gameStates, kontra}) {
  const { gameObjects, GameState, PlayerState} = gameStates
  const { Sprite, canvas, context, deltaTime, collides } = kontra
  const {keyboard} = gameObjects

  if (!gameObjects.white || !gameObjects.black) {
    console.error('Персонажи не определены!')
    return
  }

  if (PlayerState.activeCharacter === undefined) {
    PlayerState.activeCharacter = 'white' // По умолчанию выбран белый персонаж
  }

  // Обработка переключения персонажа по нажатию Shift
  if (keyboard.isKeyPressed('ShiftLeft') || keyboard.isKeyPressed('ShiftRight')) {
    // Используем debounce, чтобы предотвратить многократное переключение при удержании
    if (!PlayerState.lastShiftTime || Date.now() - PlayerState.lastShiftTime > 300) {
      PlayerState.activeCharacter = PlayerState.activeCharacter === 'white' ? 'black' : 'white'
      PlayerState.lastShiftTime = Date.now()
    }
  }

  const activeCharacter = PlayerState.activeCharacter === 'white' ? gameObjects.white : gameObjects.black
  const cats = [gameObjects.white, gameObjects.black]
  const boss = gameObjects.enemies?.find(({ type }) => type === 'B')
  cats.forEach((player) => {
    updateCharacterPhysics(player, deltaTime)
    checkEnemyCollisions(
      player,
      [
        ...gameObjects.enemies,
        ...(boss?.isAlive ? boss.trashItems: []),
      ],
      { PlayerState, GameState },
    )
    checkEnvironmentCollisions(
      player,
      [
        ...gameObjects.obstacles.filter(({ isVisible, collides }) => isVisible && collides),
        ...gameObjects.enemies.filter(({ isVisible, collides }) => isVisible && collides),
        ]
      , deltaTime, GameState, collides);
  })

  gameObjects.enemies.forEach((enemy) => {
    enemy.update(deltaTime)
    checkEnemyCollisionWithEnvironment(
      [
        ...gameObjects.obstacles.filter(({ collides }) => collides),
        ...gameObjects.enemies.filter(({ collides }) => collides),
      ],
      enemy,
    )
  })

  updateBlackCatAttack(activeCharacter, gameObjects, deltaTime)

  // Управление активным персонажем
  if (keyboard.isKeyPressed('KeyW') && activeCharacter.onGround) {
    activeCharacter.velocityY = activeCharacter.jumpForce || JUMP_FORCE
    activeCharacter.isJumping = true
    activeCharacter.onGround = false
  }
  const currentMoveSpeed = activeCharacter.moveSpeed || MOVE_SPEED

  if (keyboard.isKeyPressed('KeyA')) {
    activeCharacter.x -= currentMoveSpeed * deltaTime
    activeCharacter.facingRight = false;
    activeCharacter.isMoving = true;
  }
  if (keyboard.isKeyPressed('KeyD')) {
    activeCharacter.x += currentMoveSpeed * deltaTime
    activeCharacter.facingRight = true;
    activeCharacter.isMoving = true;
  }

  if (!keyboard.isKeyPressed('KeyA') && !keyboard.isKeyPressed('KeyD')) {
    activeCharacter.isMoving = false;
  }

  if (keyboard.isKeyPressed('Space') && !activeCharacter.poopCooldown) {
    if (PlayerState.activeCharacter === 'white') {
      if (createPoop(activeCharacter, gameObjects, Sprite)) {
        // Устанавливаем задержку на какание, чтобы не спамить
        activeCharacter.poopCooldown = true

        // Сбрасываем задержку через 1 секунду
        setTimeout(() => {
          activeCharacter.poopCooldown = false
        }, 1000)
      }
    }
    if (PlayerState.activeCharacter === 'black' && !activeCharacter.isAttacking && activeCharacter.canAttack) {
      activeCharacter.isAttacking = true;
      activeCharacter.attackTimer = activeCharacter.attackDuration;
      activeCharacter.canAttack = false; // Запрещаем атаковать до истечения cooldown
      activeCharacter.attackCooldownTimer = activeCharacter.attackCooldown; // Устанавливаем таймер перезарядки

      // Здесь можно добавить звук атаки, если есть
      // playSound('blackAttack');
    }
  }

  // Проверка столкновений с едой для белого кота
  checkFoodCollision(gameObjects.white, gameObjects.collectables)

  // Ограничиваем движение персонажей границами уровня
  gameObjects.white.x = Math.max(0, Math.min(gameObjects.white.x, canvas.width * 7 - gameObjects.white.width))
  gameObjects.black.x = Math.max(0, Math.min(gameObjects.black.x, canvas.width * 7 - gameObjects.black.width))

  updateCamera(GameState, activeCharacter)

  // Визуальное обозначение активного персонажа
  gameObjects.white.alpha = PlayerState.activeCharacter === 'white' ? 1.0 : 0.7
  gameObjects.black.alpha = PlayerState.activeCharacter === 'black' ? 1.0 : 0.7
  gameObjects.enemies = gameObjects.enemies.filter(({ isDead }) => !isDead )
  gameObjects.collectables = gameObjects.collectables.filter(({ collected }) => !collected )
  if (!gameObjects.white.isAlive || !gameObjects.black.isAlive) {
    GameState.nextLevel = GAME_STATE.GAMEOVER
  }

  if (GameState.nextLevel !== GameState.currentState) {
    switchLevel(GameState.nextLevel, { GameState, gameObjects, PlayerState}, {Sprite, canvas, context})
  }
}

function switchLevel(targetLevel, { GameState, gameObjects, PlayerState}, {Sprite, canvas, context}) {
  if ([
    GAME_STATE.LEVEL1,
    GAME_STATE.LEVEL2,
    GAME_STATE.LEVEL3,
    GAME_STATE.LEVEL4,
  ].includes(targetLevel)) {
    const updatedLevel = loadLevel(targetLevel, { gameObjects }, {Sprite, canvas, context})
    Object.assign(gameObjects, updatedLevel.gameObjects)
  }

  GameState.currentState = targetLevel
}

export function createDefaultLevel() {
  return {
    black: null,
    white: null,
    exit: null,
    start: null,
    keyboard: {},
    backgrounds: [],
    level: {},
    obstacles: [],
    collectables: [],
    enemies: [],
    effects: [],
  };
}
