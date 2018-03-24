const path = require('path');

// 打包成功的提示
const WebpackNotifierPlugin = require('webpack-notifier');
let plugins = [
    new WebpackNotifierPlugin()
];

module.exports = {
    entry: './entry.js',
    output: {
        filename: 'bundle.js', //出口文件
        path: __dirname + '/dist'
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 8088,
        inline: true
    },
    plugins: plugins,
    module: {
        loaders: [{
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }, {
                test: /\.js$/,  
                loader: 'babel-loader',
                // query: { presets: ['es2015'] },
                exclude: /node_modules/ //排除项目
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
}