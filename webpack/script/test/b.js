const path = require('path');


// console.log(__dirname + '/dist')

console.log(path.resolve('src'))
console.log(path.resolve('./src'))
console.log(path.resolve(__dirname, 'src'))
console.log(path.resolve(__dirname, './src'))
