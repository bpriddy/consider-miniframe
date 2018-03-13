const fs = require('fs')
const path = require('path')

module.exports = {

	requireFoldersIntoObject(relPath) {
		const files = fs.readdirSync(path.resolve(process.cwd(), relPath));
		let output = {};
		const ignoreList = [ '.DS_Store', '.ignore' ]
		files.forEach((f) => {
			if(ignoreList.indexOf(f) > -1) return;
			output[f] = require(path.resolve(process.cwd(), relPath,`./${f}`));
		})

		return output
	},

}
