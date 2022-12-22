const debug = false,
  printout = false,
  fancyprint = true;
const {rf,funcs} = require('./rf');
const fs = require('fs');
const day1 = require('./01/day1'),
  day2 = require('./02/day2'),
  day3 = require('./03/day3'),
  day4 = require('./04/day4'),
  day5 = require('./05/day5'),
  day6 = require('./06/day6'),
  day7 = require('./07/day7'),
  day8 = require('./08/day8'),
  day9 = require('./09/day9'),
  day10 = require('./10/day10'),
  day11 = require('./11/day11'),
  day12 = require('./12/day12'),
  day13 = require('./13/day13'),
  day14 = require('./14/day14'),
  day15 = require('./15/day15'),
  day16 = require('./16/day16'),
  day17 = require('./17/day17'),
  day18 = require('./18/day18'),
  day19 = require('./19/day19'),
  day20 = require('./20/day20'),
  day21 = require('./21/day21'),
  day22 = require('./22/day22')
  ;
(async ()=>{
  await new Promise(async(r,b)=>{
    console.log("============Start Day1==========")
    console.time('day1');
    let i = await rf('./01/input');
    let elves = await day1(i);
    let part1 = Math.max(...Array.from(elves.values()).map(t=>t.t));
    console.log("part 1 total", part1);
    let top3 = Array.from(elves.values()).sort((a,b)=>{ return a.t - b.t }).reverse().slice(0,3);
    let part2 = top3.map(t=>t.t).reduce((a,b)=>{return a+b},0);
    console.log("part 2 total", part2);
    console.timeEnd('day1');
    console.log("=============EOF day1===========")
    return r({part1,part2})
  })
  await new Promise(async(r,b)=>{
    console.log("============Start Day2==========")
    console.time('day2');
    let i = await rf('./02/input');
    let l = {A:"ROCK",B:"PAPER",C:"SCISSORS",X:"ROCK",Y:"PAPER",Z:"SCISSORS"}
    let s = {A:1,B:2,C:3,X:1,Y:2,Z:3}
    let p = {l:0,d:3,w:6}
    let rds = await day2(i);
    let t = {me:0,out:{}};
    let proc = (elf,me)=>{
      let ret="INVALID INPUT";
      switch(me){
        case 1:
          if(elf==1) ret = "DRAW";
          else if(elf==2) ret = "LOSE";
          else if(elf==3) ret = "WIN";
        break;
        case 2:
          if(elf==2) ret = "DRAW";
          else if(elf==1) ret = "WIN";
          else if(elf==3) ret = "LOSE"
        break;
        case 3:
          if(elf==3) ret = "DRAW";
          else if(elf==2) ret = "WIN";
          else if(elf==1) ret = "LOSE";
        break;
      }
      return ret;
    }
    rds.map(async(rnd,i)=>{
      let elf = s[rnd[0]];
      let me = s[rnd[1]];
      let res = proc(elf,me);
      if(debug) console.log("YOUR", l[rnd[1]]," VERSUS ELVES", l[rnd[0]], "RESULT", res);
      switch(res){
        case "WIN":
          t.me += parseInt(p.w)+parseInt(me);
        break;
        case "DRAW":
          t.me += parseInt(p.d)+parseInt(me);
        break;
        case "LOSE":
          t.me += parseInt(p.l)+parseInt(me);
        break;
        default:
          console.log("WE SHOULD NOT BE HERE");
        break;
      } 
      return rnd;
    })
    if(debug) console.log("Iterated rounds:", rds.length)
    console.log("part 1","Your Final Score:",t.me);
    let l2 = {A:"ROCK",B:"PAPER",C:"SCISSORS",X:"LOSE",Y:"DRAW",Z:"WIN"};
    let s2 = {A:1,B:2,C:3}
    let swap = (a)=>{ let b = {}; for(let k in a){  b[a[k]] = k; } return b; }
    let v2 = swap(s2);
    let p2 = {l:0,d:3,w:6}
    let t2 = {me:0,out:{}};
    let part2 = rds.map(r=>{
      let elf = r[0];
      let elfv = s2[elf];
      let me = r[1];
      let act = l2[me];
      switch(act){
        case "DRAW":
          t2.me += elfv+p2.d;
        break;
        case "LOSE":
          for(ix=1;ix<4;ix++){
            let r = proc(elfv,ix)
            if(debug) console.log("r",r, s2[v2[ix]]);
            if(r==act) t2.me += s2[v2[ix]]+p2.l;
          }
        break;
        case "WIN":
          for(iz=1;iz<4;iz++){
            let r = proc(elfv,iz);
            if(debug) console.log("r",r, s2[v2[iz]]);
            if(r==act) t2.me += s2[v2[iz]]+p2.w;
          }
        break;
      }
    })
    console.log("part 2","Your Final Score:",t2.me);
    console.timeEnd('day2');
    console.log("=============EOF Day2===========")
    return r({t,t2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day3==========")
      console.time('day3');
      let inp = await rf('./03/input');
      let rucksacks = await day3(inp);
      
      let cr = (sk,l,c,s=false)=>{
        let obj = {}
        for (const n of Array(l).keys()) {
          let v = sk?sk+1:(n+1);
          sk = v;
          if(!s) obj[String.fromCharCode(c.charCodeAt(0) + n)]=v;
          else obj[v] = String.fromCharCode(c.charCodeAt(0) + n)
        }
        return obj;
      }
      let has = function(s,k) {
        let r = s.filter(function(it){ return k.indexOf(it) > -1});   
        return (r.length > 0);  
      };
      let lc = cr(0,26,'a');
      let uc = cr(26,26,'A');
      if(debug) console.log(lc,uc);
      let met = {};
      let part1 = rucksacks.map(rs=>{
        let len = rs.length, sp = len / 2, p2 = rs.splice(sp,len), p1 = rs, pt = 0, spent = [];
        p1.map(p=>{
          let f = has(p2,p);
          if(f){
            let val = met[p] = lc[p] ? lc[p] : uc[p] ? uc[p] : 0;
            if(!has(spent,p))pt += val;
            spent.push(p);
          } 
        });
        return pt;
      }).reduce((o,v)=>o+v,0);
      
      console.log("Total Part 1",part1); 
      rucksacks = await day3(inp); // reset rucksacks for part 2 as we meddled with splice above
      let chks = 3;
      let part2 = rucksacks.reduce((arr, it, idx) => { 
        const ci = Math.floor(idx/chks);
        if(!arr[ci]) 
          arr[ci] = [] 
        arr[ci].push(it)
        return arr
      },[]).map((chunk,idx)=>{
        let badge = false, a = chunk.shift(), b=chunk.shift(), c=chunk.shift(), spent=[];
        let sm = a.map(i=>{
          if(has(b,i) && has(c,i) && !has(spent,i)){ 
            badge = i;
            let val = lc[i] ? lc[i] : uc[i] ? uc[i] : 0;
            spent.push(badge)
            return val;
          }
          return 0
        }).reduce((a,b)=>a+b,0);
        if(badge){
          if(debug) console.log(`Chunk ${idx} ${badge} ${sm}`);
          return sm;
        }
        return 0
      }).reduce((a,b)=>a+b,0);

      console.log("Total for Part 2",part2)
      console.timeEnd('day3');
      console.log("=============EOF Day3===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day4==========")
      console.time('day4');
      let inp = await rf('./04/input');
      let pairs = await day4(inp);
      function fop(prs) {
        let olap = [];
        for (let i = 0; i < prs.length; i++) {
          let p1 = prs[i];
          for (let j = i + 1; j < prs.length; j++) {
            let p2 = prs[j];
            if (p1[0] <= p2[1] && p2[0] <= p1[1]) {
              olap.push(p1);
              olap.push(p2);
            }
          }
        }
        return olap;
      }
      function fcont(prs) {
        let full = 0;
        for (let i = 0; i < prs.length; i++) {
          let p1 = prs[i];
          for (let j = i + 1; j < prs.length; j++) {
            let p2 = prs[j];
            if ((p1[0] >= p2[0] && p1[1] <= p2[1]) || (p1[0] <= p2[0] && p1[1] >= p2[1])) {
              if (debug) console.log("HIT", p1, p2);
              full++;
            }
          }
        }
        return full;
      }
      let part2 = 0;
      let part1 = pairs.reduce((prev,pair)=>{
        let overlap = fop(pair);
        if(debug) console.log(`Some overlap: `,overlap);
        let fcp = fcont(pair);
        if(debug &&fcp>0) console.log(`Fully contained: `,fcp)
        if(overlap.length) part2 += 1;
        if(fcp>0) prev += fcp;
        return prev;
      },0)
      console.log(`Part 1 total:`, part1)
      console.log(`Part 2 overlaps:`, part2)
      console.timeEnd('day4');
      console.log("=============EOF Day4===========")
      return r({part1,part2});
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day5==========")
      console.time('day5');
      let inp = await rf('./05/input');
      let {matrix,movearr,dimensions} = await day5(inp);
      //console.table(matrix);
      //console.log(movearr);
      let res = [];
      let spc = ' ';
      function getFirst(column){
        //console.log("picking first row",column);
        let positions = matrix.length-1;
        let available = false;
        for(let x = 0; x<=positions; x++){
          let rowi = matrix[x][column];
          available = rowi != " " ? rowi : false;
          if(available !== false) return {row:x,column, available};
        }
        return available;
      }
      function scanEmpty(column){
        let positions = matrix.length-1;
        let available = false;
        for(let x = positions; x>=0; x--){
          let rowi = matrix[x][column];
          available = (rowi == " " || typeof rowi == undefined) ? x : false;
          if(available !== false) return {row:x,column};
        }
        return available;
      }
      function move(p1,p2){
        if(matrix[0][p2] != " ") {
          let howmany = dimensions[0];
          let newrow = []
          for(z=0;z<=howmany;z++){
            newrow.push(' ');
          }
          matrix.unshift(newrow);
        }
        let available = scanEmpty(p2);
        if(available !== false) {
          let first = getFirst(p1);
          matrix[available.row][available.column] = first.available;
          matrix[first.row][first.column] = ' '; 
        } 
      }
      
      function movebatch(many,from,to){
        if(many<1) return;
        for(let x=0; x<many; x++){
          move(from,to);
        }
      }
      for(const [howmany,from,to] of movearr){
        movebatch(howmany,from-1,to-1);
      }
      let part1 = "";
      for(let firsts=0; firsts<dimensions[0]; firsts++){
        part1 +=getFirst(firsts).available;
      }
      if(debug) console.table(matrix);
      console.log("Answer for part1:",part1);
      let {matrix:m1,movearr:m2, dimensions:m3} = await day5(inp); //restart the matrix
      matrix = m1;
      movearr = m2;
      dimensions = m3;
      matrix.map(m=>{
         m.push(' ')
      })
      let offsite = matrix.length; // let's give a switchlane
      dimensions[0] = dimensions[0]+1;
      //console.log(matrix,movearr,dimensions);
      function movemulti(many,from,to){
        let {row:firstrow,column} = getFirst(from);
        let movables = []
        for(let sr=firstrow;sr<(firstrow+many);sr++){
          let moving = matrix[sr][column];
          move(from, offsite)
        }
        for(let zz = 0; zz<many; zz++){
           move(offsite,to);
        }
        //console.log(movables);
        //console.table(matrix);  
      }
      
      for(const [howmany,from,to] of movearr){
        movemulti(howmany,from-1,to-1);
      }
      if(debug) console.table(matrix)
      let part2 = "" 
      for(let seconds=0; seconds<dimensions[0]; seconds++){
        part2 +=getFirst(seconds).available;
      }
      console.log("Answer for part2: DID NOT FINISH");
      console.timeEnd('day5')
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day6==========")
      console.time('day6');
      let inp = await rf('./06/input');
      let stream = await day6(inp);
      function decode(str, len) {
        const uniq = [];
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          uniq.push(char);
          uniq.splice(0, uniq.length - len);
          if (new Set(uniq).size === len) {
            return i + 1;
          }
        }
      }
      let [part1,part2] = stream.reduce((p,s)=>{ 
        if(!p) p = []
        let part1 = decode(s,4);
        let part2 = decode(s,14);
        p.push(part1,part2)
        return p;
      },[]);
      console.log("Answer for part1: ",part1);
      console.log("Answer for part2: ",part2);
      console.timeEnd('day6');
      console.log("=============EOF Day6===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day7==========")
      console.time('day7');
      let inp = await rf('./07/input');
      let {fsm,input:prompt} = await day7(inp);

      let iscmd = new RegExp(/^\$/, 'g');
      prompt.split('\n').map(line=>{
        if (line.match(iscmd)) {
          line = line.replace('$ ', '');
        }
        else {
          let l = line.split(' '),
          first = l.shift(),
          second = l.shift(),
          dof = first == "dir" ? true : false;
          if (dof) {
            line = `mkdir ${second}`;
          } else {
            line = `add ${first} ${second}`
          }
        }
        return line;
      }).map(line => {
        if(debug) console.log("line", line);
        fsm.execute(line)
        return line;
      })
      //console.log(fsm);
      fsm.cd('/');
      let part1 = 0;
      for(let [i,s] of Object.entries(fsm.folderSizes)){
        if(s<=100000){
          if(debug) console.log("s?",s, "i?",i)
          part1+=parseInt(s);
        }  
      }
      if(debug) console.log("total space", fsm.diskspace, "usedspace", fsm.usedspace,"required", fsm.updaterequires,"free space", (fsm.diskspace-fsm.usedspace));
      let current = fsm.diskspace-fsm.usedspace;
      let missing = fsm.updaterequires-current;
      if(debug) console.log("missing", missing, current-missing);
      let sorted = Object.entries(fsm.folderSizes).filter(i=>{
        return (i[1]>=missing) ?i:false;
      }).sort((a,b)=>a[1]-b[1])
      
      if(debug) console.log("sorted",sorted);
      console.log("Answer for part1: ",part1);
      let part2 = 0;
      if(sorted.length){
        let min = sorted.shift();
        let subs = fsm.getSubfolderSizes(min[0]);
        part2 = Object.values(subs.children).reduce((p,v)=>{

          if(v.total>missing) p=v.total;
          return p;
        },0)
      }
      console.log("Answer for part2: ",part2);
      console.timeEnd('day7');
      console.log("=============EOF Day7===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day8==========")
      console.time('day8');
      let inp = await rf('./08/input');      
      let grid = await day8(inp);
      if(debug) console.log(grid);
      const vface = [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ];
      function getVis(g) {
        let v = g.map(r => r.map(() => 0)),e=vface;
        for (let i = 0; i < g.length; i++) {
          for (let j = 0; j < g[i].length; j++) {
            a: for (const [ei, ej] of e) {
              let [i2, j2] = [i + ei, j + ej];
              for (;i2 >= 0 && j2 >= 0 && i2 < g.length && j2 < g[i2].length; i2 += ei, j2 += ej) {
                if (g[i2][j2] >= g[i][j]) continue a;
              }
              v[i][j] = 1;
              break;
            }
          }
        }
        return v;
      }
      function getScore(g) {
        let v = g.map(r => r.map(() => 1)),e=vface;
        for (let i = 0; i < g.length; i++) {
          for (let j = 0; j < g[i].length; j++) {
           for (const [ei, ej] of e) {
              let [i2, j2] = [i + ei, j + ej];
              for (;i2 >= 0 && j2 >= 0 && i2 < g.length && j2 < g[i2].length; i2 += ei, j2 += ej) {
                if (g[i2][j2] >= g[i][j]) {
                  i2 += ei;
                  j2 += ej;
                  break;
                }
              }
              v[i][j] *= Math.abs(i2 - ei - i) + Math.abs(j2 - ej - j);
            }
          }
        }
        return v;
      }
      
      let vis = getVis(grid);
      let part1 = vis.flat().reduce((p, v)=>p + v,0);
      let scores = getScore(grid);
      let part2 = Math.max(...scores.flat());
      console.log("Answer for part1: ",part1);
      console.log("Answer for part2: ",part2);
      console.timeEnd('day8');
      console.log("=============EOF Day8===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day9==========")
      console.time('day9');
      let inp = await rf('./09/input');      
      let moves = await day9(inp);
      
      let state = {
        h:{curr:[0,0],visited:[],moves:new Set()},
        t:{curr:[0,0],visited:[],moves:new Set()},
      }
      function visit(which,pos){
        if(state.hasOwnProperty(which)){
          state[which].moves.add(JSON.stringify(pos));
          state[which].visited.push(pos)
        }
      }
      
      let m ={
        'R':[1,0],
        'L':[-1,0],
        'U':[0,1],
        'D':[0,-1]
      }
      let chk = [
        [0,1],
        [0,-1],
        [1,0],
        [-1,0],
        [1,1],
        [1,-1],
        [-1,1],
        [-1,-1],
      ]
      let scan = (a, b) => {
        return (
          (a[0] === b[0] && a[1] === b[1]) ||
          chk.some(
            (c) => b[0] + c[0] === a[0] && b[1] + c[1] === a[1],
          )
        )
      }
      visit('h',[0,0])
      visit('t',[0,0])
      moves.map(move=>{
        let hc = state.h.curr;
        let tc = state.t.curr;
        let cmd = move.shift();
        let cnt = move.shift();
        let [dx, dy] = m[cmd];
        let endPos = [hc[0] + dx *cnt, hc[1] + dy * cnt];
        let between = [];
        while(cnt--){
          if(!cnt) break;
          let x = [hc[0] + dx *cnt, hc[1] + dy * cnt];
          between.push(x);
        }
        if(between.length){
          between.reverse().map(b=>{
            tc = state.t.curr;
            hc = state.h.curr = b;            
            visit('h',b);
            let isAdjacent = scan(hc,tc);
            if(!isAdjacent){
              let hprev = state.h.visited[state.h.visited.length-2];
              let tlast = state.t.visited[state.t.visited.length-1];
              let vis = state.t.visited.some(x=>{return x[0] == hprev[0] && x[1]== hprev[1] ? true : false;});
              if(debug) console.log("move the tail (between) head now",hc,"<head previous | tail next>",hprev, "tail last",tlast, "move already recorded",vis);
              tc = state.t.curr = hprev;
              if(!vis) visit('t',hprev);
            }

            return b;
          })
        }
        tc = state.t.curr;
        hc = state.h.curr = endPos; 
        visit('h', endPos);
      
        let isAdjacent = scan(hc,tc);
        if(!isAdjacent){
          let hpr = state.h.visited[state.h.visited.length-2];
          let tla = state.t.visited[state.t.visited.length-1];
          let vis = state.t.visited.some(x=>{return x[0] == hpr[0] && x[1]== hpr[1] ? true : false;});
          if(debug) console.log("move the tail (last), head now",hc,"<head previous | tail next>",hpr, "tail last",tla, "move already recorded",vis)
          tc = state.t.curr = hpr;
          if(!vis) visit('t',hpr);
        }
      })
      //let head = state.h.visited;
      let tail = state.t.visited;
      if(printout){
        let out = JSON.stringify(state)
        fs.writeFileSync('./output.json',out)
      }
      let part1 =tail.length,
        part2;
      console.log("Answer for part1",part1);
      console.log("Answer for part2: DID NOT FINISH");
      console.timeEnd('day9');
      console.log("=============EOF Day9===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day10==========")
      console.time('day10');
      let inp = await rf('./10/input');      
      let program = await day10(inp);
      let duration = program.reduce((a,b)=>a+b.duration,0);
      let x = 1;
      let cycle = 0;
      let spendcycle = 0;
      let signalStrengths = [];
      let ci = 0;
      let queue = [],
        ints =[20, 60, 100, 140, 180, 220],
        display=[];
      while (ci < duration) {
        const instruction = program[ci];
        let llen = 40, ln = Math.floor(cycle / llen);
        cycle++;
        spendcycle++;
        if(debug) console.log(`Starting ${cycle} with queue length`,queue.length);
        if(instruction){
          if (instruction.type === "addx") {
            spendcycle++
            queue.push({value:instruction.value, sp:spendcycle})
          } else {
            queue.push({value:0, sp:spendcycle})
          }
        }
        if (!display[ln]) display[ln] = new Array(llen).fill(" ");
        if (cycle - ln * llen >= x && cycle - ln * llen <= x + 2) display[ln][cycle - 1 - ln * llen] = "█";
        if (ints.some(i=>{ return i==cycle; })) {
          const signalStrength = cycle * x;
          if(debug) console.log(`cycle ${cycle} currval = ${x} signal strength is ${signalStrength} `)
          signalStrengths.push(signalStrength);
        }
        if(debug) console.log(`X on ${cycle} is ${x}`)
        queue = queue.filter(item=>{
          if(item.sp == cycle){
            if(debug) console.log("processing assignment",item);
            x= x+item.value;
            if(debug) console.log(`X at the end of ${cycle} is now ${x}`) 
          }
          return cycle < item.sp ? item : false 
        })
        ci++;
      }
      let part1 = signalStrengths.reduce((a, b) => a + b, 0),
      part2 = display.join("\n");
      console.log("Answer for part1",part1);
      console.log("Answer for part2:\n",part2);
      console.timeEnd('day10');
      console.log("=============EOF Day10===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day11==========")
      console.time('day11');
      let inp = await rf('./11/input');      
      
      let runner = (monkeys,round=1,cnt=0,maxrounds=20)=>{
        let modulo = 1;
        for (let m of monkeys){
          modulo *= +m.divby;
        }
        if(debug) console.log("combinated modulo",modulo);
        while (cnt<maxrounds) {
          for (let monkey of monkeys) {
            if (monkey.items.length === 0) continue;
            if(!monkey.hasOwnProperty('monkeyBusiness')) monkey.monkeyBusiness = 0;
            while (monkey.items.length) {
              let worryLevel = monkey.items.shift();
              monkey.monkeyBusiness++;
              worryLevel = monkey.op(worryLevel, worryLevel);
              if(maxrounds == 20) worryLevel = Math.floor(worryLevel / 3);
              else worryLevel %= modulo;
              let destination = monkey.tst(worryLevel) ? monkey.iftrue : monkey.iffalse;
              monkeys[destination].items.push(worryLevel);
            }
          }
          round++;
          cnt++;
        }
        let monkeybusiness = monkeys.sort((a,b)=>a.monkeyBusiness-b.monkeyBusiness);
        let product = monkeybusiness.slice(-2).map(i=>i.monkeyBusiness).reduce((a,b)=>{
          return a * b
        },1)
        return product;
      }

      let part1=runner(await day11(inp),1,0,20),
        part2=runner(await day11(inp),1,0,10000);
      console.log("Answer for part1",part1);
      console.log("Answer for part2:\n",part2);
      console.timeEnd('day11');
      console.log("=============EOF Day11===========")
      return r({part1,part2})
    })
    /*await new Promise(async(r,b)=>{
      console.log("============Start Day12==========")
      console.time('day12');
      let inp = await rf('./12/input');
      const {map,start,end,BFS} = await day12(inp);
      let search = new BFS(map,"length");  
      let part1 =search.shortestPath(end, start), 
        part2=0;
      let min = Number.MAX_SAFE_INTEGER;
      for(let y=0;y<map.length;y++){
        for(let x=0;x<map[0].length;x++){
          if(map[y][x]=='a'.charCodeAt(0)){
            let s = new BFS(map,"length");
            let z = s.shortestPath(end,[y,x]);
            if(z<min && z>0){
              min = z;
            }
          }
        }
      }
      part2 = min;
      console.log("Answer for part1",part1);
      console.log("Answer for part2", part2);
      console.timeEnd('day12');
      console.log("=============EOF Day12===========")
      return r({part1,part2})
    })*/
    await new Promise(async(r,b)=>{
      console.log("============Start Day13==========")
      console.time('day13');
      let inp = await rf('./13/input');
      let lr = await day13(inp);
      const numarr = (a, b) => {
        for (let i = 0, len = Math.max(a.length, b.length); i < len; i++) {
          if (a.length <= i) return -1; if (b.length <= i) return 1;
          let l = a[i], r = b[i];
          if (typeof l == 'number' && typeof r == 'number') {
              if (l !== r) return l < r ? -1 : 1;
          } else {
            let larr = Array.isArray(l) ? l : [l],rarr = Array.isArray(r) ? r : [r];
            let recur = numarr(larr, rarr);
            if (recur !== 0) return recur;
          }
        }
        return 0;
      }
      let part1,part2,k1=[[2]],k2=[[6]];
      part1 = lr.map((obj,idx)=>{
        return (numarr(obj.left,obj.right)===-1) ? idx+1 : 0;
      }).reduce((a,b)=>a+b,0);
      let flat = lr.reduce((prev,obj)=>{
        if(!prev) prev=[]; prev.push([obj.left,obj.right]); return prev;
      },[]).flat();
      flat.push(k1);
      flat.push(k2);
      flat.sort(numarr);
      part2 = (1 + flat.indexOf(k1)) * (1 +flat.indexOf(k2));
      console.log("Answer for part1",part1);
      console.log("Answer for part2", part2);
      console.timeEnd('day13');
      console.log("=============EOF Day13===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day14==========")
      console.time('day14');
      let inp = await rf('./14/input');
      let coords = await day14(inp);
      let {rocks,xm,xx,ym,yx,xlen} = coords;
      let v0id = xm-1, voidr = xx+1;
      const sx = 500;
      const sy = 0;
      let cave = {},
        crock = "█",
        cdrop='Δ',
        cvoid="~",
        cempt=".",
        csand="o";
      for (let y = yx,yy=0; y>=0; y--,yy++){
        cave['r'+yy] ={}
        for (let i = v0id,ii=0; i <= voidr; i++,ii++) {
          cave['r'+yy]['c'+i] = (ii===0||i===voidr)?cvoid:cempt;
        }
      }
      cave[`r${sy}`][`c${sx}`]=cdrop;
      rocks.map(d=>{
        let last = null;
        while(d.length){
          let from = (last) ? last : d.shift();
          let to = d.length ? d.shift() : last;
          last = to;
          let [fx,fy] = from;
          let [tx,ty] = to;
          let lr = fy-ty===0, 
          ud= fx-tx===0,
          dist = lr ? tx-fx : ty-fy,
          dir = "no"; 
          if(lr) dir = dist > 0 ? "r" : "l";
          else dir = dist > 0 ? "d" : "u";
          cave[`r${fy}`][`c${fx}`] = crock;
          cave[`r${ty}`][`c${tx}`] = crock;
          switch(dir){
            case "l":
            case "u":
            while(dist++){
              let u= ud?fy+dist:fy;
              let l= ud?fx:fx+dist;
              cave[`r${u}`][`c${l}`] = crock
              if(dist==0) break;
            }
            break;
            case "d":
            case "r":
            while(dist--){
              let d= ud?ty-dist:ty;
              let r= ud?tx:tx-dist;
              cave[`r${d}`][`c${r}`] = crock;
              if(dist==0) break;
            }
            break;
            case "no":
            default:
              throw new Error('Nowhere to go')
          }
        }
      })
      let sandCave = [];
      Object.keys(cave).map((c,idx)=>{
        let obj = cave[c];
        let vals = Object.values(obj);
        vals.shift(); // remove v0id left
        vals.pop(); // remove void right
        sandCave[idx] = vals
      })

      
      let sc = 0, is = 0, js=0,jns=sandCave[0].findIndex(c=>c==cdrop);
      js = jns
      while (
        is +1 < sandCave.length &&
        js < sandCave[0].length-1 &&
        sandCave[1][js] !== csand 
      ) {
        if (sandCave[is + 1][js] === crock || sandCave[is + 1][js] === csand) {
          if (sandCave[is + 1][js - 1] === cempt) { is++; js--; } 
          else if (sandCave[is + 1][js + 1] === cempt) { is++; js++; } 
          else { sandCave[is][js] = csand; is = 1; js = jns; sc++; }
        } else { is++; }
      }
      let filled = sandCave.reduce((p,n)=>p+n.join("")+'\n',"");

      let flen = ''+sc;
      flen = flen.length;
      let f1 = "♯".repeat(Math.floor(Math.floor(sandCave[0].length/2)-flen))
      let f2 = "♯".repeat(Math.floor(Math.floor(sandCave[0].length/2)))
      let part1 = fancyprint ? `\n\x1b[33m${filled}\x1b[0m\x1b[31m${f1}\x1b[0m\x1b[32m${sc}\x1b[0m\x1b[31m${f2}\x1b[0m` : sc,
        part2;
      console.log("Answer for part1 ",part1);

      let part2Cave = [];

      if(debug) console.log(xm, xx, ym,yx)
      for(let oi=0;oi<yx+4;oi++){
        part2Cave[oi]=[];
        for(let m=0;m<xlen*4;m++){
          part2Cave[oi][m] = cempt;
        }
      }
      //console.log(part2Cave);
      Object.keys(cave).map((c,idx)=>{
        /*let obj = cave[c];
        let vals = Object.keys(obj);
        for(let val of vals){
          let data = obj[val];
          val = Number(val.replace('c',''));
          let id = Number(c.replace('r',''))
          part2Cave[id][val] = data;
        }*/
        let obj = cave[c];
        let vals = Object.values(obj);
        vals.shift(); // remove v0id left
        vals.pop(); // remove void right
        part2Cave[idx] = vals
      })
      let idz = part2Cave.length, vl = xlen;
      part2Cave.push([]);
      part2Cave.push([]);
      for (var jc = 0; jc < vl; jc++) {
        part2Cave[idz][jc] = cempt;
        part2Cave[idz+1][jc] = crock;
      }
      //console.log(part2Cave)
      let sc2 = 0, is2 = 0, js2=0,jns2=part2Cave[0].findIndex(c=>c==cdrop);
      js2 = jns2;
      if(debug) console.log(sc2,is2,js2,jns2);
      while (
        is2 +1 < part2Cave.length &&
        js2 < part2Cave[0].length &&
        part2Cave[0][jns2] !== csand 
      ) {
        if (part2Cave[is2 + 1][js2] === crock || part2Cave[is2 + 1][js2] === csand) {
          if (part2Cave[is2 + 1][js2 - 1] === cempt) { is2++; js2--; } 
          else if (part2Cave[is2 + 1][js2 + 1] === cempt) { is2++; js2++; } 
          else { part2Cave[is2][js2] = csand; is2 = 0; js2 = jns2; sc2++; }
        } else { is2++; }
        //if(sc2>5000) break;
      }
      
      let filled2 = part2Cave.reduce((p,n)=>p+n.join("")+'\n',"");
      //console.log(filled2);
      let flen2 = ''+sc2;
      flen2 = flen2.length;
      part2 = sc2;
      console.log("Answer for part2", part2);
      console.timeEnd('day14');
      console.log("=============EOF Day14===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day15==========")
      console.time('day15');
      let f = funcs();
      let inp = await rf('./15/input');
      let {signals,md,sign} = await day15(inp);
      let testY=10,xMax=20,yMax=20;
      const testLine = (y,xMax,yMax) => {
        let blocked = [];
        let beacons = new Set();
        let positions = new Set();
    
        signals.forEach(([sx, sy, bx, by, d]) => {
          if (by === y) {
            beacons.add(bx);
          }
          const dx = d - Math.abs(sy - y);
          if (dx < 0) {
            return;
          }
          for (let x = sx - dx; x <= sx + dx; x++) {
            positions.add(x);
          }
          blocked.push([sx - dx, sx + dx]);
        });
        blocked.sort();
        let i = 0;
        while (i < blocked.length - 1) {
          while (
            i < blocked.length - 1 &&
            blocked[i][1] >= blocked[i + 1][0] - 1
          ) {
            blocked[i][1] = Math.max(blocked[i][1], blocked[i + 1][1]);
            blocked.splice(i + 1, 1);
          }
          i += 1;
        }
        return {blocked, beacons, size: beacons.size, possize: positions.size}
      };
      let part1 = () =>{
        let {blocked, beacons, size, possize} = testLine(testY,xMax,yMax);
        const bc = blocked.reduce((acc, b) => acc + b[1] - b[0] + 1, 0);
        return `${bc}`
      }
      const part2 = () => {
        testY = 2000000;
        xMax = 4000000;
        yMax = 4000000;
        //let {blocked, beacons, size, possize} = testLine(testY,xMax,yMax);
        //const bc = blocked.reduce((acc, b) => acc + b[1] - b[0] + 1, 0);
        let minx = Number.MAX_SAFE_INTEGER;
        let miny = Number.MAX_SAFE_INTEGER;
        let maxx = Number.MIN_SAFE_INTEGER;
        let maxy = Number.MIN_SAFE_INTEGER;
        for (const [sx, sy, , , d] of signals) {
          minx = Math.min(minx, sx - d);
          miny = Math.min(miny, sy - d);
          maxx = Math.max(maxx, sx + d);
          maxy = Math.max(maxy, sy + d);
        }
        if (minx <= 0 && 0 <= maxx) {
          return [0, miny];
        }
        if (miny <= 0 && 0 <= maxy) {
          return [minx, 0];
        }
        if (minx <= xMax && xMax <= maxx) {
          return [xMax, miny];
        }
        if (miny <= yMax && yMax <= maxy) {
          return [minx, yMax];
        }
      };

      console.log("Answer for part1: DID NOT FINISH", /* part1() something wrong with the logic */);      
      console.log("Answer for part2: DID NOT FINISH", /* part2() ends up with range error*/ );
      console.timeEnd('day15');
      console.log("=============EOF Day15===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day16==========")
      console.time('day16');
      let f = funcs();
     
      let inp = await rf('./16/testinput'),part1,part2;

      let {valves,dijOE,diJOE2,diJOE3,diJOE4} = await day16(inp);
      let graph = new Map();
      valves.map(v=>{
        let paths = []
        v.paths.map(n=>{
          let vl = valves.find(c=>c.valve===n);
          paths.push([vl.valve, vl.rate]);
        })
        graph.set(v.valve,paths);
      })
      //console.log(graph);
      let g = dijOE(graph,"AA");
      //console.log(g);
      let aa =diJOE2(graph); 
      let ab =diJOE3(graph); 
      //let ac =diJOE4(graph); 
      /*let ab= diJOE2(graph,"DD");
      let ac= diJOE2(graph,"II");
      let ad= diJOE2(graph,"BB");*/
      console.log(aa);
      /*
      /*let first = 'AA', costOpen=1, costMove=1,timeLeft=30;
      let peeked = new Map();
      let visited = new Map();
      let calculated = new Set();
      let releasing = new Set();
      let totals = 0;
      let peek = (curr,prev,idx=0)=>{
        while(timeLeft>0){
          console.log("visiting",curr, timeLeft);
          visited.set(curr.valve,curr);
          if(curr != prev && prev) {
            valves[prev.idx].exhausted.push(curr.valve);
            console.log("prev is ", valves[prev.idx]);
          }
          let coeff = new Set();
          if(idx>0 || curr.status != "open" || curr.status != "broken"){
            timeLeft-=costMove;
          } 
          let cr = curr.rate, cn=curr.valve,cs=curr.status;
          curr.paths.map(n=>{
            let next = valves.find(v=>v.valve===n);
            if(next.rate !=0){
              coeff.add([next.valve,next.rate,next.status]);
            }
            peeked.set(n,next);
            
          })
          let [nextvalve,rate] = Array.from(coeff.values()).reduce((p,v)=>{
            if(p[1]>=v[1] && p[2] != "open"){
              //console.log("valid?",curr.status)
              return [p[0],p[1],p[2]];
            }
            else {
              return [v[0],v[1],v[2]];
            }
          },[cn,cr,cs])
          //console.log(nextvalve,rate,totals);
          //console.log(coeff,peeked,visited);
          if(nextvalve == cn){
            if(curr.status == "open" && curr.exhausted.length == curr.paths.length) {
              break;
            }
            curr.status = 'open';
            valves[curr.idx] = curr;
            timeLeft-=costOpen;
            console.log("opening",curr.valve,"timeLeft",timeLeft);
            totals += curr.rate * timeLeft;
            console.log("totals",totals)
            calculated.add(curr);
            releasing.add([cn,cr])
            return peek(valves.find(v=>v.valve===nextvalve),curr,idx++);
          } else {
            return peek(valves.find(v=>v.valve===nextvalve),curr,idx++);
          }
          
        }
      }
      peek(valves.find(v=>v.valve===first),0) */
      //console.log(valves);
      console.log("Answer for part1:",part1, /* part1() something wrong with the logic */);      
      console.log("Answer for part2:",part2, /* part2() ends up with range error*/ );
      console.timeEnd('day16');
      console.log("=============EOF Day16===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day17==========")
      console.time('day17');
      let i = await rf('./17/testinput');
      let f = funcs();
      let {moves,blocks,chars,blockmax} = await day17(i);
      //console.log(moves,blocks,chars,blockmax);
      let c = chars;
      let state ={
        currblock:null,
        chamber:[]
      }
      let chamber = state.chamber, 
        h = blockmax+2, 
        w=7;

      let newrow = ()=>{
        let arr = [];
        for(let x=0;x<w;x++) arr.push(c['nil'])
        return arr;
      }
      let fill = (arr,all=1)=>{
        let nr = newrow();
        for(let x=0;x<nr.length;x++){
          if(arr.length == 1 && all == 1) nr[x]= arr[0]
          else nr[x] = arr[x-1];
        }
        chamber.unshift(nr.flat())
      }
      
      let rot = (block)=>{
        const N = block.length - 1;
        const result = block.map((row, i) =>
          row.map((val, j) => block[N - j][i])
        );
        return result;
      }
      let isValid=(cellRow, cellCol)=>{
        let cb =getBlock()
        for (let row = 0; row < cb.block.length; row++) {
          for (let col = 0; col < cb.block[row].length; col++) {
            //console.log("chamber[cellRow + row][cellCol + col]",chamber[cellRow + row][cellCol + col]);
            if (cb.block[row][col] && (
                cellCol + col < 0 ||
                cellCol + col >= chamber[0].length ||
                cellRow + row >= chamber.length ||
                chamber[cellRow + row][cellCol + col])
              ) {
              return false;
            }
          }
        }
        return true;
      }
      
      
      //fill([c['floor']],1);
      for(let x=0;x<10;x++) fill([c['nil']],1);
      //console.log(chamber);
      
      function getBlock(){
        if(state.currblock===null) {
          let next = blocks.shift()
          state.currblock = next.shift();
        }
        return state.currblock;
      }
      function getNext() {
        let last = getBlock();
        //console.log("last",last);
        blocks.push([last]);
        //console.log(blocks);
        state.currblock = null;

        const block = getBlock();
        const matrix = block.block;
        //const col = chamber[0].length / 2 - Math.ceil(matrix[0].length / 2);
        let col = 2;
        //console.log(col-)
        const row = block.row;
        block.col = col;
        state.currblock = block;
        return block;
      }
      function placeBlock() {
        let cb = getBlock();
        let blen = cb.block.length;
        for (let row = 0; row < blen; row++) {
          let rlen = cb.block[row].length;
          for (let col = 0; col < rlen; col++) {
            if (cb.block[row][col]) {     
              if (cb.row + row < 0) {
                //console.log("Chamber height needs to grow",chamber.length, cb.row + row );
                fill([c['nil']],1)
                fill([c['nil']],1)
                fill([c['nil']],1)
                fill([c['nil']],1)
                fill([c['nil']],1)

              }
              chamber[cb.row + row][cb.col + col] = cb.piece;
            }
          }
        }
      
        // check for line clears starting from the bottom and working our way up
        for (let row = chamber.length - 1; row >= 0; ) {
          if (chamber[row].every(cell=>cell!=c['nil'])) {
            for (let r = row; r >= 1; r--) {
              for (let c = 0; c < chamber[r].length; c++) {
                //console.log(chamber[r], r-1)
                chamber[r][c] = chamber[r-1][c];
              }
            }
          }
          else {
            row--;
          }
        }
      
        cb =getNext();
      }
      let cnt = 2022;
      function move(m) {
        let cb = getBlock();
        //console.log("Moving ",cb.piece);
        lr = m == ">" ? 1 : m=="<" ? -1 : 0;
        //console.log("moving ",cb,m,cb.row,cb.col,lr);
        if(lr===0){
          const row = cb.row + 1;

          if(!isValid(row,cb.col)){
            //console.log("placing",cb);
            cb.row = row - 1;
            state.currblock = cb;
            placeBlock()
            return;
          } 
            
          cb.row = row;
          state.currblock = cb;
        } else {
          if(isValid(cb.row,cb.col)){
            cb.col = cb.col + lr;
            //console.log(cb.col);
            state.currblock = cb;
          }
          //moves.push(m)
        }
        //console.log(m);
        
      }
      while(cnt--){
        let movedir = moves.shift();
        move(movedir);
        move("d");
      }
      //console.log(chamber.map(r=>{ return r }).join('\n'));
      let part1,part2;
      console.log("Answer for part1:",part1, /* part1() something wrong with the logic */);      
      console.log("Answer for part2:",part2, /* part2() ends up with range error*/ );
      console.timeEnd('day17');
      console.log("=============EOF Day17===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day18==========")
      console.time('day18');
      let i = await rf('./18/testinput');
      let f = funcs();
      let coords = await day18(i);
      const xMax = Math.max(...coords.map(coords => coords[0]));
      const yMax = Math.max(...coords.map(coords => coords[1]));
      const zMax = Math.max(...coords.map(coords => coords[2]));
      let grid = new Array(xMax + 1).fill(0).map(() => new Array(yMax + 1).fill(0).map(() => new Array(zMax + 1).fill(false)));
      let vis = new Array(xMax + 1).fill(0).map(() => new Array(yMax + 1).fill(0).map(() => new Array(zMax + 1).fill(false)));      
      let vissed = 0;
      let dfs = (g, v, x, y, z)=>{
        if (x < 0 || x > xMax || y < 0 || y > yMax || z < 0 || z > zMax || !g[x][y][z] || v[x][y][z]) return;
        v[x][y][z] = true;
        vissed++;
        dfs(g,v,x - 1, y, z); // left
        dfs(g,v,x + 1, y, z); // right
        dfs(g,v,x, y - 1, z); // up
        dfs(g,v,x, y + 1, z); // down
        dfs(g,v,x, y, z - 1); // forward
        dfs(g,v,x, y, z + 1); // backward
      }
      let calc3d = (g,v,c)=>{
        for (const [x, y, z] of c) {
          grid[x][y][z] = true;
        }
        let area = 0, pariah = 0;
          for (let x = 0; x <= xMax; x++) {
            for (let y = 0; y <= yMax; y++) {
              for (let z = 0; z <= zMax; z++) {
                if (g[x][y][z]) {
                  dfs(g,v,x,y,z); 
                  if (x === 0 || !grid[x - 1][y][z]) area++; 
                  if (x === xMax || !grid[x + 1][y][z]) area++; 
                  if (y === 0 || !grid[x][y - 1][z]) area++;  
                  if (y === yMax || !grid[x][y + 1][z]) area++; 
                  if (z === 0 || !grid[x][y][z - 1]) area++; 
                  if (z === zMax || !grid[x][y][z + 1]) area++;
                  //
                }
              }
            }
          }
        return area;
      }
      
      //console.log(vis,vissed)

      let part1= calc3d(grid,vis,coords);
      dfs(grid,vis,0,0,0)
      ; 
      //dfs(grid,vis,0,0,0);
      let part2= vis;
      
      console.log("Answer for part1:",part1);      
      console.log("Answer for part2:",part2);
      console.timeEnd('day18');
      console.log("=============EOF Day18===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day19==========")
      console.time('day19');
      let i = await rf('./19/input');
      let f = funcs(),part1,part2;
      let robos = await day19(i);
      //console.log(robos);
      console.log("Answer for part1:",part1);      
      console.log("Answer for part2:",part2);
      console.timeEnd('day19');
      console.log("=============EOF Day19===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day20==========")
      console.time('day20');
      let i = await rf('./20/input');
      let bags = await day20(i);
      let mix = (bag, cnt)=>{
        bag = bag.map(v => ({ v: v }))
        let cp = [...bag]
        for (let c = 0; c < cnt; c++) {
          for (let b of cp) {
            let idx = bag.indexOf(b), old = bag.splice(idx, 1).shift(),
              pos = idx + b.v, len = bag.length;
            if (pos < 0) pos += len * Math.abs(Math.floor(pos / len));
            if (pos >= len) pos = pos % len;
            bag.splice(pos, 0, old)
          }
        }
        return bag.map(v => v.v)
      }
      let collect = (bag) => {
        let i = bag.indexOf(0), len=bag.length;
        return [
          bag[(1000 + i) % len],
          bag[(2000 + i) % len],
          bag[(3000 + i) % len]
        ].reduce((p, v) => p + v, 0)
      }
      let part1 = (bags) => {
        let bag = mix(bags, 1)
        return collect(bag);
      }
      let part2 = (bags) => {
        bags = bags.map(x => x * 811589153)
        let bag = mix(bags, 10)
        return collect(bag);
      }
      console.log("Answer for part1:",part1([...bags]));      
      console.log("Answer for part2:",part2([...bags]));
      console.timeEnd('day20');
      console.log("=============EOF Day20===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day21==========")
      console.time('day21');
      let input = await rf('./21/testinput');
      let {i,rootName,solve} = await day21(input);
      let part1 = solve(i,rootName),
        part2=0,
        solveLinearEquation = (b, a, y)=>{
          return (y - b) / a;
        };
      part2 =0;
      while(part2<Number.MAX_VALUE){
        part2 += 0.5;
        //console.log(solveLinearEquation(1,part2,150),part2)
        if(solve(i,rootName,part2)) break;
      }
      console.log("Answer for part1:",part1);      
      console.log("Answer for part2:",part2);
      console.timeEnd('day21');
      console.log("=============EOF Day21===========")
      return r({part1,part2})
    })
    await new Promise(async(r,b)=>{
      console.log("============Start Day22==========")
      console.time('day22');
      let input = await rf('./22/input'),part1,part2;
      let state = await day22(input,debug,fancyprint),
        game = state();      
      game = game.movnturn();
      if(fancyprint) console.log(game.print());
      console.log("Answer for part1:",game.part1);      
      console.log("Answer for part2:",part2);
      console.timeEnd('day22');
      console.log("=============EOF Day22===========")
      return r({part1,part2})
    })
  })()