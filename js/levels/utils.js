import {CANVAS, GAME_STATE} from '../states/game'
import {parseLevel} from '../gameHelpers/levelParser'
import {initKeyboardControls} from '../gameHelpers/keyboard'
import {LEVEL_MAPS} from './maps'
import {renderBackground, renderUI, renderWithCamera} from '../gameHelpers/utils'
import {renderFoodItems} from '../gameHelpers/itemsUtils'

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
        gameObjects[selectedLevel].obstacles.forEach(background => {
          background.render()
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
        gameObjects[selectedLevel].enemies.forEach(enemy => {
          enemy?.render?.()
        })
      }

      if (gameObjects[selectedLevel].effects.length > 0) {
        gameObjects[selectedLevel].enemies.forEach(effect => {
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

    renderUI(context, {PlayerState, white: gameObjects[selectedLevel].white, black: gameObjects[GAME_STATE.LEVEL1].black});
  }
}