
const { DialogflowApp } = require('actions-on-google')
const functions = require('firebase-functions')

const utils = require('./lib/utils')
const config = require('./consider.json')

const actionHandlers = utils.requireFoldersIntoObject('./actions')
const considerations = utils.requireFoldersIntoObject('./considerations')

const responses = require('./responses')

/**
*
*	This is the entry point, called when Actions on Google posts to the webhook
*
*/
exports.https = functions.https.onRequest((request, response) => {
	let result = request.body.result
	let app = new DialogflowApp({ request, response })
	if(!app.data.intialized) initializeAppData(app);

	console.log('\n\n\n\n\n')
	console.log("==================================================")
	console.log(result.resolvedQuery, result.action, result.metadata.intentName)

	// map action strings to handlers
	let action = result.action.toLowerCase();
	if(action in actionHandlers){
		let intent = result.metadata.intentName
		actionHandlers[action](app, result, intent, considerations, responses)
	}else{
		actionHandlers.default(app, result, intent, considerations, responses)
	}
})

const initializeAppData = (app) => {
	console.log('Initialize app data')
	app.data.considerations = {};
	Object.keys(considerations).forEach( k => considerations[k].init(app) );
	app.data.initialized = true;
}

/**
*
*	same as above, but deploying these will yield a separate endpoint for different app versions
*
*/
exports.devhttps = exports.https
exports.stagehttps = exports.https