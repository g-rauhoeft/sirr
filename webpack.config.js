const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/Sirr.js',
    output: {
        path: __dirname,
        filename: 'sirr.js'
    }
};