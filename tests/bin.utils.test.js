const utils = require('../bin/utils')

test('2 squared to equal 4', () => {
  expect(utils.square(2)).toBe(4);
});