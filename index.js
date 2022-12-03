const debug = false;
const rf = require('./rf');
const day1 = require('./01/day1'),
  day2 = require('./02/day2'),
  day3 = require('./03/day3');
(async ()=>{
  await new Promise(async(r,b)=>{
    console.log("==========Start Day1==========")
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
    console.log("==========Start Day2==========")
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
            if(debug) console.log("r",r, s2[v2[iz]]);
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
      console.log("==========Start Day3==========")
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
      rucksacks = await day3(inp,1); // reset rucksacks for part 2 as we meddled with splice above
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
          if(debug) console.log(`Chunk ${idx} ${badge} ${tot} ${sm}`);
          return sm;
        }
        return 0
      }).reduce((a,b)=>{return a+b},0);

      console.log("Total for Part 2",part2)
      console.timeEnd('day3');
      console.log("=============EOF Day3===========")
      return r()
    })
  })()