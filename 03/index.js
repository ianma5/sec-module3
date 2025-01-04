// "^0.0.0" | major.minor.patch | ^update minor/patches | ~update patches only | none hard coded version | * update everything all the time

const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));

console.log(uuid());

console.log();