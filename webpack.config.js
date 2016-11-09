var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + '/client/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue',
            },
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'client/index.html'
        })
    ],
    vue: {
        loaders: {
            js: 'babel?presets[]=es2015'
        }
    }
}
