/** repeat: action handler */

/**
*	Intents mapping to this action. This list is loose, 
*	updated by the sync method, and only used for reference
*/
const handledIntents = require('./intents.json')
const responses = require('../../responses')


module.exports = (app, result, intent, considerations) => {
	//NOTE: no input followups must be recalculated, as they will not be persisted in history
	app.ask(considerations.history.getLast().response)
}