const day8 = async (i) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n');
  const grid = i.map(row => row.split("").map(Number));
  return grid;
};
module.exports = day8;