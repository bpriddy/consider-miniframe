const fs = require('fs')
const path = require('path')

module.exports = {

	requireFoldersIntoObject(_path) {
		const files = fs.readdirSync(_path);
		let output = {};
		const ignoreList = [ '.DS_Store', '.ignore' ]
		files.forEach((f) => {
			if(ignoreList.indexOf(f) > -1) return;
			output[f] = require(path.resolve(_path,`./${f}`));
		})

		return output
	},

}
