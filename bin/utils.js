/**
*
*
*	Utils
*
*/
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const template = require('es6-template-strings');



module.exports = {
	ifFileInRangeRetDir(filename, range){
		//** check if we are in range of a root file to establish root directory.  fs functions can appropriately be run from that location */
		const ignoreList = [
			'bin',
			'node_modules',
			'.git',
			'templates'
		]
		let pcwd = process.cwd()
		if(!filename) return console.error(chalk.red('you must provide a filename'));
		if(!range) return console.error(chalk.red('you must provide a range'));
		let matchedDir = null;
		function recurseScanDir(dir, level) {
			let contents = fs.readdirSync(dir);
			let dirs = contents.filter( (c) => {
				let stats = fs.statSync(path.resolve(dir, c));
				return (
					ignoreList.indexOf(c) < 0 &&
					stats.isDirectory()
				)
			})
			if(contents.indexOf(filename) > -1) {
				matchedDir = dir
			} else {
				if(level < range) {
					level++
					dirs.forEach((d) => {
						recurseScanDir(path.resolve(dir, d), level)
					})
					recurseScanDir(path.resolve(dir, "../"), level)
				}
			}
		}
		recurseScanDir(pcwd, 0)
		return matchedDir;

	},
	openTemplateSave(file, obj) {
		let fileContents = fs.readFileSync(file, 'utf8');
		let templated = template(fileContents, obj);
		fs.writeFileSync(path.resolve(file), templated);
	}
}