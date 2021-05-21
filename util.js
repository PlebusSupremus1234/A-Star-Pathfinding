function mazeSetup(newGrid, startB = null, endB = null) {
    grid = [];
    path = [];
    openlist = [];
    closedlist = [];
    start = startB;
    end = endB;
    if (!paused) playpause();
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

function generateMaze() {
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

    return maze;
}

function playpause() {
    let element = document.getElementById("playpause");
    element.classList.toggle("paused");
    paused = !paused;
}

function restart() {
    let element = document.getElementById("restart");
    element.classList.toggle("clicked");
    setTimeout(() => element.classList.toggle("clicked"), 1000);

    mazeSetup(grid.map(a => a.map(b => b.wall ? "1" : "0").join("")), start, end);
}