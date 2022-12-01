const day1 = async()=>{
  const crs = require('fs').createReadStream;
  let rf = async(i,enc="utf-8")=>{ return new Promise((r,b)=>{ let d = '', f = crs(i,enc); f.on('data',(c)=>{d+=c}); f.on('end',()=>{return r(d)}); f.on('error',b);}) }
  let i = await rf('./01/input1');
  i = i.replace(/\r\n/g,'\n')
  let elves = new Map()
  let ls = i.split('\n\n').map((l,i)=>{ let id= i+1; let elf = {t:0,i:[]}; l.split('\n').map(le=>{ lei= parseInt(le); elf.t+=lei; elf.i.push(lei)}); elves.set("elf"+id,elf); return elf; });
  return elves;
}
module.exports = {day1};