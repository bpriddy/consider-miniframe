// DialogflowApp mock

module.exports = {
	DialogflowApp: class DialogflowApp {
		constructor(obj, data={}) {
			this.data = data
		}

		ask(message) {
			console.log('mock app ask')
			return jest.fn()
		}
	}
}