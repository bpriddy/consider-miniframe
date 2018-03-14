/** voices: Consideration module  */

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
		app.data.considerations.voices = {
			//add stateful data here
		}
	},

	construct(text, option) {
		return `
			<voice gender="${config[option].gender}" variant="${config[option].variant}">
				<prosody rate="${config[option].rate}" pitch="${config[option].pitch}">${text}</prosody>
			</voice>`;
	},

	/** called once per intent from actions including this consideration */
	update(response, option) {
		return module.exports.construct(response, option);
	}

}