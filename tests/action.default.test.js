jest.mock("../templates/functions/responses", () => {
	return {
		find: jest.fn((app, obj) => {
			let stubData = {
				testIntent: "this is text from the responses method" 
			}
			return stubData[obj.intent]
		})
	}
})
const mockApp = {
	ask: jest.fn()
}

const mockConsiderations = {
	history: {
		update: jest.fn()
	}
}
let stubResult

beforeEach(() => {
	stubResult = {
		fulfillment: {
			speech: "this is text manually entered into dialogflow."
		}
	}
})

const defaultAction = require('../templates/functions/actions/default')

describe("consider default action", () => {
	test("it should use the fulfillment speech if present in the result", () => {
		defaultAction(mockApp, stubResult, "intentName", mockConsiderations)
		expect(mockApp.ask).toBeCalledWith(stubResult.fulfillment.speech)
	})
	test("it should use the responses intent if present in the result", () => {
		stubResult.fulfillment.speech = ""
		defaultAction(mockApp, stubResult, "testIntent", mockConsiderations)
		expect(mockApp.ask).toBeCalledWith("this is text from the responses method" )
	})
	test("it should use the default placekeeper response if no other responses found", () => {
		stubResult.fulfillment.speech = ""
		defaultAction(mockApp, stubResult, "anotherIntent", mockConsiderations)
		expect(mockApp.ask).toBeCalledWith( 'this is a default response for the default action.  Please hook up the correct response.' )
	})

	test("it should push the current response to history", () => {
		defaultAction(mockApp, stubResult, "intentName", mockConsiderations)
		expect(mockConsiderations.history.update).toBeCalledWith(mockApp, stubResult, stubResult.fulfillment.speech)
	})
})