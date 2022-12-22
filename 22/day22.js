const {funcs}=require('./../rf');
f = funcs();
const day22 = async (i, debug, fancy) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n\n');
  let map = i.shift(),
    route = i.shift(),
    matrix = {},
    firstX=0,
    firstY=0,
    firstF;
  let chars = {
    ' ':"void",
    '.':"empty",
    "#":"block",
    "◄":"left",
    "►":"right",
    "▼":"down",
    "▲":"up",
    "block":"█",
    "empty":" ",
    "void":"░",
    "left":"◄",
    "right":"►",
    "down":"▼",
    "up":"▲"
  },
  dirs = {
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0],
    up: [0, -1],
  };
  firstF = dirs["right"];
  let rowceil = new Map();
  let rowfloor = new Map();
  let firstcol = new Map();
  let lastcol = new Map();
  map = map.split('\n').map((r,idx)=>{ 
    matrix[`row${idx}`] = {};
    let ids = ''+idx;
    r=r.split(''); 
    let init = true;
    
    for(x=0;x<r.length;x++){
      let char = r[x];
      if(chars[char]==="empty"){
        if(!firstcol.has(ids))
          firstcol.set(ids,x);
        lastcol.set(ids,x);
      }
      matrix[`row${idx}`][`col${x}`] = {
        value:char, 
        y:idx, 
        x:x, 
        visited:false,
        void:chars[char]==="void",
        passable:chars[char]==="empty" ? true : false
      }
      for(const dir of Object.values(dirs)){

      }
      if(idx==0 && chars[char]==="empty" && init) {
        init = false;
        matrix[`row${idx}`][`col${x}`].visited = true;
        matrix[`row${idx}`][`col${x}`].value=chars["right"];
        firstX = x;
      }
    }
    return r;
  });
  let re = /(\d+)(R|L)/, chks=2;

  route = route.split(re).filter(i=>i!=""?i:false).reduce((arr, it, idx) => { 
    const ci = Math.floor(idx/chks);
    if(!arr[ci]) 
      arr[ci] = [];
    it = /\d/.test(it) ? Number(it) : it;
    arr[ci].push(it)
    return arr
  },[]);
  //console.log(route)
  let state = ()=> {
    let g = {
      matrix,
      route,
      pos:{x:firstX,y:firstY,f:firstF},
      dirs,
      firstcol,
      lastcol,
      walkCount:0,
      turnCount:0,
      part1:0,
      lastDir:"right",
      print:()=>{
        let str = "";
        str += Object.values(g.matrix).reduce((p,row,idd)=>{
          if(!p) p = ""; /*console.log(row);*/
          let aye = ''+idd;
          aye = aye.split('').length
          let rowid = aye==1?'00'+idd: aye==2? '0'+idd : ''+idd;
          p+=`\nRow ${rowid} ▌`+Object.values(row).map(r=>{
            r = chars[chars[r.value]]
            return r;
          }).join("")
          return p+'▐';
        },"")
        return str;
      },
      orient:(pos,cf)=>{
        let [x,y] = pos;
        let [fx,fy]= cf;
        if(fx===1 && fy===0){  // right
          x++;
        } else if(fx===0 && fy === 1){  // down
          y++;
        } else if(fx===-1 && fy === 0){ // left 
          x--;
        } else if(fx===0 && fy === -1){ // up
          y--;
        } 
        return [x,y]
      },
      turn:(way)=>{
        let curr = g.pos.f,currX=curr[0],currY=curr[1];
        let ccomp = JSON.stringify(curr);
        let currdir = Object.keys(g.dirs).filter(i=>{
          let matchto = g.dirs[i];
          let str = JSON.stringify(matchto)
          return str == ccomp ? i : false;
        }).shift();
        if(debug) console.log(currdir);
        let next = currdir;
        if (way === "R") {
          if(debug) console.log("turning right", currX, currY);
          if(currdir=="up"){
            next = "right";
          } else if(currdir=="right"){
            next = "down"; 
          } else if(currdir=="down"){
            next = "left";
          } else if(currdir=="left"){
            next = "up"; 
          }
          
        } else if (way === "L") {
          if(debug) console.log("turning left", currX, currY);
          if(currdir=="up"){
            next = "left";
          } else if(currdir=="left"){
            next = "down"; 
          } else if(currdir=="down"){
            next = "right";
          } else if(currdir=="right"){
            next = "up";
          }
        } else {
          if(debug) console.log("not turning", currX, currY);
        }
        g.pos.f = g.dirs[next];
        if(next!=currdir){
          g.lastDir = next;
          g.turnCount++;
        }
        if(debug) console.log("next direction",next,g.pos.f);
        return g.pos.f;
      },
      check:(pos,cf)=>{
        if(debug) console.log("Checking", "pos",pos,"currface",cf);
        let [x,y] = g.orient(pos,cf);
        if(debug) console.log("new X ",x,"new Y",y);
        let chk = f.fromPath(g.matrix,`[row${y}][col${x}]`)
        //console.log(chk && chk.passable);
        return chk && chk.passable
      },
      checkVoid:(pos,cf)=>{
        let [x,y] = g.orient(pos,cf);
        let chk = f.fromPath(g.matrix,`[row${y}][col${x}]`)
        return (!chk || (chk && chk.void))
      },
      visit:(pos,cf)=>{
        if(debug) console.log("visiting", pos, cf);
        let [x,y] = g.orient(pos,cf);
        if(debug) console.log("new X ",x,"new Y",y);
        let target = f.fromPath(g.matrix,`[row${y}][col${x}]`)
        if(target && target.passable){
          g.matrix[`row${y}`][`col${x}`].visited = true;
          g.matrix[`row${y}`][`col${x}`].value = chars[g.lastDir]
          g.pos.x = x;
          g.pos.y = y;
          g.walkCount++;
        }
        return [x,y];
      },
      scan:(x,y,dir)=>{
        let m = g.matrix[`row${y}`][`col${x}`]
      },
      rot:(block)=>{
        const N = block.length - 1;
        const result = block.map((row, i) =>
          row.map((val, j) => block[N - j][i])
        );
        return result;
      },
      movnturn:()=>{
        let curr = [g.pos.x,g.pos.y];
        let x = g.pos.x;
        let y = g.pos.y;
        let face = g.pos.f;
        let dir = g.lastDir;
        let [steps,turn] = g.route.length ? g.route.shift() : [false,false];
        if(!steps && !turn){
          lscore = {right:0,down:1,left:2,up:3};
          let sum = (Number(g.pos.y+1) * 1000) + (Number(g.pos.x+1) * 4) + Number(lscore[g.lastDir]);
          g.part1 = sum;
          if(debug||fancy) console.log(`================ FINISHED THE GAME at row ${g.pos.y+1} column ${g.pos.x+1} facing ${g.lastDir} ending sum: ${sum} ================`);
          //console.log(g);
          return g;
        }
        let i=0;
        a: while(i<steps){
          i++;
          let check = g.check(curr,face);
          let isvoid = g.checkVoid(curr,face);
          let old = curr;
          if(debug) console.log("is it void or border?",isvoid,"going",dir);
          if(isvoid){
            aa: switch(dir){
              case "right":
                let rx = g.firstcol.get(''+y)-1;
                curr=[rx,y];
                if(debug) console.log("right void hopping to first col", g.firstcol.get(''+y), curr)
                check = g.check(curr,face);
              break aa;
              case "left":
                let lx = g.lastcol.get(''+y);
                curr=[lx,y];
                check = g.check(curr,face);
              break aa;
              case "down":
                let dm = g.matrix, dcol=null;
                //let drow = f.fromPath(g.matrix,`row${y}`);
                //console.log("==----------------------=",drow);
                for(dx=0; dx< Object.keys(dm).length; dx++){
                  let row = dm[`row${dx}`];
                  let xs = Object.values(row);
                  let ret = xs.filter((p)=>{
                    return p.x == x && p.void == false ? p : false;
                  }).sort((a,b)=>a.y-b.y).shift();
                  if(ret && ret.y && dcol == null){
                    dcol = ret.y;
                  }
                  //console.log(ret, dcol);
                }
                if(dcol!=null){
                  if(debug) console.log("dcol is",dcol);
                  //y = g.pos.y = dcol;
                  curr = [x,dcol-1]
                  //console.log(curr);
                } else {
                  if(debug) console.log("dcol not defined, why?")
                  curr = old;
                }
                check = g.check(curr,face);
                if(!check){
                  curr = old;
                  y = g.pos.y =  old[1];
                  i = steps;
                  dcol = null;
                  //check = false;
                  //break a;
                }
                break aa;
              case "up":
                let um = g.matrix,ucol=null;
                
                for(ux=Object.keys(um).length; ux>0; ux--){
                  let urow = um[`row${ux}`];
                  if(!urow) continue;
                  //console.log(urow)
                  let us = Object.values(urow);
                  let uret = us.filter((p)=>{
                    return p.x == x && p.void == false ? p : false;
                  }).shift();
                  if(uret && uret.y && ucol == null){
                    ucol = uret.y;
                  }
                  //console.log(ret, dcol);
                }
                if(ucol!=null){
                  if(debug) console.log("ucol is",ucol);
                  curr = [x,ucol+1]
                  if(debug) console.log(curr);
                  } else {
                    curr = old;
                    ucol = null;
                  }
                  check = g.check(curr,face);
                  if(!check){
                    curr = old;
                    i = steps;
                    check = false;
                    break a;
                  }
                
                break aa;
              default:
                break aa;
            }
          }
          if(!check) {
            if(debug) console.log("stopping")
            i = steps;
            break a;
          }
          curr = g.visit(curr,face)
        }
        if(turn) g.turn(turn);
        return g.movnturn();
      }
    }
    return g;
  }
  
  
  return state
}
module.exports = day22;