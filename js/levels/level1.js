import {GAME_STATE, updateCamera} from '../states/game'
import {renderBackground, renderUI, renderWithCamera} from '../gameHelpers/utils'
import {updateBlackCatAttack, updateCharacterPhysics} from '../gameHelpers/charactersUtils'
import {checkEnemyCollisions, checkEnemyCollisionWithEnvironment, createPoop} from '../gameHelpers/enemiesUtils'
import {checkEnvironmentCollisions, checkFoodCollision, renderFoodItems} from '../gameHelpers/itemsUtils'

export function renderLevel1(gameObjects, { PlayerState, GameState }, {canvas, context}) {
  const {
    white,
    black,
  } = gameObjects[GAME_STATE.LEVEL1]
  // Очищаем весь холст
  context.clearRect(0, 0, canvas.width, canvas.height)

  renderBackground(context, canvas)
  renderWithCamera(context, GameState.camera, (ctx) => {

    if (gameObjects[GAME_STATE.LEVEL1].backgrounds.length > 0) {
      gameObjects[GAME_STATE.LEVEL1].backgrounds.forEach(background => {
        background.render()
      })
    }

    if (gameObjects[GAME_STATE.LEVEL1].obstacles.length > 0) {
      gameObjects[GAME_STATE.LEVEL1].obstacles.forEach(background => {
        background.render()
      })
    }

    if (gameObjects[GAME_STATE.LEVEL1].collectables.length > 0) {
      renderFoodItems(context, gameObjects[GAME_STATE.LEVEL1].collectables)
      gameObjects[GAME_STATE.LEVEL1].collectables.forEach(collectable => {collectable?.render?.()})
    }

    if (gameObjects[GAME_STATE.LEVEL1].boss) {
      gameObjects[GAME_STATE.LEVEL1].boss.render()
    }

    if (gameObjects[GAME_STATE.LEVEL1].enemies.length > 0) {
      gameObjects[GAME_STATE.LEVEL1].enemies.forEach(enemy => {
        enemy?.render?.()
      })
    }

    if (gameObjects[GAME_STATE.LEVEL1].effects.length > 0) {
      gameObjects[GAME_STATE.LEVEL1].enemies.forEach(effect => {
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

  renderUI(context, {PlayerState, white: gameObjects[GAME_STATE.LEVEL1].white, black: gameObjects[GAME_STATE.LEVEL1].black});
}

export function updateLevel1(gameObjects, {GameState, PlayerState}, {canvas, context}, deltaTime, Sprite) {
  const {
    white,
    black,
    enemies,
    keyboard,
  } = gameObjects

  // Проверяем наличие объектов
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

  // Константы для физики
  const MOVE_SPEED = 200    // пикселей в секунду
  const JUMP_FORCE = -550   // Начальная скорость прыжка

  const activeCharacter = PlayerState.activeCharacter === 'white' ? white : black

  // Обновляем физику для обоих персонажей
  updateCharacterPhysics(white, deltaTime)
  updateCharacterPhysics(black, deltaTime)
  checkEnemyCollisions(white, gameObjects)
  checkEnemyCollisions(black, gameObjects)
  checkEnvironmentCollisions(white, gameObjects.obstacles, deltaTime, GameState);
  checkEnvironmentCollisions(black, gameObjects.obstacles, deltaTime, GameState);

  enemies.forEach((enemy) => {
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
  checkFoodCollision(white, gameObjects.collectables)

  // Ограничиваем движение персонажей границами уровня
  white.x = Math.max(0, Math.min(white.x, canvas.width * 7 - white.width))
  black.x = Math.max(0, Math.min(black.x, canvas.width * 7 - black.width))

  updateCamera(GameState, activeCharacter)

  // Визуальное обозначение активного персонажа
  white.alpha = PlayerState.activeCharacter === 'white' ? 1.0 : 0.7
  black.alpha = PlayerState.activeCharacter === 'black' ? 1.0 : 0.7
  gameObjects.enemies = gameObjects.enemies.filter(({ isDead }) => !isDead )
  gameObjects.collectables = gameObjects.collectables.filter(({ collected }) => !collected )
}
