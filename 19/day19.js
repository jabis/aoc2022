const day19 = async (i) => {
	i = i.replace(/\r\n/g, '\n');
	i = i.split('\n');
	let re = /Each (?<robotType>\w+) robot costs (?<cost>\d+) (?<costType>\w+)(?: and (?<additionalCost>\d+) (?<additionalCostType>\w+))?/

	let bps = {}
	i = i.map((r,ix) => {
		let pr = r.split(':');
		let id = Number(pr.shift().replace(/[^\d]/g,'').trim());
		//console.log(id);
		let rob = pr.shift().trim();
		let robos = rob.split('.');
		//console.log(robos);
		bps[`bp${id}`] = {}
		robos.map((robo,idx)=>{
			//robo = robo.trim();
			let match = re.exec(robo);
			//if(id<2)console.log("matched",robo,match);
			if(match) {
				//console.log(match)
				let {robotType,cost,costType,additionalCost,additionalCostType} = match.groups;
				bps[`bp${id}`][`robot${idx}`]= {robotType,cost,costType,additionalCost,additionalCostType}
			}
			return robo;
	  })
		return robos;
	});
	return bps;
};
module.exports = day19;