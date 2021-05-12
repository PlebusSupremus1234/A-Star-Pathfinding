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

function setup() {
    createCanvas(gridW * gridS, gridH * gridS);
    for (let i = 0; i < gridH; i++) {
        let row = [];
        for (let j = 0; j < gridW; j++) {
            row.push(new Block(j, i, map[i][j] == 1 ? "wall" : "normal"));
            if (map[i][j] == 2) start = row[j];
            if (map[i][j] == 3) end = row[j];
        }
        grid.push(row);
    }
}

function draw() {
    for (let i = 0; i < gridH; i++) {
        for (let j = 0; j < gridW; j++) {
            if (grid[i][j].type === "wall") fill(0);
            else fill(255);
            if (start.x === j && start.y === i) fill("#4287f5");
            if (end.x === j && end.y === i) fill("#4287f5");
            rect(j * gridS, i * gridS, gridS, gridS);
        }
    }
}