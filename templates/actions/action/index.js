/** ${name}: action handler */

/**
*	Intents mapping to this action. This list is loose, 
*	updated by the sync method, and only used for reference
*/
const handledIntents = require('./intents.json')
const responses = require('../../responses')


module.exports = (app, result, intent, considerations) => {

	/** 
	*	Response query should look like the below
	*	-----------------------------------------
	*	let response = responses.find(app, {
	*		intent:intent,
	*		parameters:[{name:val}],
	*		considerations:[{name:val}]
	*	})
	*/
	let response = result.fulfillment.speech || 
				responses.find(app,{intent:intent}) ||
				'this is a default response for the default action.  Please hook up the correct response.';

	considerations.history.update(app,result,response)
	app.ask(response)
}