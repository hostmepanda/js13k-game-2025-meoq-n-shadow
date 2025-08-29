import {updateCamera} from '../states/game'
import {parseLevel} from '../gameHelpers/levelParser'
import {initKeyboardControls} from '../gameHelpers/keyboard'
import {LEVEL_MAPS} from './maps'
import {JUMP_FORCE, MOVE_SPEED, renderBackground, renderUI, renderWithCamera} from '../gameHelpers/utils'
import {checkEnvironmentCollisions, checkFoodCollision, renderFoodItems} from '../gameHelpers/itemsUtils'
import {updateBlackCatAttack, updateCharacterPhysics} from '../gameHelpers/charactersUtils'
import {checkEnemyCollisions, checkEnemyCollisionWithEnvironment, createPoop} from '../gameHelpers/enemiesUtils'
import {CANVAS, GAME_STATE} from '../consts'

export function levelInit(selectedLevel) {
  return function ({ gameObjects, PlayerState, GameState }, { Sprite, canvas}) {
    const levelState = {
      level: {
        floorLine: CANVAS.height - 20,
        levelWidth: canvas.width * 7,
        levelHeight: canvas.height,
      },
    }
    parseLevel({
      levelMap: LEVEL_MAPS[selectedLevel],
      gameObjects: gameObjects[selectedLevel],
      Sprite,
    })

    GameState.camera.levelBounds = {
      minX: 0,
      maxX: levelState.level.levelWidth - CANVAS.width,
      minY: 0,
      maxY: levelState.level.levelHeight - CANVAS.height,
    }

// Инициализация состояния игрока
    PlayerState.activeCharacter = 'white' // По умолчанию активен белый персонаж

    // Инициализируем backgrounds, если его еще нет
    gameObjects[selectedLevel].backgrounds = gameObjects[selectedLevel].backgrounds || {}

    // Создаем объект фона с градиентом заката
    gameObjects[selectedLevel].backgrounds.sunset = {
      render: function (ctx) {
        // Создаем градиент от верха к низу
        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS.height)

        // Добавляем цвета заката (темно-синий -> фиолетовый -> оранжевый -> желтый)
        gradient.addColorStop(0, '#1a2b56')    // Темно-синий (верх неба)
        gradient.addColorStop(0.4, '#864d9e')  // Фиолетовый
        gradient.addColorStop(0.7, '#dd5e5e')  // Оранжево-красный
        gradient.addColorStop(0.9, '#f9d423')  // Желтый (у горизонта)

        // Заполняем фон градиентом
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, CANVAS.width, CANVAS.height)
      },
    }

    gameObjects[selectedLevel].keyboard = initKeyboardControls()
    gameObjects[selectedLevel].level = levelState.level
  }
}

export function levelRender(selectedLevel) {
  return function (gameObjects, { PlayerState, GameState }, {canvas, context}) {
    const {white, black,} = gameObjects[selectedLevel]
    context.clearRect(0, 0, canvas.width, canvas.height)

    renderBackground(context, canvas)
    renderWithCamera(context, GameState.camera, (ctx) => {
      if (gameObjects[selectedLevel].backgrounds.length > 0) {
        gameObjects[selectedLevel].backgrounds.forEach(background => {
          background.render()
        })
      }

      if (gameObjects[selectedLevel].obstacles.length > 0) {
        gameObjects[selectedLevel].obstacles
        .filter(obstacle => obstacle.isVisible)
        .forEach(obstacle => {
          obstacle.render()
        })
      }

      if (gameObjects[selectedLevel].collectables.length > 0) {
        renderFoodItems(context, gameObjects[selectedLevel].collectables)
        gameObjects[selectedLevel].collectables.forEach(collectable => {collectable?.render?.()})
      }

      if (gameObjects[selectedLevel].boss) {
        gameObjects[selectedLevel].boss.render()
      }

      if (gameObjects[selectedLevel].enemies.length > 0) {
        gameObjects[selectedLevel].enemies
        .forEach(enemy => {
          enemy?.render?.()
        })
      }

      if (gameObjects[selectedLevel].effects.length > 0) {
        gameObjects[selectedLevel].effects.forEach(effect => {
          effect?.render?.()
        })
      }

      white.render()
      black.render()

      // Если кот атакует, добавляем визуализацию атаки
      if (black.isAttacking) {
        context.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Красное свечение

        // Направление атаки зависит от свойства facingRight
        if (black.facingRight) {
          // Атака вправо
          const attackX = black.x + black.width;
          context.fillRect(attackX, black.y, black.attackRange, black.height);
        } else {
          // Атака влево
          const attackX = black.x - black.attackRange;
          context.fillRect(attackX, black.y, black.attackRange, black.height);
        }
      }
    })

    renderUI(context, {
      currentLevel: GameState.currentState,
      cats: [
        {
          name: "Meoq",
          health: gameObjects[selectedLevel].white.health,
          lives: PlayerState.white.lives,
          isActive: PlayerState.activeCharacter === 'white',
        },
        {
          name: "Shadow",
          health: gameObjects[selectedLevel].black.health,
          lives: PlayerState.black.lives,
          isActive: PlayerState.activeCharacter === 'black',
        }
      ],
    });
  }
}

