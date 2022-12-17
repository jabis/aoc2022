const crs = require('fs').createReadStream;
const rf = async(i,enc="utf-8")=>{ return new Promise((r,b)=>{ let d = '', f = crs(i,enc); f.on('data',(c)=>{d+=c}); f.on('end',()=>{return r(d)}); f.on('error',b);}) }
class PriorityQueue {
  constructor() {
    this.elements = [];
  }
  enqueue(element, priority) {
    this.elements.push({element, priority});
    this.elements.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.elements.shift().element;
  }
  isEmpty() {
    return this.elements.length === 0;
  }
}

let funcs = ()=>{
    let splat =  (arr) =>{
      let o = [];
      for (let i in arr) o[i] = arr[i];
      return o;
    };
    let t = (i,r)=>{
      return r.test(i);
    };
    var contains = function(needle, arrhaystack) {
      return (arrhaystack.indexOf(needle) > -1);
    };
    let typeOf = (o)=>{
      return Object.prototype.toString
        .call(o).match(/(\w+)\]/)[1].toLowerCase();
    };

    let each = (arr, fn) => {
      for (let i in arr) fn(i, arr[i]);
    };

    let each_shift = (arr, fn) => {
      while (arr.length > 0) fn(arr.shift());
    };

    let clone = (o) => {
      if (typeOf(o) != 'object') return o;
      let c = {};
      for (let k in o) c[k] = clone(o[k]);
      return c;
    };
    let objFlat = (source, delimiter, filter) => {
      let result = {};
      (function flat(obj, stack) {
        Object.keys(obj).forEach(function (k) {
          let s = stack.concat([k])
          let v = obj[k]
          if (filter && filter(k, v)) return
          if (typeof v === 'object') flat(v, s)
          else result[s.join(delimiter)] = v
        })
      })(source, [])
      return result;
    }
    let fromPath = (obj, path="") => {
      let u;
      if(obj==u) return false;
      path = path.replace(/\[(\w+)\]/g, '.$1');
      path = path.replace(/^\./, '');
      let a = path.split('.');
      while (a.length) {
        let n = a.shift();
        if (obj && n in obj)
          obj = obj[n];
        else
          return;
      }
      return obj;
    };
    let toPath = function (obj, path, value) {
      if(typeOf(obj) == "undefined") obj = {}
      if(typeOf(path) == "string")
        path = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
      if (path.length > 1) {
        let p = path.shift();
        if (fromPath(obj, p) == null) {
          let r = /^\d$/;
          if (t(p, r) || (path.length > 0 && t(path[0], r))) {
            obj[p] = [];
          } else if (!t(p, r) && typeOf(obj[p]) != 'object') {
            obj[p] = {};
          }
        }
        toPath(obj[p], path, value);
      } else {
        let p = path.shift();
        let r = /^\d$/;
        if (t(p, r) || typeOf(obj[p]) == "array") {
          if (!obj[p] && typeOf(value) == "array") obj[p] = value;
          else if (!obj[p] && typeOf(value) == "string") obj[p] = [value];
          else obj[p] = value;
        } else {
          obj[p] = value;
        }
      }
    };
    let extend = function (a, b) {
      if (typeOf(a || b) == "object") {
        if (!a) a = {};
        for (let i in b) a[i] = extend(a[i], b[i]);
      } else a = a || b;
      return a;
    };
  
  return {
    contains,
    each,
    each_shift,
    splat,
    typeOf,
    clone,
    objFlat,
    extend,
    fromPath,
    toPath
  }
}
module.exports = {rf,funcs,PriorityQueue};