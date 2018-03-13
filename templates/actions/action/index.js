/** ${name}: action handler */

/**
*	Intents mapping to this action. This list is loose, 
*	updated by the sync method, and only used for reference
*/
const handledIntents = require('./intents.json')
const responses = require('../../responses')


module.exports = (app, result, intent, ask, considerations) => {

	/** 
	*	Response query should look like the below
	*	-----------------------------------------
	*	let response = responses(app, {
	*		intent:intent,
	*		parameters:[{name:val}],
	*		considerations:[{name:val}]
	*	})
	*/
	let response = responses(app,{intent:intent})
	response = 'this is a default response for the ${name} action.  Please hook up the correct response.';
	ask(app, response)
}