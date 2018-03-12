const fs = require('fs')
const request = require('request')
const path = require('path')
const template = require('es6-template-strings');
const utils = require('./utils');
const createAction = require('./action');

const accessToken = fs.readFileSync(path.resolve(__dirname, `../.access_token`), 'utf8')
const endpoint = 'https://api.dialogflow.com/v1/${type}?v=20150910'

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
	if(!rootPath) console.error(chalk.red("This must be executed from next to the functions folder or within it !!"))
	get('intents') // TODO: request each intent to get entities.  Presence of entities will necessitate multiple response variations.
		.then(clean)
		.then(store)
		.then(()=>{return get('entities')}) //TODO: request each entity to get synonyms and use in combination with intent phrasing
		.then(clean)
		.then(store)
		.then(getLocalActions)
		.then(matchRemoteActionsToLocal) // add new actions from dialogflow
		.then(addNewActions)
		.then(matchLocalActionsToRemote) // callout unused local actions
}

const get = (type)=> {
	let ep = template(endpoint, {type:type})
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
				if(body.status && body.status.code !== 200){
					reject({type:type,json:body})
				}else {
					resolve({type:type,json:body})
				}
			}
		)
	})
}

const clean = (obj) => {
	return new Promise((resolve, reject) => {
		obj.json = obj.json.map( (i) => {
			if(obj.type === "intent") {
				return {
					name:i.name, 
					actions: i.actions
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
	return new Promise((resolve, reject) => {
		let newActions = []
		syncObj.intents.forEach( (i) => {
			let matched = false
			localActions.forEach( (a) => {
				if(a === i.actions[0].toLowerCase()) {
					matched = true;
					//TODO: add intent key to intents.json of that action
				}
			})
			if(!matched) {
				newActions.push(i.actions[0].toLowerCase())
			}
		})
		resolve(newActions)
	})
}

const addNewActions = (newActions) => {
	return new Promise((resolve, reject) => {
		newActions.forEach((a) => {
			createAction(a)
		})
	})
}

const matchLocalActionsToRemote = () => {
	return new Promise((resolve, reject) => {

	})
}










