// Node runs on server, not browser
// Global object instead of window object

//console.log("Hello World!")
//console.log(global);

// common core modules (not in vanilla JS)
// commonJS modules instead of es6 modules
// Misses some JS apis such as fetch

const os = require('os');
const path = require('path');
const { add, subtract, multiply, divide} = require('./math');

/*console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log(__dirname);
console.log(__filename);

console.log(path.dirname(__filename));
console.log(path.basename(__filename));
console.log(path.extname(__filename));

console.log(path.parse(__filename)); */

console.log(add(2,4));
console.log(subtract(2,4));
console.log(multiply(2,4));
console.log(divide(2,4));