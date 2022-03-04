const util = require("util");
const {search} = require("./init.js");

search("astolfo+images")
	.then(obj => util.inspect(obj, {showHidden: false, depth: null, colors: true}))
	.then(console.log)
