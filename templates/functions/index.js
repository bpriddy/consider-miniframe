

const { DialogflowApp } = require('actions-on-google')
const functions = require('firebase-functions')

const utils = require('./lib/utils')
const config = require('./consider.json')

const actionsHandlers = utils.requireFoldersIntoObject('./actions')
const considerations = utils.requireFoldersIntoObject('./considerations')

const responses = require('./responses')


/**
*
*	Wrapper for app.ask that tracks previous responses so we can repeat them if needed
*
*/
const ask = (app, inputPrompt, noInputPrompts) => {
	app.data.prevInputPrompt = inputPrompt
	app.data.prevNoInputPrompts = noInputPrompts
	app.ask(inputPrompt, noInputPrompts)
}

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
	let action = result.action
	if(action in actionHandlers){
		let intent = result.metadata.intentName
		app.data.history.push({action, intent})
		actionHandlers[action](app, result, intent, ask, considerations, responses)
	}else{
		console.error('No action handler found for ' + action + ', query: ' + result.resolvedQuery)
	}
})


const initializeAppData = (app) => {
	console.log('Initialize app data')
	considerations.forEach( c => c.init(app) );
	app.data.history = [];
	app.data.initialized = true;
}

/**
*
*	same as above, but deploying these will yield a separate endpoint for different app versions
*
*/
exports.devhttps = exports.https
exports.stagehttps = exports.https