
const utils = require('./utils')

const dir = utils.ifFileInRangeRetDir('consider.json', 2);
console.log(dir)