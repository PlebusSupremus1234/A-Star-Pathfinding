function Block(x, y, wall) {
    this.x = x;
    this.y = y;
    this.wall = wall;
    this.neighbors = [];
    this.parent = null;
}