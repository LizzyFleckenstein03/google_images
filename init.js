const fetch = require("node-fetch")
const cheerio = require("cheerio")
const jsonic = require("jsonic")

module.exports.search = (query, safeSearch = false, userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0") =>
	fetch("https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(query) + (safeSearch ? "&safe=active" : ""), {headers: {"User-Agent": userAgent}})
		.then(res => res.text())
		.then(data =>
			cheerio.load(data, null, false)                                               // parse HTML
				("script")                                                                // find script tags
				.toArray()                                                                // convert cheerio list to array
				.map(script => script.children[0]?.data)                                  // map script tags to their inline code
				.filter(script => script?.startsWith("AF_initDataCallback"))              // find script that contains init data
				.map(script => script.slice("AF_initDataCallback(".length, -");".length)) // remove call to init function
				.map(jsonic)                                                              // jsonic is used because JSON.parse() requires strict JSON and eval() allows remote code execution
				.find(data => data.key == "ds:1")                                         // for some reason there are two init datas, one is empty tho
				.data[31][0][12][2].map(elem => elem[1] && new Object({                   // map the parts of the init data we know/care about to something readable
					image: {
						url: elem[1][3][0],
						size: {
							width: elem[1][3][2],
							height: elem[1][3][1],
						},
					},
					preview: {
						url: elem[1][2][0],
						size: {
							width: elem[1][2][2],
							height: elem[1][2][1],
						},
					},
					color: elem[1][6],          // probably average color of the image (used as placeholder while loading the image)
					link: elem[1][9][2003][2],
					title: elem[1][9][2003][3], // there is some more data in elem[1][9] that could potentially be useful
				}))
				.filter(elem => elem)
		)

module.exports.searchRandom = (query, safeSearch, userAgent) => module.exports.search(query, safeSearch, userAgent)
	.then(results => results[Math.floor(Math.random() * results.length)])

/*

In case google makes changes, here are some snippets used to reverse engineer the format:

1. Find which script contains the init data (use the query astolfo+images for this)
-----------------------------------------------------------------------------------

	scripts.find(script => script.search("https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/622220/f4d2d4074167411a7e15b9a845cf18b434c02af3.jpg") >= 0)

2. Reverse engineer format of init data passed to AF_initDataCallback
---------------------------------------------------------------------

const findStrings = (obj, path = "") => {
	let found = []

	for (k in obj) {
		let v = obj[k]
		let t = typeof v
		let p = path + "." + k

		if (t == "object")
			found = found.concat(findStrings(v, p))
		else if (t == "string")
			found.push([v, p])
	}

	return found
}

	console.log(findStrings(initData))

*/
