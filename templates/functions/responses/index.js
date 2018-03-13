const config = require('../consider.json')
module.exports = {
	find (app, query) {
		app.data._history[app.data._history.length-1].response = query;
		return false
		
		//TODO: accept parameters, and considerations to route response
		// this should be configurable to request responses from DB or json
	}
}