
const { DialogflowApp } = require('actions-on-google')
const functions = require('firebase-functions')

const utils = require('./lib/utils')
const config = require('./consider.json')

const actionHandlers = utils.requireFoldersIntoObject('./actions')
const considerations = utils.requireFoldersIntoObject('./considerations')

const responses = require('./responses')


const initializeAppData = (app) => {
	console.log('Initialize app data')
	app.data.considerations = {};
	if(Object.keys(considerations).length) {
		Object.keys(considerations).forEach( k => considerations[k].init(app) );	
	}
	app.data.initialized = true;
}


/**
*
*	This is the entry point, called when Actions on Google posts to the webhook
*
*/
exports.https = functions.https.onRequest((request, response) => {
	let result = request.body.result
	let app = new DialogflowApp({ request, response })
	if(!app.data.initialized) initializeAppData(app);

	console.log('\n\n\n\n\n')
	console.log("==================================================")
	console.log(result.resolvedQuery, result.action, result.metadata.intentName)

	// map action strings to handlers
	let action = result.action.toLowerCase();
	let intent = result.metadata.intentName;
	if(action in actionHandlers){
		actionHandlers[action](app, result, intent, considerations, responses)
	}else{
		actionHandlers.default(app, result, intent, considerations, responses)
	}
})


/**
*
*	same as above, but deploying these will yield a separate endpoint for different app versions
*
*/
exports.devhttps = exports.https
exports.stagehttps = exports.https