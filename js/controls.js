export function setupControls({ whiteCat, blackCat, setMove, getActiveCat, setActiveCat, moves }) {
    // Удаляем привязку к WASD через кнопки и добавляем обработчик событий клавиатуры
    document.addEventListener('keydown', (event) => {
        console.log(event.key);
        switch(event.key) {
            case 'ArrowLeft':
            case 'a':
                setMove('left', true);
                break;
            case 'ArrowRight':
            case 'd':
                setMove('right', true);
                break;
            case 'ArrowUp':
            case 'w':
                const activeCat = getActiveCat();
                if (!activeCat.isJumping) {
                    activeCat.isJumping = true;
                    if(activeCat.dy === 0) {
                        activeCat.dy = -activeCat.maxJumpHeight;
                    }
                }

                break;
            case 'Shift':
                setActiveCat(getActiveCat() === whiteCat ? blackCat : whiteCat);
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch(event.key) {
            case 'ArrowLeft':
            case 'a':
                setMove('left', false);
                break;
            case 'ArrowRight':
            case 'd':
                setMove('right', false);
                break;
        }
    });

    // Оставляем кнопки UI для мобильного управления
    document.getElementById('left').addEventListener('mousedown', ()=>setMove('left',true));
    document.getElementById('left').addEventListener('mouseup', ()=>setMove('left',false));
    document.getElementById('right').addEventListener('mousedown', ()=>setMove('right',true));
    document.getElementById('right').addEventListener('mouseup', ()=>setMove('right',false));

    document.getElementById('jump').addEventListener('click', ()=>{
        const activeCat = getActiveCat();
        if (!activeCat.isJumping) {
            activeCat.isJumping = true;
            if(activeCat.dy === 0) {
                activeCat.dy = -activeCat.maxJumpHeight;
            }
        }
    });

    document.getElementById('switch').addEventListener('click', ()=>{
        setActiveCat(getActiveCat() === whiteCat ? blackCat : whiteCat);
    });

    document.getElementById('eat').addEventListener('click', ()=>{
        let activeCat = getActiveCat();
        if(activeCat === whiteCat) activeCat.size += 0.05;
    });

    document.getElementById('poop').addEventListener('click', ()=>{
        let activeCat = getActiveCat();
        if(activeCat === whiteCat) activeCat.size = Math.max(0.5, activeCat.size - 0.1);
    });

    document.getElementById('claw').addEventListener('click', ()=>{
        let activeCat = getActiveCat();
        if(activeCat === blackCat) console.log('Когти!');
    });
}
