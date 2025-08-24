import {updateCamera} from '../states/game'
import {updateBlackCatAttack, updateCharacterPhysics} from '../gameHelpers/charactersUtils'
import {checkEnemyCollisions, checkEnemyCollisionWithEnvironment, createPoop} from '../gameHelpers/enemiesUtils'
import {checkEnvironmentCollisions, checkFoodCollision} from '../gameHelpers/itemsUtils'

export function updateLevel1(gameObjects, {GameState, PlayerState}, {canvas, context}, deltaTime, Sprite) {
  const {
    white,
    black,
    enemies,
    keyboard,
  } = gameObjects

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
    checkEnemyCollisions(player, gameObjects)
    checkEnvironmentCollisions(player, gameObjects.obstacles, deltaTime, GameState);
  })

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
