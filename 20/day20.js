const day20 = async (i) => {
	i = i.replace(/\r\n/g, '\n');
	i = i.split('\n').map(Number);
	return i;
};
module.exports = day20;