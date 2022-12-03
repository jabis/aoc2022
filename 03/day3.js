const day3 = async(i)=>{
    i = i.replace(/\r\n/g,'\n');
    i = i.split('\n')
    let elves = i.map(e=>e.split(''))
    return elves;
}
module.exports = day3;