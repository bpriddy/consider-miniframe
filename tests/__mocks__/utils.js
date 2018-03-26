// utils mock
let stub
module.exports = {
	requireFoldersIntoObject(path) {
		path = path.split("/")
		path = path[path.length-1]
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
