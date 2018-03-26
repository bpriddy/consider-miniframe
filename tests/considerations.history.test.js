let stubApp = {
	data: {
		considerations: {}
	}
}

let stubResult = {
	metadata: {
		intentName: "testIntent"
	},
	action: "testAction"
}

let stubResult2 = {
	metadata: {
		intentName: "secondIntent"
	},
	action: "secondAction"
}

let stubResponse = "this is a test response"
let stubResponse2 = "this the second test response"

describe("considerations history", () => {
	const history = require("../templates/functions/considerations/history")
	describe(".init", () => {
		test("it should initialize the history array within app.data.considerations", () => {
			history.init(stubApp)
			expect(stubApp.data.considerations.history).not.toBeNull()
		})
	})
	describe(".update", () => {
		test("it should push an object into history containing intent, action and respone", () => {
			history.update(stubApp,stubResult,stubResponse)
			history.update(stubApp,stubResult2,stubResponse2)
			let lastIDX = stubApp.data.considerations.history.length - 1
			expect(stubApp.data.considerations.history[lastIDX].intent).toBe(stubResult2.metadata.intentName)
			expect(stubApp.data.considerations.history[lastIDX].action).toBe(stubResult2.action.toLowerCase())
			expect(stubApp.data.considerations.history[lastIDX].response).toBe(stubResponse2)
		})
	})

	describe(".getLast", () => {
		test("it should return the last object from history", () => {
			history.update(stubApp,stubResult,stubResponse)
			history.update(stubApp,stubResult2,stubResponse2)
			let last = history.getLast(stubApp)
			expect(last.intent).toBe(stubResult2.metadata.intentName)
			expect(last.action).toBe(stubResult2.action.toLowerCase())
			expect(last.response).toBe(stubResponse2)
		})
	})
})