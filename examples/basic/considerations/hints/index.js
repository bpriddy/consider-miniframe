const data = require("./data.json")
const config = require("./config")
module.exports = {
	
	init(app) {
		app.data.considerations.hints = {
			//add stateful data here
		}
	},

	update(app, result, intent, ask) {
		//this gets called when...
	}

}