const day14 = async (i) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n')
  let xm = 0, xx = 0, ym=0,yx=0,xlen=0;
  i = i.map(r=>{
    r = r.split(' -> ');
    r = r.reduce((cd,c,ix)=>{
      if(!cd) cd = [];
      let [x,y] = c.split(',').map(Number);
      xlen++;
      xm = parseInt(xm===0 ? x : x<xm ? x : xm);
      xx = Math.max(x,xx);
      ym = parseInt(ym===0 ? y : y<ym?y:ym);
      yx= Math.max(y,yx);
      cd.push([x,y])
      return cd
    },[])
    return r;
  })
  return {rocks:i,xm,xx,ym,yx,xlen};
};
module.exports = day14;