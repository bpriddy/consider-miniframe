const path = require('path')
const ncp = require('ncp')
const fs = require('fs');
const chalk = require('chalk');

module.exports = () => {
	console.log(__dirname)
	console.log('init')
	const source = path.resolve(__dirname, "../templates/functions/");
	const destination = path.resolve(process.cwd(),`functions/`);
	if (fs.existsSync(path.resolve(process.cwd(),`functions`))){ 
		return console.error(chalk.red(`!! Another functions folder already exists in this location. Please remove or change locations !!`))
	}
	fs.mkdirSync(path.resolve(process.cwd(),`functions`));
	ncp(source, destination, function (err) {
		if (err) {
			return console.error(err);
		}
		console.log(chalk.green('Project successfully scaffolded!'));
	});
}