const day25 = async (i, debug, fancy) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n');
  const chr = {
    '2': 2,
    '1': 1,
    '0': 0,
    '-': -1,
    '=': -2
  }
  let unchr={};
  Object.keys(chr).map(key => { unchr[chr[key]] = key; })
  const ratio = 5;
  const snafu = (c, i) => chr[c] * i;
  const desnafu = dec => {
    let chrs = dec.toString(ratio).split('').map(c => +c);
    let idx = chrs.findIndex(c => c > 2);
    while (idx !== -1) {
       chrs[idx] -= ratio;
       if (idx > 0) chrs[idx - 1]++;
       else chrs = [1, ...chrs];
       idx = chrs.findIndex(c => c > 2);
    }
    return chrs.map(c => unchr[c]).join('');
  }
  let part1 = 0,part2="";
  i = i.map(r => {
    let chrs = r.split('');
    let vals = chrs.reverse().map((c, i) => {
      let pos = Math.pow(ratio, i);
      let val = snafu(c, pos);
      return val;
    }, 0)
    let sum = vals.reduce((p, a) => p + a);
    part1 += sum;
    return r
  });
  part2 = desnafu(part1);

  return {
    i,
    part1,
    part2
  };
}
module.exports = day25;