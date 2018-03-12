const fs = require('fs')
const request = require('request')
const path = require('path')
const template = require('es6-template-strings');
const chalk = require('chalk')
const utils = require('./utils');
const createAction = require('./action');

const accessToken = fs.readFileSync(path.resolve(__dirname, `../.access_token`), 'utf8')
const endpoint = 'https://api.dialogflow.com/v1/${type}/${id}?v=20150910';

let responses;

let syncObj = {
	intents:null,
	entities:null
};
let rootPath;
let ignoreList = [
	'.DS_Store'
]

module.exports = () => {
	
	rootPath = utils.rootDirInRange()
	if(!rootPath) console.error(chalk.red("This must be executed from next to the functions folder or within it !!"));
	responses = require(`${rootPath}/responses`)

	get('intents') // TODO: request each intent to get entities.  Presence of entities will necessitate multiple response variations.
		.then(getEach)
		.then(clean)
		.then(store)
		.then(()=>{return get('entities')}) //TODO: request each entity to get synonyms and use in combination with intent phrasing
		.then(getEach)
		.then(clean)
		.then(store)
		.then(getLocalActions)
		.then(matchRemoteActionsToLocal) // add new actions from dialogflow
		.then(addNewActions)
		.then(getLocalActions)
		.then(matchLocalActionsToRemote) // callout unused local actions
		.then(addIntentsRefToActions)
		.then(matchOrSuggestResponses)

}

const get = (type, id='')=> {
	console.log(chalk.yellow(`Retrieving: ${type}, ${id}`))
	let ep = template(endpoint, {type:type, id:id})
	return new Promise((resolve, reject) => {
		let opts = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			json: true,
		}
		request.get(ep, opts, 
			(err, res, body) => {
				if(err) return reject(err)
				// NOTE: if 'id' is defined only return the body
				let retObj = (id) ? body : {type:type,json:body} 
				if(body.status && body.status.code !== 200){
					reject(retObj)
				}else {
					resolve(retObj)
				}
			}
		)
	})
}

const getEach = (obj) => {
	return new Promise((resolve, reject) => {
		let reqPromises = obj.json.map(i => {
			return get(obj.type, i.id);
		})
		Promise.all(reqPromises)
			.then((_obj) => { resolve({ type: obj.type, json:_obj}) })
			.catch(e => console.error(e))
	})
}


const getEachEntity = (obj) => {
	return new Promise((resolve, reject) => {
		let entities = syncObj.intents.map( i => i.parameters )
		entities = entities.filter( e => e.length > 0 )
		let flat = []
		entities.forEach((p) => {
			p.forEach( (e) => {
				if(flat.indexOf(e.name) < 0) flat.push(e.name);
			})
		})
		resolve()
	})
}

const clean = (obj) => {
	console.log(chalk.yellow(`Cleaning: ${obj.type}`))
	return new Promise((resolve, reject) => {
		obj.json = obj.json.map( (i) => {
			if(obj.type === "intents") {
				let par = i.responses[0].parameters.map( p => p.name )
				return {
					name: i.name,
					action: i.responses[0].action,
					contexts: i.contexts,
					parameters: par
				}
			} else {
				return i
			}
			
		})
		resolve(obj)
	})
}

const store = (obj) => {
	return new Promise((resolve, reject) => {
		syncObj[obj.type] = obj.json
		resolve()
	})
}

const getLocalActions = () => {
	return new Promise((resolve, reject) => {
		let actions = fs.readdirSync(path.resolve(rootPath, "./actions"));
		actions = actions.filter( a => ignoreList.indexOf(a) < 0 )
		resolve(actions)
	})
}



const matchRemoteActionsToLocal = (localActions) => {
	console.log(chalk.yellow(`Compare remote actions to local`))
	return new Promise((resolve, reject) => {
		let newActions = []
		syncObj.intents.forEach( (i) => {
			let matched = false
			localActions.forEach( (a) => {
				if(a === i.action.toLowerCase()) {
					matched = true;
					//TODO: add intent key to intents.json of that action
				}
			})
			if(!matched) {
				newActions.push(i.action.toLowerCase())
			}
		})
		resolve(newActions)
	})
}

const addNewActions = (newActions) => {
	return new Promise((resolve, reject) => {
		let actionPromises = newActions.map(a => {
			return createAction(a);
		})
		Promise.all(actionPromises)
			.then(() => { resolve() })
			.catch(e => console.error(e))
	})
}

const matchLocalActionsToRemote = (localActions) => {
	console.log(chalk.yellow(`Compare local actions to remote`))
	return new Promise((resolve, reject) => {
		localActions.forEach( (a) => {
			let matched = false
			syncObj.intents.forEach( (i) => {
				if(a === i.action.toLowerCase()) {
					matched = true
				}
			})
			if(!matched) console.log(chalk.magenta(`${a} action is on local, but not on Dialogflow`));
		})
		resolve()
	})
}

const addIntentsRefToActions = () => {
	console.log(chalk.yellow(`Add intent refs to actions`))
	return new Promise((resolve, reject) => {
		syncObj.intents.forEach((i) => {
			let action = i.action.toLowerCase();
			let intentsJSON = fs.readFileSync(`${rootPath}/actions/${action}/intents.json`, 'utf8')
			intentsJSON = JSON.parse(intentsJSON)
			if(intentsJSON.indexOf(i.name) < 0) intentsJSON.push(i.name);
			fs.writeFileSync(`${rootPath}/actions/${action}/intents.json`, JSON.stringify(intentsJSON))	
			resolve()	
		})
	})
}

const matchOrSuggestResponses = () => {
	console.log(chalk.yellow(`Match or suggest responses`))
	let toCheck = []
	return new Promise((resolve, reject) => {
		syncObj.intents.forEach((int) => {
			toCheck.push(int.name)
			let options = []
			syncObj.entities.forEach( e => {
				if(int.parameters.indexOf(e.name) > -1) {
					if(e.entries.length > 1) {
						let values = e.entries.map( en => en.value )
						options.push(values)
					}
				}
			})
			let combinations = []

			const createCombos = (base, arr, idx) => {
				arr.forEach( name => {
					pattern = `${base}:${name}`
					combinations.push(pattern)
					for(var i=idx;i<options.length-1;i++) {
						createCombos(pattern,options[i+1], i+1)
					}
				})
			}

			options.forEach( (c, idx) => {
				createCombos(int.name, options[0], 0)
			})



			toCheck = toCheck.concat(combinations)


		})

		
		// if(!responses.find(int.name.toLowerCase())) {
		// 	notFound.push(int.name.toLowerCase());
		// }

		let notFound = toCheck.filter( ch => {
			if(!responses.find(ch)) return ch;
		})
		console.log("notFound",notFound)
		let outputText = JSON.stringify(notFound).split(",").join(",\n")
		fs.writeFileSync(`${rootPath}/responses/SUGGESTIONS_OF_RESPONSES_TO_ADD.json`, outputText)
	})
}










