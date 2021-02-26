const path = require('path');
const CopyPlugin = require("copy-webpack-plugin")

let config = {
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    'css-loader',
                    {
                        loader: "sass-loader",
                        options: {
                            // Prefer `dart-sass`
                            implementation: require("node-sass"),
                        },
                    }
                ],
            }
        ],
    },
    entry:{
        popup:path.resolve(__dirname, 'src/popup.ts'),
        background:path.resolve(__dirname, 'src/background.ts')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname,"dist"),
    },
    resolve: {
        extensions: ['.ts', '.ts', '.js'],
    },
    // devtool: 'cheap-module-source-map',
    plugins: [
        new CopyPlugin({
            patterns:[
                {from:"src/index.html", to:path.resolve(__dirname,"dist","index.html")},
                {from:"src/manifest.json", to:path.resolve(__dirname,"dist","manifest.json")},
                {from:"assets/icon16.png", to:path.resolve(__dirname,"dist","icon16.png")},
                {from:"assets/icon32.png", to:path.resolve(__dirname,"dist","icon32.png")},
                {from:"assets/icon48.png", to:path.resolve(__dirname,"dist","icon48.png")},
                {from:"assets/icon128.png", to:path.resolve(__dirname,"dist","icon128.png")},
                {from:"assets/icon256.png", to:path.resolve(__dirname,"dist","icon256.png")}
            ]
        }),
    ]
};

module.exports=config