/** hints: Consideration module  */

/**
*	optional data file for if the consideration 
*	necessitates adding simple static text to a response.
*/
const data = require("./data.json")

/**
*	Any content data that is not textual 
*	or media url goes in config.
*/
const config = require("./config")

module.exports = {
	
	/** 
	*	user defined consideration-specific state object 
	*	persisted in the app.data object initialized here 
	*/
	init(app) {
		app.data.considerations.hints = {
			idx:0
		}
	},

	/** called once per intent from actions including this consideration */
	update(app, result, intent, ask) {
		let dHints = app.data.considerations.hints
		let hint = data[dHints.idx];
		dHints.idx = (dHints.idx<data.length-1) ? dHints.idx+1 : 0;
		return hint
	}

}