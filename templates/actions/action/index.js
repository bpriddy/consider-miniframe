/** ${name}: action handler */

/**
*	Intents mapping to this action. This list is loose, 
*	updated by the sync method, and only used for reference
*/
const handledIntents = require('./intents.json')


module.exports = (app, result, intent, ask, considerations) => {
	//add code here
	ask(app, 'this is a default response for the ${name} action.  Please hook up the correct response.')
}