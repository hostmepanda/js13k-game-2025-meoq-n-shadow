import { createCats } from './cats.js';
import { setupControls } from './controls.js';
import { createBackground } from './background.js';

let { canvas, context } = kontra.init();
let moves = {
    up: false,
    left: false,
    right: false,
    jump: false,
};

function setMove(key, value) { moves[key] = value; }

let background = createBackground(context, canvas);

let { whiteCat, blackCat } = createCats(kontra, moves);
let activeCat = whiteCat;

function getActiveCat() { return activeCat; }
function setActiveCat(cat) { activeCat = cat; }

setupControls({ whiteCat, blackCat, setMove, getActiveCat, setActiveCat, moves });

let loop = kontra.GameLoop({
    update: function() {
        activeCat.dx = 0
        if(moves.left) activeCat.dx = -3
        if(moves.right) activeCat.dx = 3

        whiteCat.update()
        blackCat.update()
    },
    render: function() {
        background.render()
        whiteCat.render()
        blackCat.render()

        context.fillStyle = 'black'
        context.fillText(`Meow's size: ${whiteCat.size.toFixed(2)}`, 10, 20)
        context.fillText(`Active cat: ${activeCat === whiteCat ? 'Meow' : 'Shadow'}`, 10, 40)
    }
});

loop.start();
