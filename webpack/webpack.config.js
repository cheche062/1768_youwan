module.exports = {
    entry: './entry.js',
    output: {
        filename: 'bundle.js', //出口文件
        path: __dirname + '/dist'
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 8080,
        inline: true
    },
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