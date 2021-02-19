const path = require('path');
const ExtensionReloader  = require('webpack-extension-reloader');

let config = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.ts', '.js'],
    },

};

popupConfig = {
    entry: path.resolve(__dirname, 'src/popup.ts'),
    output: {
        filename: 'popup.js',
        path: path.resolve(__dirname),
    },
}

backgroundConifg = {
    entry: path.resolve(__dirname, 'src/background.ts'),
    output: {
        filename: 'background.js',
        path: path.resolve(__dirname),
    },
}
let popup = Object.assign({},config, popupConfig);
let background = Object.assign({},config, backgroundConifg);

module.exports = [popup, background];