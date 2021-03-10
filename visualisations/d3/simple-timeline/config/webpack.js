const path = require('path');

module.exports = {
    context: __dirname,
    entry: '../src/index.ts',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'bundle.js',
        libraryTarget: 'umd',
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader'
            }
        }]
    },
    resolve: {
        extensions: ['.ts']
    }
}