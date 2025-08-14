export function setupControls({ whiteCat, blackCat, setKey, getActiveCat, setActiveCat }) {
    document.getElementById('left').addEventListener('mousedown', ()=>setKey('a',true));
    document.getElementById('left').addEventListener('mouseup', ()=>setKey('a',false));
    document.getElementById('right').addEventListener('mousedown', ()=>setKey('d',true));
    document.getElementById('right').addEventListener('mouseup', ()=>setKey('d',false));

    document.getElementById('jump').addEventListener('click', ()=>{
        let activeCat = getActiveCat();
        if(activeCat.dy === 0) activeCat.dy = -10;
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
