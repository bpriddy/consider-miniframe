/** ${name}: Consideration module  */

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
		app.data.considerations.${name} = {
			//add stateful data here
		}
	},

	/** called once per intent from actions including this consideration */
	update(app, result, intent) {
		
	}

}