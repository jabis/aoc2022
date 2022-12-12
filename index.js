const debug = false,
  printout = true;
const rf = require('./rf');
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
  day12 = require('./12/day12')

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
    await new Promise(async(r,b)=>{
      console.log("============Start Day12==========")
      console.time('day12');
      let inp = await rf('./12/input');
      const {map,start,end,BFS} = await day12(inp);
      //console.log(map);
      let search = new BFS(map,"length");  
      let something = search.shortestPath(end, start);
      console.log(something);
      let part1, 
        part2;
      console.log("Answer for part1: DID NOT FINISH");
      console.log("Answer for part2: DID NOT FINISH");
      console.timeEnd('day12');
      console.log("=============EOF Day12===========")
      return r({part1,part2})
    })
  })()