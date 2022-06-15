const random = (arr = []) => {
	//console.log("random", arr);
	return Math.floor((Math.random() * arr.length) / 20);
};
export default random;
