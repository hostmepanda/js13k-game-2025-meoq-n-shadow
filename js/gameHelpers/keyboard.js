// Объект для хранения состояния клавиш
const keyState = {};

// Объект для хранения обработчиков клавиш
const keyHandlers = {
  pressed: {},
  released: {}
};

// Инициализация обработчиков событий клавиатуры
export function initKeyboardControls() {
  // Очищаем предыдущие обработчики
  keyHandlers.pressed = {};
  keyHandlers.released = {};

  // Добавляем слушатели событий, если их еще нет
  if (!window.keyboardInitialized) {
    window.addEventListener('keydown', (e) => {
      keyState[e.code] = true;

      // Вызываем обработчики нажатия клавиш
      if (keyHandlers.pressed[e.code]) {
        keyHandlers.pressed[e.code].forEach(handler => handler(e));
      }
    });

    window.addEventListener('keyup', (e) => {
      keyState[e.code] = false;

      // Вызываем обработчики отпускания клавиш
      if (keyHandlers.released[e.code]) {
        keyHandlers.released[e.code].forEach(handler => handler(e));
      }
    });

    window.keyboardInitialized = true;
  }

  return {
    bindKey,
    unbindKey,
    isKeyPressed
  };
}

// Функция для привязки обработчика к клавише
function bindKey(keyCode, eventType, handler) {
  if (eventType !== 'pressed' && eventType !== 'released') {
    console.error('Неверный тип события. Используйте "pressed" или "released"');
    return;
  }

  if (!keyHandlers[eventType][keyCode]) {
    keyHandlers[eventType][keyCode] = [];
  }

  keyHandlers[eventType][keyCode].push(handler);
}

// Функция для отвязки обработчика от клавиши
function unbindKey(keyCode, eventType, handler) {
  if (!keyHandlers[eventType][keyCode]) return;

  const index = keyHandlers[eventType][keyCode].indexOf(handler);
  if (index !== -1) {
    keyHandlers[eventType][keyCode].splice(index, 1);
  }
}

// Функция для проверки, нажата ли клавиша
function isKeyPressed(keyCode) {
  return !!keyState[keyCode];
}