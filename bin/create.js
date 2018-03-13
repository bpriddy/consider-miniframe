const path = require('path')
const ncp = require('ncp')
const fs = require('fs');
const chalk = require('chalk');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const utils = require('./utils')

module.exports = (name) => {
	console.log(chalk.green(`create consideration: ${name}`))
	const source = path.resolve(__dirname, "../templates/considerations/consideration/");
	const rootDir = utils.rootDirInRange();
	const destination = `${rootDir}/considerations/${name}`;
	rl.close();

	if (fs.existsSync(destination)){ 
		return console.error(chalk.red(`!! Another consideration with the name:  ${name} already exists !!`))
	}

	fs.mkdirSync(destination);
	ncp(source, destination, function (err) {
		if (err) {
			return console.error(err);
		}
		utils.openTemplateSave(path.resolve(destination, './index.js'), {name:name});
		utils.openTemplateSave(path.resolve(destination, './config.js'), {name:name});
		utils.openTemplateSave(path.resolve(destination, './data.json'), {name:name});

		console.log(chalk.green(`${name} consideration successfully scaffolded !!`));
	});
}