export function updateLevel(selectedLevel) {
  return function ({ gameObjects, GameState, PlayerState}, {canvas, context}, deltaTime, Sprite) {
    const {
      white,
      black,
      enemies,
      keyboard,
    } = gameObjects[selectedLevel]
    const levelObjects = gameObjects[selectedLevel]

    if (!white || !black) {
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
        console.log(`Переключились на ${PlayerState.activeCharacter} персонажа`)
      }
    }

    const activeCharacter = PlayerState.activeCharacter === 'white' ? white : black
    const cats = [white, black]

    cats.forEach((player) => {
      updateCharacterPhysics(player, deltaTime)
      checkEnemyCollisions(player, levelObjects.enemies, { PlayerState, GameState })
      checkEnvironmentCollisions(player, levelObjects.obstacles.filter(({ isVisible }) => isVisible), deltaTime, GameState);
    })

    enemies.forEach((enemy) => {
      enemy.update(deltaTime)
      checkEnemyCollisionWithEnvironment(
        [
          ...levelObjects.obstacles.filter(({ collides }) => collides),
          ...levelObjects.enemies.filter(({ collides }) => collides),
        ],
        enemy,
      )
    })

    updateBlackCatAttack(activeCharacter, levelObjects, deltaTime)

    // Управление активным персонажем
    if (keyboard.isKeyPressed('KeyW') && activeCharacter.onGround) {
      activeCharacter.velocityY = activeCharacter.jumpForce || JUMP_FORCE
      activeCharacter.isJumping = true
      activeCharacter.onGround = false

      console.log(`${PlayerState.activeCharacter} прыгает!`)
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
        if (createPoop(activeCharacter, levelObjects, Sprite)) {
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
    checkFoodCollision(white, levelObjects.collectables)

    // Ограничиваем движение персонажей границами уровня
    white.x = Math.max(0, Math.min(white.x, canvas.width * 7 - white.width))
    black.x = Math.max(0, Math.min(black.x, canvas.width * 7 - black.width))

    updateCamera(GameState, activeCharacter)

    // Визуальное обозначение активного персонажа
    white.alpha = PlayerState.activeCharacter === 'white' ? 1.0 : 0.7
    black.alpha = PlayerState.activeCharacter === 'black' ? 1.0 : 0.7
    levelObjects.enemies = levelObjects.enemies.filter(({ isDead }) => !isDead )
    levelObjects.collectables = levelObjects.collectables.filter(({ collected }) => !collected )
    if (!white.isAlive || !black.isAlive) {
      GameState.nextLevel = GAME_STATE.GAMEOVER
    }

    if (GameState.nextLevel !== GameState.currentState) {
      loadLevel(GameState.nextLevel, { GameState, gameObjects, PlayerState}, {Sprite, canvas, context})
    }
  }
}

function loadLevel(targetLevel, { GameState, gameObjects, PlayerState}, {Sprite, canvas, context}) {
  // TODO: cler previous state of level
  // maybe transit to only one level object and init level here
  console.log('--Target level: ', targetLevel)
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
