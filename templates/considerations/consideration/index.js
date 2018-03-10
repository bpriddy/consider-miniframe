const data = require("./data.json")
const config = require("./config")
module.exports = {
	
	/** 
	*	user defined consideration-specific state object 
	*	to be persisted in the app.data object is to be 
	*	initialized here 
	*/
	init(app) {
		app.data.considerations.hints = {
			//add stateful data here
		}
	},

	/** called once per intent from actions including this consideration */
	update(app, result, intent, ask) {
		
	}

}