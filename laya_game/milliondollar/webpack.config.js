var entry = './laya_game/src/app.js';

module.exports = {
    entry: entry, //入口文件
    output: {
        path: __dirname + '/laya_game/bin/',
        filename: 'main.js' //出口文件
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    }
}
