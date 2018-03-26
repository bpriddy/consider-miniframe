jest.mock('fs');

console.error = jest.fn(err => {
	throw new Error(err);
});

beforeEach(() => {
	const MOCK_FILE_INFO = {
		'/path/anotherfile.json': '<>',
		'/path/targetfile.json': 'here',
		'/path/to': [],
		'/path/to/file1.js': 'console.log("file1 contents");',
		'/path/to/file2.txt': 'file2 contents',
		'/path/to/another': [],
		'/path/to/another/weirdfile.json': 'here2'
	};
	// Set up some mocked out file info before each test
	process.cwd = jest.fn( () => "/path/to" )
	require('fs').__setMockFiles(MOCK_FILE_INFO);
});
// afterEach(() => mock.restore());

describe('bin utils', () => {
	const utils = require('../bin/utils')
	
	describe('.ifFileInRangeRetDir', () => {
		test('if no filename is passed throws error', () => {
			expect(() => utils.ifFileInRangeRetDir()).toThrowError();
		})
		test('if no range integer is passed throws error', () => {
			expect(() => utils.ifFileInRangeRetDir()).toThrowError();
		})
		test('if file is not found within range returns null', () => {
			expect(() => {
				utils.ifFileInRangeRetDir('notarealfilename.json', 1).toBeNull()
			})
		})
		test('if file is found within range returns directory path', () => {
			expect(() => {
				utils.ifFileInRangeRetDir('anotherfile.json', 1).toBe('/path')
			})
		})
	})
})

