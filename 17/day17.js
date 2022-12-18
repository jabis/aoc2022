const day16 = async (i) => {
    i = i.replace(/\r\n/g, '\n');
    //i = i.split('\n');
    //console.log(i);
    let moves = i.split('');
    let chars ={
      wl: '▌',
      wr: '▐',
      nil: ' ',
      blk:'█',
      floor: '▄',
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
          [1,1,0],
          [1,1,0],
        ],
        [
          [1,1,0],
          [0,1,1],
        ],
        [
         [1,0,0],
         [1,0,0],
         [1,1,1],
        ]
    ].map(blk=>{
      return blk.map((r,i)=>{
        //console.log("row",r);
        let piece = 1;
        let row=1,
          col=0;
        if(i==0||i==2){
            piece = "I";
            row=4;
        }
        else if(i==1) {piece = "+";}
        else if(i==3) {piece = chars['blk'];}
        else if(i==4) {piece = "Z";}
        else if(i==5) {piece = "L";}
        else {
          piece = 1;
        }
        blockmax = Math.max(Number(r.length),Number(blockmax));
        let block = r.map(c=>{
          if(Array.isArray(c))
            return c.map(char=>{
              return char===1 ? chars['blk'] : chars['nil']
            })
          else 
            return c = c ===1 ? chars['blk'] : chars['nil']
        })
        return {block,piece,row,col}
      })
    })
    return {moves,blocks,chars,blockmax};
  };
  module.exports = day16;