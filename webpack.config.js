//Webpack requires this to work with directories
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// This is main configuration object that tells Webpackw what to do. 
module.exports = {
    //path to entry paint
    entry: {
        'index': './src/index.ts',
        'amazon': './src/amazon.ts',
        'background': './src/background.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "public" },
                path.resolve(__dirname, "manifest.json"),
            ]
        })
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    mode: 'development'
}