const day1 = async(i)=>{
  i = i.replace(/\r\n/g,'\n')
  let elves = new Map()
  let ls = i.split('\n\n').map((l,i)=>{ let id= i+1; let elf = {t:0,i:[]}; l.split('\n').map(le=>{ lei= parseInt(le); elf.t+=lei; elf.i.push(lei)}); elves.set("elf"+id,elf); return elf; });
  return elves;
}
module.exports = day1;