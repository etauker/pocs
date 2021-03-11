const path = require('path');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const currentYear = new Date().getFullYear();


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
    },
    plugins: [
        new MomentLocalesPlugin(),
        new MomentTimezoneDataPlugin({
            startYear: currentYear - 2,
            endYear: currentYear,
        }),
    ]
}