import {loadLevel, updateCamera} from '../states/game'
import {parseLevel} from '../gameHelpers/levelParser'
import {initKeyboardControls} from '../gameHelpers/keyboard'
import {LEVEL_MAPS} from './maps'
import {JUMP_FORCE, MOVE_SPEED, renderUI, renderWithCamera} from '../gameHelpers/utils'
import {checkEnvironmentCollisions, checkFoodCollision} from '../gameHelpers/itemsUtils'
import {updateBlackCatAttack, updateCharacterPhysics} from '../gameHelpers/charactersUtils'
import {checkEnemyCollisions, checkEnemyCollisionWithEnvironment, createPoop} from '../gameHelpers/enemiesUtils'
import {CANVAS, GAME_STATE} from '../consts'
import {PlayerState as DefaultPlayerState} from '../states/player'
import {renderParallaxBackground} from '../gameHelpers/backgroundHelpers'

function expandMap(map) {
  return map.map(row =>
    row.replace(/(\D)(\d*)/g, (_, ch, n) => ch.repeat(n ? +n : 1))
  );
}

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
      levelMap: expandMap(LEVEL_MAPS[selectedLevel]),
      selectedLevel,
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

  gameStates.gameObjects.keyboard = initKeyboardControls()
  gameStates.gameObjects.level = levelState.level

  return {
    gameObjects: gameStates.gameObjects,
    PlayerState: gameStates.PlayerState,
    GameState: gameStates.GameState,
  }
}

export function levelRender({ gameData, kontra}, levelBackgroundPatterns) {
  const {PlayerState, GameState, gameObjects } = gameData
  const { canvas, context} = kontra

  context.clearRect(0, 0, canvas.width, canvas.height)
  renderParallaxBackground(
    context,
    GameState.camera.width,
    GameState.camera.height,
    GameState.camera.x,
    GameState.camera.y,
    levelBackgroundPatterns,
  )

  renderWithCamera(context, GameState.camera, () => {
    [
      ...gameObjects.collectables.filter(({ isVisible, collected }) => isVisible && !collected),
      ...gameObjects.obstacles.filter(obstacle => obstacle.isVisible),
      ...gameObjects.enemies,
      gameObjects.white,
      gameObjects.black,
      ...(gameObjects?.pink ? [gameObjects.pink] : []),
    ].forEach(e => e.render?.())

    // Если кот атакует, добавляем визуализацию атаки
    if (gameObjects.black.isAttacking) {
      context.fillStyle = 'rgba(255,255,255)'; // Красное свечение
      const attackY = gameObjects.black.y + gameObjects.black.width / 2
      // Направление атаки зависит от свойства facingRight
      context.beginPath();

      if (gameObjects.black.facingRight) {
        // Атака вправо
        const attackX = gameObjects.black.x + gameObjects.black.width;
        context.arc(attackX, attackY, gameObjects.black.attackRange, Math.PI/2, -Math.PI/2, true); // правая половина
      } else {
        // Атака влево
        const attackX = gameObjects.black.x
        context.arc(attackX, attackY, gameObjects.black.attackRange, -Math.PI/2, Math.PI/2, true); // левая половина
      }

      context.closePath();
      context.fill();
    }
  })

  renderUI({context, canvas}, {
    playerState: {
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
    },
    GameState,
  });
}

