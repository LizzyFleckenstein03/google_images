const {search} = require("./init.js")
const util = require("util")

search("astolfo+images")
	.then(obj => console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true})))
