const {
  PriorityQueue
} = require('./../rf');

class Monkey {
  constructor(name, job) {
    this.name = name;
    this.job = job;
    this.number = null;
  }
}

class MathOperation {
  constructor(operator, leftOperand, rightOperand) {
    this.operator = operator;
    this.leftOperand = leftOperand;
    this.rightOperand = rightOperand;
    return this;
  }
  evaluate() {
    switch (this.operator) {
      case '+':
        return this.leftOperand + this.rightOperand;
      case '-':
        return this.leftOperand - this.rightOperand;
      case '*':
        return this.leftOperand * this.rightOperand;
      case '/':
        return this.leftOperand / this.rightOperand;
      case '=':
        return this.leftOperand == this.rightOperand;
      default:
        throw new Error(`Invalid operator: ${this.operator}`);
    }
  }
}

const parseJob = (jobString)=>{
  const match = jobString.match(/^([\w]+) ([+|\-|\*|\/]+) ([\w]+)$/);
  if (match) {
    return new MathOperation(match[2], match[1], match[3]);
  } else {
    return Number(jobString);
  }
}

const solve = (jobs,rootName, part2 = false) =>{
  const monkeys = new Map();
  const queue = new PriorityQueue();

  for (const jobString in jobs) {
    let ps = jobs[jobString].split(': ')
    let nm = ps.shift();
    let js = ps.shift();
    let job = parseJob(js);
    if(part2) {
      if(nm=="humn") job = part2;
      if(nm=="root") job = new MathOperation("=",job.leftOperand,job.rightOperand);
    }
    let monkey = new Monkey(nm, job);
    monkeys.set(monkey.name, monkey);
    if(job instanceof MathOperation) queue.enqueue(monkey, 1);
    else queue.enqueue(monkey, 0);
  }
  let result = 0;
  while (!queue.isEmpty()) {
    const next = queue.dequeue();
    if (typeof next.job == "number") {
      next.number = next.job;
      monkeys.set(next.name,next);
    } else {
      let l= monkeys.get(next.job.leftOperand), r = monkeys.get(next.job.rightOperand)
      if(typeof l.job=="number" && typeof r.job =="number"){
        /*if(next.name==rootName){
          console.log("root", l.job,r.job, part2);
        }*/
        next.job.leftOperand = l.job,
        next.job.rightOperand = r.job;
        next.job = next.number = next.job.evaluate();
        monkeys.set(next.name,next);
      }
      else { 
        queue.enqueue(next,2);
      }
    }
  }
  const rootMonkey = monkeys.get(rootName);
  //console.log(rootMonkey);
  return rootMonkey.number;
}
const rootName = 'root';

const day21 = async (i) => {
  i = i.replace(/\r\n/g, '\n');
  i = i.split('\n');
  return {i,rootName,solve}
}
module.exports = day21;