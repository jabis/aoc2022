class Cell  {
  constructor(y, x, letter, charcode, dist, prev) {
      this.y = y;
      this.x = x;
      this.letter = letter;
      this.charcode = charcode;
      this.dist = dist; 
      this.prev = prev; 
  }
  toString() {
    return "(" + this.y + ", " + this.x + ")";
  }
}

class BFS {
  constructor(map,out) {
    this.matrix = map;
    this.out = out;
    this.steps = 0;
    this.cells = [];
    this.visited = new Map();
    return this;
  }

  shortestPath(start, end) {
    let sy = start[0];
    let sx = start[1];
    let dy = end[0];
    let dx = end[1];
    if (!this.matrix[sy][sx]|| !this.matrix[dy][dx]) {
      console.log("There is no path. at start");
      return;
    }
    let matrix = this.matrix;
    let m = this.matrix.length;
    let n = this.matrix[0].length;
    let cells = this.cells;
    for (let y = 0; y < m; y++) {
      cells[y] = [];
      for (let x = 0; x < n; x++) {
        cells[y][x] = new Cell(y, x, matrix[y][x], matrix[y][x], Number.MAX_SAFE_INTEGER, null); 
      }
    }
    let queue = [];
    this.cells = cells;
    let src = cells[sy][sx];
    src.dist = 0;
    queue.push(src);
    let dest = null;
    let p;
    while (queue.length) {
      p = queue.shift();
      if (p.x == dx && p.y == dy) {
        dest = p;
        break;
      }
      this.visit(cells, queue, p.x - 1, p.y, p);
      this.visit(cells, queue, p.x, p.y - 1, p);
      this.visit(cells, queue, p.x + 1, p.y, p);
      this.visit(cells, queue, p.x, p.y + 1, p);
    }
    if (dest == null) {
      console.log("there is no path.");
      return this.out =="length" ? 0 : this;
    } else {
      let path = [];
      p = dest;
      do {
        path.unshift(p);
      } while ((p = p.prev) != null);
      console.log(`${path} ${path.length}`);
      return this.out =="length" ? path.length -1 : this;
    }
  }

  visit(cells, queue, x, y, parent) {
    this.steps++;
    if (y < 0 || y >= cells.length || x < 0 || x >= cells[0].length || this.visited.has(`${x},${y}`)) {
      return;
    }
    let dist = parent.dist+1;
    let p = cells[y][x];
    let cid = p.charcode,
      nid=p.charcode;
    if (parent) nid = parent.charcode;
    if (nid <= cid || cid + 1 == nid){
      if (dist < p.dist) {
        this.visited.set(`${x},${y}`,p)
        p.dist = dist;
        p.prev = parent;
        queue.push(p);
      }
    }
  }
}

const day12 = async (i) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n');
  let start=[0,0],
    end=[0,0];
  let map = i.map((r,ri)=>{
    let s = /S/.exec(r);
    let e = /E/.exec(r);
    if(s){ start[1] = s.index; start[0] = ri; } 
    if(e){ end[1] = e.index; end[0] = ri; }
    r = r.split('').map(c=>{
      if(c=="S") c = 'a'.charCodeAt(0);
      else if(c=="E") c = 'z'.charCodeAt(0);
      else c = c.charCodeAt(0)
      return c;
    });
    return r;
  });
  return {map,start,end,BFS};
};
module.exports = day12;