export function updateLevel({gameStates, kontra}, levelBackgroundPatterns) {
  const { gameObjects, GameState, PlayerState} = gameStates
  const { Sprite, canvas, context, deltaTime, collides } = kontra
  const {keyboard} = gameObjects

  if (PlayerState.activeCharacter === undefined) {
    PlayerState.activeCharacter = 'white' // По умолчанию выбран белый персонаж
  }

  if (keyboard.isKeyPressed('ShiftLeft') || keyboard.isKeyPressed('ShiftRight')) {
    // Используем debounce, чтобы предотвратить многократное переключение при удержании
    if (!PlayerState.lastShiftTime || Date.now() - PlayerState.lastShiftTime > 300) {
      PlayerState.activeCharacter = PlayerState.activeCharacter === 'white' ? 'black' : 'white'
      PlayerState.lastShiftTime = Date.now()
    }
  }

  const activeCharacter = PlayerState.activeCharacter === 'white' ? gameObjects.white : gameObjects.black
  const cats = [gameObjects.white, gameObjects.black, ...gameObjects.pink ? [gameObjects.pink] : []]
  cats.forEach((player) => {
    player.update(deltaTime)
    updateCharacterPhysics(player, deltaTime)
    checkEnemyCollisions(
      player,
      gameObjects.enemies,
      { PlayerState, GameState },
    )
    checkEnvironmentCollisions(
      player,
      [
        ...gameObjects.obstacles.filter(({ isVisible, collides }) => isVisible && collides),
        ...gameObjects.enemies.filter(({ isVisible, collides }) => isVisible && collides),
        ]
      , deltaTime, GameState, collides)
    checkFoodCollision(player, gameObjects.collectables.filter(({ collected, isVisible }) => !collected && isVisible ), collides)
  })

  gameObjects.enemies.forEach((enemy) => {
    enemy.update(deltaTime)
    checkEnemyCollisionWithEnvironment(
      [
        ...gameObjects.obstacles.filter(({ collides, isVisible }) => collides && isVisible),
        ...gameObjects.enemies.filter(({ collides, isVisible }) => collides && isVisible),
      ],
      enemy,
      collides,
      deltaTime,
    )
  })

  gameObjects.collectables.forEach((collectable) => {
    collectable.update(deltaTime)
  })

  updateBlackCatAttack(activeCharacter, gameObjects, deltaTime)

  // Управление активным персонажем
  if ((keyboard.isKeyPressed('KeyW') || keyboard.isKeyPressed('ArrowUp'))&& activeCharacter.onGround) {
    activeCharacter.velocityY = activeCharacter.jumpForce || JUMP_FORCE
    activeCharacter.isJumping = true
    activeCharacter.onGround = false
  }
  const currentMoveSpeed = activeCharacter.moveSpeed || MOVE_SPEED

  if (keyboard.isKeyPressed('KeyA') || keyboard.isKeyPressed('ArrowLeft')) {
    activeCharacter.x -= currentMoveSpeed * deltaTime
    activeCharacter.facingRight = false;
    activeCharacter.isMoving = true;
  }
  if (keyboard.isKeyPressed('KeyD') || keyboard.isKeyPressed('ArrowRight')) {
    activeCharacter.x += currentMoveSpeed * deltaTime
    activeCharacter.facingRight = true;
    activeCharacter.isMoving = true;
  }

  if (!keyboard.isKeyPressed('KeyA') && !keyboard.isKeyPressed('KeyD') && !keyboard.isKeyPressed('ArrowLeft') && !keyboard.isKeyPressed('ArrowRight')) {
    activeCharacter.isMoving = false;
  }

  if (keyboard.isKeyPressed('Space')) {
    if (PlayerState.activeCharacter === 'white' && activeCharacter.sizeMultiplier > 1 && !activeCharacter.poopCooldown) {
      createPoop(
        activeCharacter.x,
        activeCharacter.y - 15,
        gameObjects, Sprite)
      const poopSizeReduction = 0.25 // Уменьшение размера на 25%
      const bottomY = activeCharacter.y + activeCharacter.height
      activeCharacter.sizeMultiplier = Math.max(1, activeCharacter.sizeMultiplier - poopSizeReduction)
      activeCharacter.width = activeCharacter.originalWidth * activeCharacter.sizeMultiplier
      activeCharacter.height = activeCharacter.originalHeight * activeCharacter.sizeMultiplier
      activeCharacter.y = bottomY - activeCharacter.height
      activeCharacter.jumpForce = activeCharacter.originalJumpForce * (1 / (1 + (activeCharacter.sizeMultiplier - 1) * 0.5))
      activeCharacter.moveSpeed = activeCharacter.originalMoveSpeed * (1 / (1 + (activeCharacter.sizeMultiplier - 1) * 0.4))

      activeCharacter.poopCooldown = true
      setTimeout(() => {
        activeCharacter.poopCooldown = false
      }, 1000)
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

  // Ограничиваем движение персонажей границами уровня
  gameObjects.white.x = Math.max(0, Math.min(gameObjects.white.x, canvas.width * 7 - gameObjects.white.width))
  gameObjects.black.x = Math.max(0, Math.min(gameObjects.black.x, canvas.width * 7 - gameObjects.black.width))

  updateCamera(GameState, activeCharacter)

  // Визуальное обозначение активного персонажа
  gameObjects.enemies = gameObjects.enemies.filter(({ isDead }) => !isDead )
  // gameObjects.collectables = gameObjects.collectables.filter(({ collected }) => !collected )
  if (!gameObjects.white.isAlive || !gameObjects.black.isAlive) {
    GameState.nextLevel = GAME_STATE.GAMEOVER
  }

  if (GameState.nextLevel !== GameState.currentState) {
    switchLevel(GameState.nextLevel, { GameState, gameObjects, PlayerState}, {Sprite, canvas, context}, levelBackgroundPatterns)
  }
}

function switchLevel(targetLevel, { GameState, gameObjects, PlayerState}, {Sprite, canvas, context}, levelBackgroundPatterns) {
  if ([
    GAME_STATE.LEVEL1,
    GAME_STATE.LEVEL2,
    GAME_STATE.LEVEL3,
    GAME_STATE.LEVEL4,
  ].includes(targetLevel)) {
    const updatedLevel = loadLevel(targetLevel, { gameObjects }, {Sprite, canvas, context}, levelBackgroundPatterns)
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
    backgrounds: {},
    level: {},
    obstacles: [],
    collectables: [],
    enemies: [],
    effects: [],
  };
}
