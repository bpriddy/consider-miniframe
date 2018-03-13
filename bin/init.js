const path = require('path')
const ncp = require('ncp')
const fs = require('fs');
const chalk = require('chalk');
const { spawn } = require('child_process');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const utils = require('./utils');

module.exports = () => {
	console.log(chalk.green('\n\nConsider.js initializing functions webhook project'))
	console.log(chalk.green("=================================\n"))

	const source = path.resolve(__dirname, "../templates/functions/");
	const destination = path.resolve(process.cwd(),`functions/`);

	cloneDirectory(source, destination)
		.then(addProjectID)
		.then(addProjectTitle)
		.then(npmInstall)
		.then(() => {
			rl.close();
			console.log(
				chalk.green('Project successfully initialized!  Please consider running')+
				chalk.white(' consider sync ')+
				chalk.green('now to match your dev environment to Dialogflow.')
			)
		})
}

const cloneDirectory = (source, destination) => {
	return new Promise((resolve, reject) => {
		if (fs.existsSync(path.resolve(process.cwd(),`functions`))){ 
			return console.error(chalk.red(`!! Another functions folder already exists in this location. Please remove or change locations !!`))
		}
		fs.mkdirSync(path.resolve(process.cwd(),`functions`));
		ncp(source, destination, (err) => {
			if (err) return console.error(err);
			console.log(chalk.green('Project successfully scaffolded!\n\n'));
			resolve()
		});
	})
}

const addProjectID = () => {
	return new Promise((resolve, reject) => {
		const rootDir = utils.rootDirInRange();
		rl.question('Please enter your Google Actions Project ID: ', (pID) => {
			utils.openTemplateSave(`${rootDir}/.firebaserc`, {pID:pID});
			console.log(`your project ID: ${pID}`);
			resolve(pID);
		});
	})
}

const addProjectTitle = (pID) => {
	return new Promise((resolve, reject) => {
		const rootDir = utils.rootDirInRange();
		rl.question('Please choose a project slug: ', (projectslug) => {
			utils.openTemplateSave(`${rootDir}/package.json`, {projectslug:projectslug, pID: pID});
			console.log(`your project slug: ${projectslug}`);
			resolve();
		});
	})
}


const npmInstall = () => {
	return new Promise((resolve, reject) => {
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
		  resolve()
		});
	})
	
}