export function initMenuScreen(selectedScreen) {
  return function (gameObjects) {
    const handleSpaceClick = (event) => {
      if (event.code === 'Space') {
        gameObjects[selectedScreen].input.space = true
      }
    }
    document.addEventListener('keydown', handleSpaceClick)

    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        gameObjects[selectedScreen].input.space = false
        document.removeEventListener('keydown', handleSpaceClick)
      }
    })
  }
}
