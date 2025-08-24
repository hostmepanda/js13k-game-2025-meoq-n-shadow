import {CANVAS} from '../states/game'
import {parseLevel} from '../gameHelpers/levelParser'
import {initKeyboardControls} from '../gameHelpers/keyboard'
import {LEVEL_MAPS} from './maps'

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