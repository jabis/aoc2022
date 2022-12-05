const day5 = async(i)=>{
    i = i.replace(/\r\n/g,'\n');
    i = i.split('\n\n');
    
    let top = i.shift();
    let moves = i.shift();
    let wofoot = top.split('\n');
    //console.log(wofoot);
    let posx = 0;
    let foot = wofoot.pop(); // discard positions
    posx = foot.split('').reduce((p,n)=>Math.max(p,n),0);
    
    let matrix = [];
    let dimensions = [0,posx]
    let block = new RegExp(/((?<space>[\s]{4,4})|\[(?<block>\w)\])|(?<lastspace>[\s]{3,4}\n)/,'g')
    wofoot.map((row,idx)=>{
      if(dimensions[0]===0) dimensions[0] = Math.floor(row.length/4);
      //row = row.replace('\n','');
      let matches = [...row.matchAll(block)];
      matrix[idx] = [];
      matches.forEach(match=>{
        let id= typeof match.index !== 0 ? Math.ceil(match.index/4) : 0;
        if(match.groups.block) {
          matrix[idx][id] = match.groups.block; 
        }
        else { 
          matrix[idx][id] = ' ';
        }
      })
      //console.log(matches);
        //console.log(row.split(block))
    })
    
    let movereg = new RegExp(/^move (?<howmany>[\d]{0,2}) from (?<from>[\d]) to (?<to>[\d])(\n|$)/,'g');
    let movearr = [];
    moves.split('\n').map((move,idz)=>{
     
      let movematch = [...move.matchAll(movereg)];
      movearr[idz] = [];
      movematch.forEach(match=>{
        //console.log(match);
        if(match && match.groups) {
          let {howmany,from,to} = match.groups;
          movearr[idz].push(parseInt(howmany),parseInt(from),parseInt(to));
        }
      })
    })
    //console.log("movereg?",movearr);
    /*let elves = i.map((item,idx)=>{
      let comma = item.split(/,/);
      let first = comma.shift().split(/-/).map(Number);
      let second = comma.shift().split(/-/).map(Number);
      return [first,second];
    })
    //console.log(elves.length)
    return elves;*/
    return {matrix,movearr,dimensions}
  };
  module.exports = day5;

