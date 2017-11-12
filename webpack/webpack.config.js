module.exports = {
    entry: './entry.js',
    output: {
        filename: 'bundle.js', //出口文件
        path: __dirname + '/dist'
    },
    devtool: 'source-map',
    devServer: {
        port: 8088,
        inline: true
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/ //排除项目
        }]
    }
}
