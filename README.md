# free-google-images
Reverse Engineered Google Image Search API

The usage of this API does NOT require an API key, nor is it rate limited.

## Usage

Exports `search` function that takes query string as first argument, a boolean safeSearch as second and optionally user agent as second. Usage of the user agent argument has not been tested.
`search` returns an promise that resolves to an array with objects like this (should be self-explanatory):

```js
{
	preview: {
		url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpttHz6N94mnwy5NbULk733B3srNYPMsmaYQ&usqp=CAU',
		size: { width: 300, height: 168 }
	},
	image: {
		url: 'https://en.free-wallpapers.su/data/media/3/big/anm5679.jpg',
		size: { width: 1920, height: 1080 }
	},
	color: 'rgb(232,190,194)',
	link: 'https://en.free-wallpapers.su/img116919.htm',
	title: 'Astolfo. Desktop wallpaper. 1920x1080'
}
```

### Example

```js
const google_images = require("free-google-images");

google_images.search("astolfo+images").then(results => results.forEach(r => console.log(r.image.url)))
google_images.searchRandom("astolfo+images").then(result => console.log(result.image.url))

google_images.searchRandom("hentai", true).then(result => console.log(result.image.url)) // no results because of safe search
```

