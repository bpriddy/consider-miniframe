
jest.mock('actions-on-google')
jest.mock('firebase-functions')
jest.mock('../templates/functions/lib/utils', () => require('./__mocks__/utils'))


console.log = jest.fn()

const stub = {
	"actions": {
		test: jest.fn(),
		default: jest.fn()
	},
	"considerations": {
		test: {
			init: jest.fn(),
			update: jest.fn()
		},
		test2: {
			init: jest.fn(),
			update: jest.fn()
		}
	}
}
let stubResponse

let stubRequest = {
	body: {
		result: {
			resolvedQuery: "resolved query",
			action: 'test',
			metadata: {
				intentName: 'testIntent'
			}
		}
	}
}


let app;
beforeEach(() => {
	require('firebase-functions')._setRequest(stubRequest)
	require('firebase-functions')._setResponse({})
	require('../templates/functions/lib/utils')._setStub(stub)
	app = require('../templates/functions/index.js')
})
afterEach(() => {
	jest.resetModules()
})

describe( "consider index", () => {
	describe( ".https", () => {
		test("should initialize each consideration if app.data.initialized is falsey", () => {
			expect(stub["considerations"].test.init).toHaveBeenCalled()
			expect(stub["considerations"].test2.init).toHaveBeenCalled()
		})
		test("should call the correct action in the actionHandlers object", () => {
			stubRequest.body.result.action = "dogs" //NOTE: this is an ugly way to change the value for the next test
			expect(stub["actions"].test).toBeCalled()
		})
		test("should call the default action if no action is matched in the actionHandlers", () => {
			expect(stub["actions"].default).toBeCalled()
		})
	})
})