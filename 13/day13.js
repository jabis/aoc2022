
const day13 = async (i) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n\n');
  i = i.map(r=>{ r = r.split('\n'); return {left:JSON.parse(r.shift()), right:JSON.parse(r.shift())} })
  return i;
};
module.exports = day13;