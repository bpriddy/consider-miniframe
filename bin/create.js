const path = require('path')
const ncp = require('ncp')
const fs = require('fs');
const chalk = require('chalk');

module.exports = (name) => {
	console.log(`create consideration: ${name}`)
	const source = path.resolve(__dirname, "../templates/considerations/consideration/");
	const destination = path.resolve(process.cwd(),`considerations/${name}`);

	if(!fs.existsSync(path.resolve(process.cwd(), "./consider.json"))) {
		return console.error(chalk.red(`!! The create method must be run from the root of the functions folder !!`))
	}

	if (fs.existsSync(destination)){ 
		return console.error(chalk.red(`!! Another consideration with the name:  ${name} already exists !!`))
	}

	fs.mkdirSync(destination);
	ncp(source, destination, function (err) {
		if (err) {
			return console.error(err);
		}
		console.log(chalk.green(`${name} consideration successfully scaffolded !!`));

	});
}