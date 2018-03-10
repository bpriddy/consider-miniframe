const path = require('path')
const ncp = require('ncp')
const fs = require('fs');
const chalk = require('chalk');
const utils = require('./utils');

module.exports = (name) => {
	console.log(`create action: ${name}`)
	const source = path.resolve(__dirname, "../templates/actions/action/");
	const rootDir = utils.rootDirInRange();
	const destination = `${rootDir}/actions/${name}`;

	if (fs.existsSync(destination)){ 
		return console.error(chalk.red(`!! Another consideration with the name:  ${name} already exists !!`))
	}

	fs.mkdirSync(destination);
	ncp(source, destination, function (err) {
		if (err) {
			return console.error(err);
		}
		utils.openTemplateSave(path.resolve(destination, './index.js'), {name:name});
		utils.openTemplateSave(path.resolve(destination, './intents.json'), {name:name});

		console.log(chalk.green(`${name} action successfully scaffolded !!`));

	});
}
