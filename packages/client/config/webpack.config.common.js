'use strict';

const VueLoaderPlugin       = require('vue-loader/lib/plugin');
const HtmlPlugin            = require('html-webpack-plugin');
const MiniCSSExtractPlugin  = require('mini-css-extract-plugin');
const ObsoleteWebpackPlugin = require('obsolete-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const helpers               = require('./helpers');
const isDev                 = process.env.NODE_ENV === 'development';

const webpackConfig = {
    entry: {
        polyfill: '@babel/polyfill',
        main: helpers.root('src', 'main'),
    },
    resolve: {
        extensions: [ '.js', '.vue' ],
        alias: {
            'vue$': isDev ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.min.js',
            '@': helpers.root('src'),
            'createjs': isDev ? 'createjs/builds/1.0.0/createjs.js' : 'createjs/builds/1.0.0/createjs.min.js',
            'soundjs': isDev ? 'soundjs/lib/soundjs.js' : 'soundjs/lib/soundjs.min.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [ helpers.root('src') ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    helpers.root('src'),
                    helpers.root('node_modules/vuex-persist')
                ]
            },
            {
                test: /\.css$/,
                use: [
                    isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                ]
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDev,
                            implementation: require('sass'),
                            fiber: require('fibers')
                        }
                    }
                ]
            },
            {
                test: /node_modules[/\\]createjs/,
                loaders: [
                    'imports-loader?this=>window',
                    'exports-loader?window.createjs'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlPlugin({ template: 'index.html', chunksSortMode: 'dependency' }),
        new ObsoleteWebpackPlugin({
            name: 'obsolete',
            template: '<h2>Your browser is not supported</h2><p>Please use a modern browser to conduct this task. For example, you can use a recent version of Chrome or Firefox.</p>',
            promptOnUnknownBrowser: true,
            promptOnNonTargetBrowser: true
        }),
        new ScriptExtHtmlWebpackPlugin({
            async: 'obsolete'
        })
    ]
};

module.exports = webpackConfig;
