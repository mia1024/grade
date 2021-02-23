const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


let config = {
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
    devtool: 'cheap-module-source-map',
    plugins:[
        new CopyPlugin({
            patterns:[
                {from:"src/popup.html", to:path.resolve(__dirname,"dist","popup.html")},
                {from:"src/manifest.json", to:path.resolve(__dirname,"dist","manifest.json")},
            ]
        })
    ]
};

popupConfig = {
    entry: path.resolve(__dirname, 'src/popup.ts'),
    output: {
        filename: 'popup.js',
        path: path.resolve(__dirname,"dist"),
    },
}

backgroundConifg = {
    entry: path.resolve(__dirname, 'src/background.ts'),
    output: {
        filename: 'background.js',
        path: path.resolve(__dirname,"dist"),
    },
}
let popup = Object.assign({},config, popupConfig);
let background = Object.assign({},config, backgroundConifg);

module.exports = [popup, background];