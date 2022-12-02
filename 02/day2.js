const day2 = async(i)=>{
  i = i.replace(/\r\n/g,'\n');
  let re = new RegExp(/([ABC]) ([XYZ])(\n|$)/,'gim')
  let elves = i.match(re);
  elves = elves.map(e=>{ return e.replace('\n','').split(' '); })
  //console.log("elves",elves);
  return elves;
}
module.exports = day2;