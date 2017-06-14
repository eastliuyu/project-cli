//核心webpack
const webpack = require('webpack');
//引入nodejs路径模块
const path = require('path');
//自动创建hmtl并添加相关js，css文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//从js中分离css文件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//清理重复文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
//拷贝文件
const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    // 这里应用程序开始执行
    // webpack 开始打包
    // string | object | array
    entry: {
        /**
         * 多页项目需要分别指定入口文件
         */
        index: './src/pages/index/index.js',
        home: './src/pages/home/home.js',
    },

    // webpack 如何输出结果的相关选项
    output: {
        filename: './js/[name].[hash:7].js',
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        path: path.resolve(__dirname, '../dist') // string
    },
    externals: {
        'jquery': 'window.jQuery',
    },
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        // 开启服务器的模块热替换(HMR)

        contentBase: path.resolve(__dirname, '../dist'),
        // 输出文件的路径

        publicPath: '/'
        // 和上文 output 的“publicPath”值保持一致
    },
    //插件
    plugins: [
        //从js中分离css文件
        new ExtractTextPlugin("css/[name].[hash:7].css"),
        new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html',
            //html模板文件
            template: 'src/index.html',
            //分别载入的js块
            chunks: ['vendor', 'index']
        }),
        //home入口
        new HtmlWebpackPlugin({
            title: 'home',
            filename: 'home.html',
            template: 'src/index.html',
            chunks: ['vendor', 'home']
        }),
        //匹配删除的文件
        new CleanWebpackPlugin(
            ['dist/js/*.js', 'dist/css/*.css'],
            {
                //根目录 process.cwd()表示当前工作目录
                root: process.cwd(),
                //开启在控制台输出信息
                verbose: true,
                //启用删除文件
                dry: false
            }
        ),
        //拷贝静态资源文件到static文件夹
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static',
                ignore: ['.*']
            }
        ])
    ],
    // 关于模块配置
    module: {
        // 模块规则（配置 loader、解析器等选项）
        rules: [
            {
                test: /\.css$/,
                /**
                 * loader 是专门处理某些模块的处理器。webpack 只能处理 js ，为了能够处理 CSS ，
                 * 就需要 css-loader；而为了能够在页面中插入 CSS ，还需要 style-loader。
                 */
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader?minimize&-autoprefixer', 'postcss-loader']
                })
            },
            /**
             * 处理图片路径
             */
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    //小于8k转base64(缺点：不能被缓存)
                    limit: 8192,
                    //设置发布目录
                    publicPath: '.',
                    //设置输出路径,相对于dist目录下的img文件夹
                    outputPath: './img/',
                    name: '[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory',
                exclude: /node_modules/
            }
        ]
    }
};