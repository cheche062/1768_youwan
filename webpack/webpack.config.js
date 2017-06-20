module.exports = {
    entry: './entry.js', //入口文件
    output: {
        filename: 'bundle.js' //出口文件
    },
    // devtool: 'source-map', //直接每次都生成map调试文件
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
        }]
    }
}
