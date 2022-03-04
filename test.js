const {search} = require("./init.js")
const util = require("util")

search("astolfo+images")
	.then(obj => util.inspect(obj, {showHidden: false, depth: null, colors: true}))
	.then(console.log)
