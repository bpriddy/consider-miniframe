const path = require('path')
const ncp = require('ncp')
const fs = require('fs');
const chalk = require('chalk');
const { spawn } = require('child_process');

module.exports = () => {
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
		console.log(chalk.yellow('Now installing dependencies...\n\n\n'));
		const install =  spawn('npm', ['--prefix', './functions', 'install', './functions'])
		install.stdout.on('data', (data) => {
		  console.log(`stdout: ${data}`);
		});

		install.stderr.on('data', (data) => {
		  console.log(`stderr: ${data}`);
		});

		install.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		});
	});
}