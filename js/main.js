import { createCats } from './cats.js';
import { setupControls } from './controls.js';

let { canvas, context } = kontra.init();
let keys = {};

function setKey(key, value) { keys[key] = value; }

let { whiteCat, blackCat } = createCats(kontra);
let activeCat = whiteCat;

function getActiveCat() { return activeCat; }
function setActiveCat(cat) { activeCat = cat; }

setupControls({ whiteCat, blackCat, setKey, getActiveCat, setActiveCat });

let loop = kontra.GameLoop({
    update: function() {
        activeCat.dx = 0;
        if(keys['a']) activeCat.dx = -3;
        if(keys['d']) activeCat.dx = 3;

        whiteCat.update();
        blackCat.update();
    },
    render: function() {
        whiteCat.render();
        blackCat.render();

        context.fillStyle = 'black';
        context.fillText(`Meow's size: ${whiteCat.size.toFixed(2)}`, 10, 20);
        context.fillText(`Active cat: ${activeCat === whiteCat ? 'Meow' : 'Shadow'}`, 10, 40);
    }
});

loop.start();
