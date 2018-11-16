const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/Sirr.js',
    output: {
        path: __dirname,
        filename: 'sirr.js'
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    externals: {
        lodash: 'lodash',
        rxjs: 'rxjs'
    }
};