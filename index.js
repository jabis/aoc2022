const debug = false;
const rf = require('./rf');
const day1 = require('./01/day1'),
  day2 = require('./02/day2'),
  day3 = require('./03/day3'),
  day4 = require('./04/day4'),
  day5 = require('./05/day5'),
  day6 = require('./06/day6'),
  day7 = require('./07/day7'),
  day8 = require('./08/day8')
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
  })()