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
	rootDirInRange(){
		//** check if we are in or adjacent to the functions root
		if(fs.existsSync(path.resolve(process.cwd(), "./functions/consider.json"))) {
			return path.resolve(process.cwd(), "./functions/");
		} else if(fs.existsSync(path.resolve(process.cwd(), "./consider.json"))) {
			return path.resolve(process.cwd(), "./");
		} else {
			return console.error(chalk.red(`!! The create method must be run from the root of the functions folder !!`))
		}
	},
	openTemplateSave(file, obj) {
		let fileContents = fs.readFileSync(file, 'utf8');
		let templated = template(fileContents, obj);
		fs.writeFileSync(path.resolve(file), templated);
	}
}