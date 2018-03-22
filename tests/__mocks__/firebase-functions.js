// firebase-functions mock

let stubRequest = {}
let stubResponse = {}

module.exports = {
	https: {
		onRequest: (cb) => {
			cb(stubRequest,stubResponse)
		}
	},
	_setRequest(obj) {
		stubRequest = obj
	},
	_setResponse(obj) {
		stubResponse = obj
	}
}