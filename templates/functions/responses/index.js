const config = require('../consider.json')

/**
*	NOTE: this import can be used to populate flat file data.  
*	The query logic can work as a dictionary look up by flattening 
*	the query to a key pattern
*/
const data = require('./data') 

module.exports = {
	find (app, query) {
		app.data._history[app.data._history.length-1].response = query;
		return false
		
		//TODO: accept parameters, and considerations to route response
		// this should be configurable to request responses from DB or json
	}
}