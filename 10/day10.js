const day10 = async (i) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n');
  i = i.map(r=>{ 
    let pts = r.split(' '); 
    let op =  pts.shift(),
      val = pts.shift();
    return {type:op,value:val? Number(val) : "" , duration: op == "noop" ? 1 : 2} 
  });
  return i;
};
module.exports = day10;