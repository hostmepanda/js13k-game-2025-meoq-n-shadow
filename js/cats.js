export function createCats(kontra) {
    let whiteCat = kontra.Sprite({
        x: 100, y: 300,
        width: 30, height: 30,
        color: 'white',
        dx: 0, dy: 0,
        size: 1,
        update: function() {
            this.dy += 0.5; // gravity
            this.x += this.dx;
            this.y += this.dy;
            if(this.y + this.height * this.size > 370) {
                this.y = 370 - this.height * this.size;
                this.dy = 0;
            }
        }
    });

    let blackCat = kontra.Sprite({
        x: 200, y: 300,
        width: 30, height: 30,
        color: 'black',
        dx: 0, dy: 0,
        update: function() {
            this.dy += 0.5;
            this.x += this.dx;
            this.y += this.dy;
            if(this.y + this.height > 370) {
                this.y = 370 - this.height;
                this.dy = 0;
            }
        }
    });

    return { whiteCat, blackCat };
}
