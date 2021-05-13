let map = [
    "           ",
    "   13      ",
    "   11111   ",
    "           ",
    "       2   ",
    "           "
];
let grid = [];
/*
1 = wall
2 = start
3 = end
*/

let gridW = Math.max(...map.map(i => i.length));
let gridH = map.length;
let gridS = 50;
let path = [];
let start, end;
let current;

function setup() {
    frameRate(5);
    createCanvas(gridW * gridS, gridH * gridS);
    for (let i = 0; i < gridH; i++) {
        let row = [];
        for (let j = 0; j < gridW; j++) {
            row.push(new Block(j, i, map[i][j] == 1));
            if (map[i][j] == 2) start = current = row[j];
            if (map[i][j] == 3) end = row[j];
        }
        grid.push(row);
    }

    for (let i = 0; i < gridH; i++) {
        for (let j = 0; j < gridW; j++) {
            let { x, y } = grid[i][j];
            const sameblock = (e, f) => e === y && f === x;
            for (let a = -1; a < 2; a++) {
                for (let b = -1; b < 2; b++) {
                    let c = y + a;
                    let d = x + b;
                    if (grid[c] && grid[c][d] && !sameblock(c, d)) grid[i][j].neighbors.push(grid[c][d]);
                }
            }

            grid[i][j].g = dist(start.x, start.y, j, i);
            grid[i][j].h = dist(end.x, end.y, j, i);
            grid[i][j].f = grid[i][j].g + grid[i][j].h;
        }
    }
}

function draw() {
    for (let i = 0; i < gridH; i++) {
        for (let j = 0; j < gridW; j++) {
            if (grid[i][j].wall) fill(0);
            else fill(255);
            if (start.x === j && start.y === i) fill("#4287f5");
            if (end.x === j && end.y === i) fill("#4287f5");
            if (current.x === j && current.y === i) fill("#4287f5");
            rect(j * gridS, i * gridS, gridS, gridS);
        }
    }

    let filtered = current.neighbors.filter(i => !i.wall);
    let min = Math.min(...filtered.map(i => i.f));
    current = filtered[filtered.findIndex(i => i.f === min)];
}