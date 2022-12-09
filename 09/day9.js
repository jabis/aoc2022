const day9 = async (i) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n');
  const move = i.map(row => row.split(" ").map((p,i)=>{ if(i==1) p = Number(p); return p }));
  return move;
};
module.exports = day9;