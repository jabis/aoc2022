const day11 = async (i) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n\n');
  let numre = /([^\d])/g

  monkeys = i.map(m=>{
    m = m.split('\n'); 
    let monkey = {};

    ["id","items","op","tst","iftrue","iffalse"].map((test,idx)=>{
      let val = m[idx].trim();
      
      switch(test){
        case "id":
        val = Number(val.replace(numre,''))
        break;
        case "items":
          let items = val.split(':')[1]
          val = items.split(', ').map(Number)
          monkey["worryLevel"]=Number(val[0]);
          break;
        case "op":
          let op = val.split(':')[1]
          op = op.replace(/new/g,"a").replace(/old/g,"b");
          let nf = `(a,b)=>{  ${op};  return a; }`
          //monkey["opfn"] = nf;
          let ofn = eval(nf);
          val = ofn;
        break;
        case "tst":
          let t = val.split(":")[1];
          let tf = `(line)=>{  return (line % ${t.replace('divisible by ','')} === 0) }`
          monkey["divby"] = Number(t.replace('divisible by ',''));
          let tfn = eval(tf)
          val = tfn;
        break;
          case "iftrue":
          case "iffalse":
          val = Number(val.replace(numre,''));
          break;
          default:
            val = val.split(':')[1].trim()
          break;
      }
      monkey[test] = val
    })

    return monkey; 
  })
  return monkeys;
};
module.exports = day11;