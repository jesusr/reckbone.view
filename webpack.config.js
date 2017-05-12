var webpack = require('webpack');
var packageJson = require('./package.json');
var path = require('path');
var BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
    entry: ['./example/app.js'],
    output: {
        filename: './build/dist/js/' + packageJson.name + '.js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: 'snwMapsWidget'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.js'],
        modules: [
            './src',
            'node_modules'
        ],
        alias: {
            modules: path.join(__dirname, 'node_modules'),
            underscore: path.join(__dirname, 'src/helpers/overscore.js')
        }
    },
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(packageJson.version),
            PACKAGE_NAME: JSON.stringify(packageJson.name)
        }),
        new BabiliPlugin({
            'presets': [
                ['babili', {}]
            ]
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'source-map-loader',
            enforce: 'pre'
        }, {
            test: /\.js$/,
            exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
            loader: 'babel-loader',
            options: {
                plugins: ['lodash'],
                presets: ['es2015']
            }
        }, {
            test: /\.hbs$/,
            exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
            loader: 'handlebars-template-loader'
        }, {
            test: /\.json$/,
            include: /(src\/data)/,
            exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
            loader: 'json-loader'
        }]
    },
    node: {
        fs: 'empty'
    }
};
