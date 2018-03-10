const fs = require('fs')
const path = require('path')

const ignoreList = [
	"index.js",
	".DS_Store"
]

const files = fs.readdirSync(path.resolve(__dirname, './'));
let output = {};
files.forEach((f) => {
	if(ignoreList.indexOf(f) > -1) return;
	f = f.split(".")[0]
	output[f] = require(`./${f}`);
})

module.exports = output