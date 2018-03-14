const fs = require('fs')
const path = require('path')

module.exports = {

	requireFoldersIntoObject(relPath) {
		const files = fs.readdirSync(path.resolve(`${__dirname}/../`, relPath));
		let output = {};
		const ignoreList = [ '.DS_Store', '.ignore' ]
		files.forEach((f) => {
			if(ignoreList.indexOf(f) > -1) return;
			output[f] = require(path.resolve(`${__dirname}/../`, relPath,`./${f}`));
		})

		return output
	},

}
