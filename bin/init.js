const path = require('path')
const ncp = require('ncp')
const fs = require('fs');
const chalk = require('chalk');
const { spawn } = require('child_process');
const readline = require('readline');
let rl
const utils = require('./utils');

let rootDir;

module.exports = () => {
	rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	console.log(chalk.green('\n\nConsider.js initializing functions webhook project'))
	console.log(chalk.green("=================================\n"))

	const source = path.resolve(__dirname, "../templates/functions/");
	const destination = path.resolve(process.cwd(),`functions/`);

	cloneDirectory(source, destination)
		.then(addProjectID)
		.then(addProjectTitle)
		.then(setAccessToken)
		.then(turnOnGitIgnore)
		.then(npmInstall)
		.then(() => {
			rl.close();
			console.log(
				chalk.green('Project successfully initialized!  Please run')+
				chalk.white(' considerjs sync ')+
				chalk.green('to match your local dev environment to Dialogflow.')
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
			rootDir = utils.rootDirInRange();
			resolve()
		});
	})
}

const addProjectID = () => {
	return new Promise((resolve, reject) => {
		const tryToGetID = () => {
			rl.question('Please enter your Google Actions Project ID: ', (pID) => {
				if(pID.length === 0) return tryToGetID();
				utils.openTemplateSave(`${rootDir}/.firebaserc`, {pID:pID});
				console.log(`your project ID: ${pID}`);
				resolve(pID);
			});
		}
		tryToGetID()
			
	})
}




const addProjectTitle = (pID) => {
	return new Promise((resolve, reject) => {
		const tryToGetSlug = () => {
			rl.question('Please choose a project slug: ', (projectslug) => {
				if(projectslug.length === 0) return tryToGetSlug();
				utils.openTemplateSave(`${rootDir}/package.json`, {projectslug:projectslug, pID: pID});
				console.log(`your project slug: ${projectslug}`);
				resolve();
			});
		}
		tryToGetSlug()
		
	})
}


const setAccessToken = () => {
	return new Promise((resolve, reject) => {
		const tryToGetAT = () => {
			rl.question('Please enter your Dialogflow Developer access token: ', (aT) => {
				if(aT.length === 0) return tryToGetAT();
				utils.openTemplateSave(`${rootDir}/.access_token`, {aT:aT});
				console.log(`your access token: ${aT}`);
				resolve();
			});
		}
		tryToGetAT()
			
	})
}

const turnOnGitIgnore = () => {
	return new Promise((resolve, reject) => {
		fs.renameSync(`${rootDir}/_.gitignore`, `${rootDir}/.gitignore`)
		resolve()	
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