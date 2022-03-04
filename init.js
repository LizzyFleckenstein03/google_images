const fetch = require("node-fetch");
const cheerio = require("cheerio");
const jsonic = require("jsonic");

/*
In case google makes minor changes, here are some snippets used to reverse engineer the format:


Find which script to use (use the query astolfo+images for this)
----------------------------------------------------------------

	.then(scripts => scripts.filter(script => script.children[0]?.data?.search("http") >= 0))
	.then(scripts => scripts.reduce((a, b, i) => b.children[0]?.data?.search("https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/622220/f4d2d4074167411a7e15b9a845cf18b434c02af3.jpg") >= 0 ? i : a), -1)

Reverse engineer data passed to AF_initDataCallback
---------------------------------------------------

const findStrings = (obj, path = "") => {
	let found = [];

	for (k in obj) {
		let v = obj[k];
		let t = typeof v;
		let p = path + "." + k

		
		if (t == "object")
			found = found.concat(findStrings(v, p));
		else if (t == "string")
			found.push([v, p]);		
	}

	return found;
};

	.then(findStrings)

Dump data
---------
	const util = require("util");

	.then(obj => util.inspect(obj, {showHidden: false, depth: 3, colors: true}))
	.then(console.log)
*/

const makeImage = elem => {
	return {
		url: elem[0],
		size: {
			width: elem[1],
			height: elem[2],
		}
	}
};

module.exports.search = (query, userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0") => {
	return fetch("https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(query), {headers: {"User-Agent": userAgent}})
		.then(res => res.text())
		.then(data => cheerio.load(data, null, false))
		.then(content => content("script"))
		.then(scripts => scripts.toArray())
		.then(scripts => scripts.map(script => script.children[0]?.data))
		.then(scripts => scripts.filter(script => script?.search("http") >= 0))
		.then(scripts => scripts[4])
		.then(script => script.slice("AF_initDataCallback(".length, script.length - ");".length))
		.then(jsonic)
		.then(data => data.data[31][0][12][2])
		.then(data => data.map(elem => elem[1]))
		.then(data => data.map(elem => new Object({
			preview: makeImage(elem[2]),
			image: makeImage(elem[3]),
			color: elem[6],
			link: elem[9][2003][2],
			title: elem[9][2003][3],
		})));
}
