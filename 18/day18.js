const day18 = async (i) => {
    i = i.replace(/\r\n/g, '\n');
    i = i.split('\n');
    i = i.map(r=>r.split(',').map(Number));
    return i;
  };
  module.exports = day18;