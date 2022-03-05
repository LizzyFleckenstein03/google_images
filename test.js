const {search} = require("./init.js")
const util = require("util")

search(process.argv.slice(2).join("+"))
	.then(obj => console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true})))
