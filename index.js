const {day1} = require('./01/day1');
(async ()=>{
  let elves = await day1();
  let part1 = Math.max(...Array.from(elves.values()).map(t=>t.t));
  console.log("part 1 total", part1);
  let top3 = Array.from(elves.values()).sort((a,b)=>{ return a.t - b.t }).reverse().slice(0,3);
  let part2 = top3.map(t=>t.t).reduce((a,b)=>{return a+b},0);
  console.log("part 2 total", part2);
})()