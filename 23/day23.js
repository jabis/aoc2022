const {
  funcs,
  chars,
  dirs,
  PriorityQueue
} = require('../rf');
f = funcs();
const day23 = async (i, debug, fancy) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n');
  let matrix = {};
  
  let game = () => {
    let g = {
      matrix,
      queue: new PriorityQueue(),
      getQueue:()=>{
        return g.queue;
      },
      populate:(i)=>{
        i.map((r, y) => {
          g.matrix[`row${y}`] = {};
          r = r.split('')
          for (x = 0; x < r.length; x++) {
            let char = r[x];
            g.matrix[`row${y}`][`col${x}`] = {
              value: char,
              y: y,
              x: x,
              visited: false,
              empty: chars[char] === "empty",
              elf: chars[char] === "block" ? true : false,
            }
          }
          return r;
        });
        for(row of Object.values(g.matrix)){
          for(col of Object.values(row)){
            let cache = g.scan(col.x,col.y);
            f.toPath(g.matrix,`[row${col.y}][col${col.x}].scan`,cache);
            //console.log("row",row, cache)
          }
        }
        return g;
      },
      scan: (x, y, far = 1) => {
        let curr = f.fromPath(g.matrix, `[row${y}][col${x}]`);
        let pos = [x, y];
        let cache = new Map();
        [
          ["n", "ne", "nw"],
          ["s", "se", "sw"],
          ["w", "nw", "sw"],
          ["e", "ne", "sw"]
        ].map(ways => {
          let isValid = false;
          ways.map(dir => {
            let op = dirs[dir];
            //console.log(op,pos);

            let [px,py] = g.orient(pos,op);
            let has = f.fromPath(g.matrix, `[row${py}][col${px}]`);
            //console.log("has",has);
            if(has){
              cache.set(dir, has)
            } else {
              cache.set(dir,{x:px,y:py,elf:false,empty:false,error:"boundaryerror"})
              //console.log("hit boundary",px,py,"direction",dir)
            }
          })
        })
        return cache;
      },
      orient: (pos, cf) => {
        let [x, y] = pos;
        let [fx, fy] = cf;
        if (fx === 1 && fy === 0) { // right / east
          x++;
        } else if (fx === 0 && fy === 1) { // down / south
          y++;
        } else if (fx === -1 && fy === 0) { // left / west
          x--;
        } else if (fx === 0 && fy === -1) { // up / north
          y--;
        }
        else if (fx === 1 && fy === -1) { // northeast
          x++;
          y--;
        }
        else if (fx === -1 && fy === -1) { // northwest
          x--;
          y--;
        }
        else if (fx === -1 && fy === 1) { // southwest
          x--;
          y++;
        }
        else if (fx === 1 && fy === 1) { // southeast
          x++;
          y++;
        }
        return [x, y]
      }

    }
    return g;
  }
  return {game:game().populate(i)};
}

module.exports = day23;