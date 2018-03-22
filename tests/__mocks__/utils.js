// utils mock
let stub
module.exports = {
	requireFoldersIntoObject(path) {
		if(stub) {
			return stub[path]
		} else {
			return {
				test: jest.fn()
			}
		}
	},
	_setStub(_stub) {
		stub = _stub;
	}	
}
