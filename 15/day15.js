const day15 = async (i) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n');
  let n = /[^\d-]*/,
  lr = /Sensor at x=(-?[0-9]+), y=(-?[0-9]+): closest beacon is at x=(-?[0-9]+), y=(-?[0-9]+)/,
  md = (x1, y1, x2, y2)=>{ return Math.abs(x1 - x2) + Math.abs(y1 - y2);},
  sign = (x) => (x < 0 ? -1 : x > 0 ? 1 : 0);
  const input = i.map(line => lr.exec(line)).filter(match => match !== null);
  const signals = input.map(([, sx, sy, bx, by]) => [sx, sy, bx, by, md(sx, sy, bx, by)]);
  return {signals,sign,md};
};
module.exports = day15;