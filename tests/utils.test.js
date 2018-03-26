const path = require('path')

const utils = require('../templates/functions/lib/utils')


beforeEach(() => { });

describe("functions utils", () => {
	test("it should require index files from folders within the provided path", () => {
		let _path = path.resolve(`${__dirname}/`, './__mocks__/considerations/')
		let test = utils.requireFoldersIntoObject(_path)
		expect(Object.keys(test).length).toBeGreaterThan(0)
		expect(typeof test[Object.keys(test)[0]]).toBe("object")
	})
})