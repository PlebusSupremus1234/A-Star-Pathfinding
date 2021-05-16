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

let gridW;
let gridH;
let gridMW = 800;
let gridMH  = 800;
let gridS = 50;
let path = [];
let start, end;
let openlist = [];
let closedlist = [];

let paused = true;
let finished = false;
let editing = false;

let speedslider;
let btn;

function mazeSetup(newGrid) {
    grid = [];
    path = [];
    openlist = [];
    closedlist = [];
    start = null;
    end = null;
    paused = true;
    finished = false;

    gridW = Math.max(...newGrid.map(i => i.length));
    gridH = newGrid.length;
    for (let i = 0; i < gridH; i++) {
        let row = [];
        for (let j = 0; j < gridW; j++) {
            row.push(new Block(j, i, newGrid[i][j] == 1));
            if (newGrid[i][j] == 2) start = row[j];
            if (newGrid[i][j] == 3) end = row[j];
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

    if (gridW * gridS > gridMW) gridS = Math.floor(gridMW / gridW);
    if (gridH * gridS > gridMH) gridS = Math.floor(gridMH / gridH);

    openlist.push(start);

    resizeCanvas(gridW * gridS + 450, gridH * gridS);
}

//FIX POSITIONAL BUGS

function setup() {
    frameRate(10);
    createCanvas(400, 400);
    mazeSetup(map.map(i => i === " " ? "0" : i));
    speedslider = createSlider(5, 100, 20);
    speedslider.position(gridW * gridS + 135, 118);
    speedslider.style("width", "250px");
    btn = { x: gridW * gridS + 15, y: 190, width: 230, height: 40 };
}

function draw() {
    background("#ebebeb");
    stroke(0);
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
    fill("#278fb5")
    rect(current.x * gridS, current.y * gridS, gridS, gridS);
    if (current.x === end.x && current.y === end.y && path.length === 0) {
        path = [];
        let i = current;
        path.push(i);
        while (i.parent) {
            path.push(i.parent);
            i = i.parent;
        }
        finished = true;
    }
    if (!paused && !finished) {
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

    fill(0);
    textSize(40);
    textStyle(BOLD);
    noStroke();
    text("A* Pathfinding", gridW * gridS + 15, 50);
    textSize(30);
    text("Play or Pause:", gridW * gridS + 15, 90);
    text("Speed:", gridW * gridS + 15, 130);
    text("Edit Maze:", gridW * gridS + 15, 170);

    if (editing) {
        fill("#00a2ff");
        if (mouseX > btn.x && mouseX < btn.x + btn.width && mouseY > btn.y && mouseY < btn.y + btn.height) fill("#0092e6");
        rect(btn.x, btn.y, btn.width, btn.height, 10, 10, 10, 10);
        fill(255);
        textSize(18);
        textStyle(NORMAL);
        text("Generate Random Maze", btn.x + 18, btn.y + 26);
    }
}

function mousePressed() {
    if (mouseX > btn.x && mouseX < btn.x + btn.width && mouseY > btn.y && mouseY < btn.y + btn.height) {
        let size = 20;
        let maze = [];
        for (let i = 0; i < size; i++) {
            maze[i] = [];
            for (let j = 0; j < size; j++) maze[i][j] = 0;
        }
        const r = (min, max) => Math.floor(Math.random() * (max - min)) + min;

        function addBorder() {
            for (let i = 0; i < maze.length; i++) {
                if (i === 0 || i === (maze.length - 1)) {
                    for (let j = 0; j < maze.length; j++) maze[i][j] = 1;
                } else {
                    maze[i][0] = 1;
                    maze[i][maze.length - 1] = 1;
                }
            }
        }
        
        addBorder();
        partition(true, 1, maze.length - 2, 1, maze.length - 2);
        addBorder();
        maze[maze.length - 1][r(1, maze.length - 1)] = 2;
        maze[0][r(1, maze.length - 1)] = 3;

        function partition(h, minX, maxX, minY, maxY) {
            if (h) {        
                if (maxX - minX < 2) return;        
                let y = Math.floor(r(minY, maxY) / 2) * 2;
                let hole = Math.floor(r(minX, maxX) / 2) * 2 + 1;
                for (let i = minX; i < maxX + 1; i++) {
                    if (i === hole) maze[y][i] = 0;
                    else maze[y][i] = 1;
                } 
                partition(!h, minX, maxX, minY, y-1);
                partition(!h, minX, maxX, y + 1, maxY);
            } else {
                if (maxY - minY < 2) return;
                let x = Math.floor(r(minX, maxX) / 2) * 2;
                let hole = Math.floor(r(minY, maxY) / 2) * 2 + 1;
                for (let i = minY; i <= maxY; i++) {
                    if (i === hole) maze[i][x] = 0;
                    else maze[i][x] = 1;
                }
                partition(!h, minX, x - 1, minY, maxY);
                partition(!h, x + 1, maxX, minY, maxY);
            }
        }

        mazeSetup(maze.map(i => i.join("")));
    }
}

function playpause() {
    let element = document.getElementById("playpause");
    element.classList.toggle("paused");
    paused = !paused;
}

function enableEditing() {
    editing = !editing;
    if (editing && !paused) playpause();
}

window.onload = function() {
    let checkbox = document.getElementsByClassName("checkboxes")[0];
    checkbox.style.left = `${gridW * gridS + 180}px`;
    checkbox.style.top = "152px";
}