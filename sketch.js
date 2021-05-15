let map = [
    "2                 ",
    "1111111111111 1111",
    "                  ",
    "        1111111   ",
    "          1       ",
    "111111       11   ",
    "       11111111111",
    "                 3",
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
let openlist = [];
let closedlist = [];

function setup() {
    frameRate(10);
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

    openlist.push(start);

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
            if (openlist.some(a => a.x === j && a.y === i)) fill("#61b001");
            if (closedlist.some(a => a.x === j && a.y === i)) fill("#f20f01");
            if ((start.x === j && start.y === i) || (end.x === j && end.y === i)  || path.some(a => a.x === j && a.y === i)) fill("#278fb5");
            rect(j * gridS, i * gridS, gridS, gridS);
        }
    }
    
    let mins = openlist.filter(a => a.f === Math.min(...openlist.map(b => b.f)));
    let current = mins[mins.findIndex(a => a.h === Math.min(...mins.map(b => b.h)))];
    console.log(current.x, current.y, current.f, current.g, current.h);
    fill("#278fb5")
    rect(current.x * 50, current.y * 50, 50, 50);
    if (current.x === end.x && current.y === end.y) {
        path = [];
        let i = current;
        path.push(i);
        while (i.parent) {
            path.push(i.parent);
            i = i.parent;
        }
    } else {
        openlist.splice(openlist.findIndex(a => a.x === current.x && a.y === current.y), 1);
        closedlist.push(current);
        for (let i = 0; i < current.neighbors.length; i++) {
            let n = current.neighbors[i];
            let ng = n.g + ((current.x - n.x === 0 || current.y - n.y === 0) ? 1 : 2 ** 0.5);
            if (!closedlist.some(a => a.x === n.x && a.y === n.y) && !n.wall) {
                if (!openlist.some(a => a.x === n.x && a.y === n.y)) {
                    n.parent = current;
                    openlist.push(n);
                } else {
                    if (ng < n.g) {
                        n.g = ng;
                        n.h = dist(n.x, n.y, end.x, end.y);
                        n.f = n.g + n.h;
                        n.parent = current;
                    }
                }
            }
        }
    }
}