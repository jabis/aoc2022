const {PriorityQueue} = require('./../rf');
console.log(PriorityQueue);

const dijSE = (graph, start, end)=>{
  const distances = new Map();
  const previous = new Map();
  for (const [node,] of graph) {
    distances.set(node, Infinity);
    previous.set(node, null);
  }
  distances.set(start, 0);
  const nodes = new PriorityQueue();
  for (const [node,] of graph) {
    nodes.enqueue(node, distances.get(node));
  }
  while (!nodes.isEmpty()) {
    const current = nodes.dequeue();
    if (current === end) {
      break;
    }
    for (const [neighbor, flowRate] of graph.get(current)) {
      const distance = distances.get(current) + flowRate;
      if (distance < distances.get(neighbor)) {
        distances.set(neighbor, distance);
        previous.set(neighbor, current);
        nodes.enqueue(neighbor, distance);
      }
    }
  }
  const path = [];
  let node = end;
  while (node !== null) {
    path.unshift(node);
    node = previous.get(node);
  }

  return {path, max: distances.get(end)};
}
const dijOE = (graph, start) =>{
  const distances = new Map();
  const previous = new Map();
  for (const [node,] of graph) {
    distances.set(node, Infinity);
    previous.set(node, null);
  }
  distances.set(start, 0);
  const nodes = new PriorityQueue();
  for (const [node,] of graph) {
    nodes.enqueue(node, distances.get(node));
  }
  while (!nodes.isEmpty()) {
    const current = nodes.dequeue();
    for (const [neighbor, flowRate] of graph.get(current)) {
      const distance = distances.get(current) + flowRate;
      if (distance < distances.get(neighbor)) {
        distances.set(neighbor, distance);
        previous.set(neighbor, current);
        nodes.enqueue(neighbor, distance);
      }
    }
  }
  let maxFlowRate = 0;
  let end = start;
  for (const [node, flowRate] of distances) {
    if (flowRate > maxFlowRate) {
      maxFlowRate = flowRate;
      end = node;
    }
  }
  const path = [];
  let current = end;
  while (current !== start) {
    path.unshift(current);
    current = previous.get(current);
  }
  path.unshift(start);

  return {path, max: maxFlowRate};
}
const diJOE2 = (graph) => {
  const paths = [];

  // Iterate over all the nodes in the graph
  for (const start of graph.keys()) {
    // Initialize distances, previous, and visited for each start
    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
    for (const [node,] of graph) {
      distances.set(node, Infinity);
      previous.set(node, null);
    }
    distances.set(start, 0);

    // Run Dijkstra's algorithm
    let currentNode = start;
    while (currentNode !== null) {
      for (const [neighbor, flowRate] of graph.get(currentNode)) {
        const distance = distances.get(currentNode) + flowRate;
        if (distance < distances.get(neighbor)) {
          distances.set(neighbor, distance);
          previous.set(neighbor, currentNode);
        }
      }
      visited.add(currentNode);
      let minDistance = Infinity;
      let next = null;
      for (const [node, distance] of distances) {
        if (!visited.has(node) && distance < minDistance) {
          minDistance = distance;
          next = node;
        }
      }
      currentNode = next;
    }

    // Get the top 3 longest paths from the start node
    for (let i = 0; i < 3; i++) {
      let maxFlowRate = 0;
      let end = start;
      for (const [node, flowRate] of distances) {
        if (flowRate > maxFlowRate) {
          maxFlowRate = flowRate;
          end = node;
        }
      }
      const path = [];
      let current = end;
      while (current !== start) {
        path.unshift(current);
        current = previous.get(current);
      }
      path.unshift(start);
      paths.push({path, max: maxFlowRate});
      distances.set(end, 0);
    }
  }

  return paths;
}
const availableTime = 30; // minutes

