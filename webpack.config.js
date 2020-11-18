const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        // when have >1 entry points do not duplicate libraries if we import this in different entry points
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        // minify css and js in production
        config.minimizer = [new TerserPlugin(), new OptimizeCssAssetsPlugin()]
    }

    return config;
}

const fileName = ext => isProd ? `[name].[hash].${ext}` : `[name].${ext}`;

module.exports = {
    // default mode
    mode: 'development',
    entry: ['@babel/polyfill', './src/index.jsx'],
    output: {
        filename: fileName('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        // default extensions when not specified in the import
        extensions: ['.js', '.jsx', '.png'],
        alias: {
            // type @ to go to src dir
            '@': path.resolve(__dirname, 'src')
        }
    },
    devServer: {
        open: true,
        port: 3000,
        hot: isDev,
        // show errors on screen
        overlay: true
    },
    devtool: isDev ? 'source-map' : '',
    optimization: optimization(),
    plugins: [
        // to put index.html in dist and automatic connection of the necessary scripts
        new HTMLWebpackPlugin({
            // to get content from index.html also
            template: './index.html',
            // minify index.html in production
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        // to clear dist before next bundling
        new CleanWebpackPlugin(),
        // this plugin extracts CSS into separate files
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpg|png|svg|jpeg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    }
}