const day16 = async (i) => {
    i = i.replace(/\r\n/g, '\n');
    i = i.split('\n');
    let moves = i.split('');
    let chars ={
      wl: '▌',
      wr: '▐',
      nil: ' ',
      blk:'█',
      floor: '▀',
      left:'◄',
      right:'►',
      down:'▼'
    }
    blockmax = 0;
    let blocks = [
        [
          [1,1,1,1]
        ],
        [
          [0,1,0],
          [1,1,1],
          [0,1,0]
        ],
        [
          [1],
          [1],
          [1],
          [1]
        ],
        [
          [[1],[1]],
          [[1],[1]]
        ]
    ].map(blk=>{
      return blk.map(r=>{
        return r.map(c=>{
         blockmax = Math.max(c.length,blockmax);
          c.map(char=>{
            return char===1 ? chars['blk'] : chars['nil']
          })
        })
      })
    })
    return {moves,blocks,chars,blockmax};
  };
  module.exports = day16;