const diJOE3 = (graph) => {
  const paths = [];

  // Iterate over all the nodes in the graph
  for (const start of graph.keys()) {
    // Initialize distances, previous, and visited for each start
    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
    for (const [node,] of graph) {
      distances.set(node, Infinity);
      previous.set(node, null);
    }
    distances.set(start, 0);

    // Run Dijkstra's algorithm
    let currentNode = start;
    while (currentNode !== null) {
      for (const [neighbor, time] of graph.get(currentNode)) {
        const distance = distances.get(currentNode) + time;
        if (distance < distances.get(neighbor)) {
          distances.set(neighbor, distance);
          previous.set(neighbor, currentNode);
        }
      }
      visited.add(currentNode);
      let minDistance = Infinity;
      let next = null;
      for (const [node, distance] of distances) {
        if (!visited.has(node) && distance < minDistance) {
          minDistance = distance;
          next = node;
        }
      }

      // Break out of the loop if the time taken to visit the next node exceeds the available time
      if (minDistance > availableTime) {
        break;
      }

      currentNode = next;
    }

    // Get the path with the highest flow rate that can be completed within the available time
    let maxFlowRate = 0;
    let end = start;
    for (const [node, flowRate] of distances) {
      if (flowRate > maxFlowRate && distances.get(node) <= availableTime) {
        maxFlowRate = flowRate;
        end = node;
      }
    }
    const path = [];
    let current = end;
    while (current !== start) {
      path.unshift(current);
      current = previous.get(current);
    }
    path.unshift(start);
    paths.push({path, max: maxFlowRate});
  }

  return paths;
}
//const availableTime = 30; // minutes

const diJOE4 = (graph) => {
  const paths = [];

  // Iterate over all the nodes in the graph
  for (const start of graph.keys()) {
    // Initialize distances and previous for each start
    const distances = new Map();
    const previous = new Map();
    for (const [node,] of graph) {
      distances.set(node, Infinity);
      previous.set(node, null);
    }
    distances.set(start, 0);

    // Run Dijkstra's algorithm
    let currentNode = start;
    while (currentNode !== null) {
      for (const [neighbor, time] of graph.get(currentNode)) {
        // Skip over neighbor nodes that have already been visited, unless the new path to the neighbor node has a higher flow rate than the previous path
        if (distances.get(neighbor) <= distances.get(currentNode) + time) {
          continue;
        }
        distances.set(neighbor, distances.get(currentNode) + time);
        previous.set(neighbor, currentNode);
      }
      let minDistance = Infinity;
      let next = null;
      for (const [node, distance] of distances) {
        if (distance < minDistance) {
          minDistance = distance;
          next = node;
        }
      }
      currentNode = next;
    }

    // Get the top 3 longest paths from the start node
    for (let i = 0; i < 3; i++) {
      let maxFlowRate = 0;
      let end = start;
      for (const [node, flowRate] of distances) {
        if (flowRate > maxFlowRate) {
          maxFlowRate = flowRate;
          end = node;
        }
      }
      const path = [];
      let current = end;
      while (current !== start) {
        path.unshift(current);
        current = previous.get(current);
      }
      path.unshift(start);
      paths.push({path, max: maxFlowRate});
      distances.set(end, 0);
    }
  }

  return paths;
}
const day16 = async (i) => {
    i = i.replace(/\r\n/g, '\n');
    i = i.split('\n');
    let lr = /Valve ([A-Z]{2,2}) has flow rate=([0-9]+)/,
    sr= /(.*)(?=[A-Z]{2,2})/;
    let valves = i.map((r,idx)=>{
      let ret = {};
      let p = r.split(';');
      let f = p.shift();
      let [,valve,flowrate] = lr.exec(f);
      ret.valve = valve;
      ret.idx = idx;
      ret.status = valve != 'AA' ? 'closed' : 'open';
      ret.exhausted = [];
      ret.visited = false;
      ret.rate = Number(flowrate);
      let s = p.shift();
      s = s.split(',');
      ret.paths = s.map(i=>{
        let m = i.match(sr);
        return m ? i.replace(m[1],'') : i;
      });
      return ret;
    })
    return {valves,dijOE,diJOE2,diJOE3,diJOE4};
  };
  module.exports = day16;