const day4 = async(i)=>{
  i = i.replace(/\r\n/g,'\n');
  i = i.split('\n')
  let elves = i.map((item,idx)=>{
    let comma = item.split(/,/);
    let first = comma.shift().split(/-/).map(Number);
    let second = comma.shift().split(/-/).map(Number);
    return [first,second];
  })
  //console.log(elves.length)
  return elves;
};
module.exports = day4;