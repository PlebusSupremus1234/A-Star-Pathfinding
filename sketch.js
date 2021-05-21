let grid = [];
let gridW = 20;
let gridH = 20;
let gridS = 40;
let path = [];
let start, end;
let openlist = [];
let closedlist = [];

let paused = true;
let finished = false;
let speedslider;
let btn;

/*
    Stuff to do:
    - Make speed slider work
    - Case when there's no possible paths
*/

function setup() {
    frameRate(10);
    createCanvas(400, 400);
    mazeSetup(generateMaze().map(i => i.join("")));
    speedslider = createSlider(5, 100, 20);
    speedslider.position(gridW * gridS + 135, 158);
    speedslider.style("width", "250px");
    btn = { x: gridW * gridS + 15, y: 190, width: 270, height: 40 };
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
    text("Restart:", gridW * gridS + 15, 130);
    text("Speed:", gridW * gridS + 15, 170);
    fill("#00a2ff");
    if (mouseX > btn.x && mouseX < btn.x + btn.width && mouseY > btn.y && mouseY < btn.y + btn.height) fill("#0092e6");
    rect(btn.x, btn.y, btn.width, btn.height, 10, 10, 10, 10);
    fill(255);
    textSize(18);
    textStyle(NORMAL);
    text("Generate New Random Maze", btn.x + 18, btn.y + 26);
}

function mousePressed() {
    if (mouseX > btn.x && mouseX < btn.x + btn.width && mouseY > btn.y && mouseY < btn.y + btn.height) mazeSetup(generateMaze().map(i => i.join("")));
}