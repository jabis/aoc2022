const crs = require('fs').createReadStream;
let rf = async(i,enc="utf-8")=>{ return new Promise((r,b)=>{ let d = '', f = crs(i,enc); f.on('data',(c)=>{d+=c}); f.on('end',()=>{return r(d)}); f.on('error',b);}) }
module.exports = rf;