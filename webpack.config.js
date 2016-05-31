/**
 * Created by Administrator on 2016/5/30 0030.
 */
var path=require('path');
var webpack=require('webpack');
/*
 extract-text-webpack-plugin�����
 �������Ϳ��Խ������ʽ��ȡ��������css�ļ��
 ������Ҳ���õ�����ʽ�ᱻ�����js�ļ����ˡ�
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/*
 html-webpack-plugin���������֮�أ�webpack������HTML�Ĳ����
 �������ȥ����鿴https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports={
    entry: { //��������ļ����м���д����
        index: './src/js/model/index.js',
        list: './src/js/model/list.js',
        about: './src/js/model/about.js'
    },
    output: {
        path: path.join(__dirname, 'dist'), //���Ŀ¼�����ã�ģ�塢��ʽ���ű���ͼƬ����Դ��·�����ö��������
        publicPath: '/dist/',               //ģ�塢��ʽ���ű���ͼƬ����Դ��Ӧ��server�ϵ�·��
        filename: 'js/[name].js',           //ÿ��ҳ���Ӧ����js����������
        chunkFilename: 'js/[id].chunk.js'   //chunk���ɵ�����
    },
    //�����
    plugins: [
        //�ṫ��js��common.js�ļ���
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        //����ʽͳһ������style.css��
        /* new ExtractTextPlugin("style.css", {
         allChunks: true,
         disable: false
         }),*/
        //ʹ��ProvidePlugin����ʹ��Ƶ�ʸߵ�ģ��
        new webpack.ProvidePlugin({
            $: "webpack-zepto"
        })
    ],
    module: {
        //����������
        loaders: [//�����������ڸ����������Ĳ������ã�����������֮��
            {
                test: /\.css$/,
                //����css�ĳ�ȡ������������'-loader'����ʡȥ
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                test: /\.less$/,
                //����less�ĳ�ȡ�������������м�!�б�Ҫ����һ�£�
                //���ݴ��ҵ����˳�����ε���less��css��������ǰһ��������Ǻ�һ��������
                //��Ҳ���Կ����Լ���loaderӴ���й�loader��д�������йȸ�֮��
                loader: ExtractTextPlugin.extract('css!less')
            }, {
                //htmlģ������������Դ������õľ�̬��Դ��Ĭ�����ò���attrs=img:src������ͼƬ��src���õ���Դ
                //���������ã�attrs=img:src img:data-src�Ϳ���һ������data-src���õ���Դ�ˣ�������������
                test: /\.html$/,
                loader: "html?attrs=img:src img:data-src"
            }, {
                //�ļ��������������ļ���̬��Դ
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            }, {
                //ͼƬ����������ͬfile-loader�����ʺ�ͼƬ�����Խ���С��ͼƬת��base64������http����
                //�������ã���С��8192byte��ͼƬת��base64��
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=./images/[hash].[ext]'
            },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            {test: /\.(tpl|ejs)$/, loader: 'ejs'},
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ //����jq
            avalon:'avalon'
           // $: 'jquery'

        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors', // ������ģ����ȡ��������Ϊ`vendors`��chunk
            chunks: ['index','list','about'], //��ȡ��Щģ�鹲�еĲ���
            minChunks: 3 // ��ȡ����3��ģ�鹲�еĲ���
        }),
        new ExtractTextPlugin('css/[name].css'), //����ʹ��link��ǩ����css������·���������output�����е�publickPath

        //HtmlWebpackPlugin��ģ��������ص����ã�ÿ������һ��ҳ������ã��м���д����
        new HtmlWebpackPlugin({ //����ģ�����css/js����������HTML
            favicon: './src/images/favicon.ico', //favicon·����ͨ��webpack����ͬʱ��������hashֵ
            filename: './view/index.html', //���ɵ�html���·���������path
            template: './src/view/index.html', //htmlģ��·��
            inject: 'body', //js�����λ�ã�true/'head'/'body'/false
            hash: true, //Ϊ��̬��Դ����hashֵ
            chunks: ['vendors', 'index'],//��Ҫ�����chunk�������þͻ���������ҳ�����Դ
            minify: { //ѹ��HTML�ļ�
                removeComments: true, //�Ƴ�HTML�е�ע��
                collapseWhitespace: false //ɾ���հ׷��뻻�з�
            }
        }),
        new HtmlWebpackPlugin({ //����ģ�����css/js����������HTML
            favicon: './src/images/favicon.ico', //favicon·����ͨ��webpack����ͬʱ��������hashֵ
            filename: './view/list.html', //���ɵ�html���·���������path
            template: './src/view/list.html', //htmlģ��·��
            inject: true, //js�����λ�ã�true/'head'/'body'/false
            hash: true, //Ϊ��̬��Դ����hashֵ
            chunks: ['vendors', 'list'],//��Ҫ�����chunk�������þͻ���������ҳ�����Դ
            minify: { //ѹ��HTML�ļ�
                removeComments: true, //�Ƴ�HTML�е�ע��
                collapseWhitespace: false //ɾ���հ׷��뻻�з�
            }
        }),
        new HtmlWebpackPlugin({ //����ģ�����css/js����������HTML
            favicon: './src/images/favicon.ico', //favicon·����ͨ��webpack����ͬʱ��������hashֵ
            filename: './view/about.html', //���ɵ�html���·���������path
            template: './src/view/about.html', //htmlģ��·��
            inject: true, //js�����λ�ã�true/'head'/'body'/false
            hash: true, //Ϊ��̬��Դ����hashֵ
            chunks: ['vendors', 'about'],//��Ҫ�����chunk�������þͻ���������ҳ�����Դ
            minify: { //ѹ��HTML�ļ�
                removeComments: true, //�Ƴ�HTML�е�ע��
                collapseWhitespace: false //ɾ���հ׷��뻻�з�
            }
        }),

        new webpack.HotModuleReplacementPlugin() //�ȼ���
    ],
  /*  //���������������
    resolve: {
        extensions: ['', '.js', '.json', '.less','.scss', '.ejs', '.png', '.jpg'],
        alias: {
            avalon:'./avalon/avalon',
            filter: path.join(__dirname, 'src/filters')
        }
    },*/
    //ʹ��webpack-dev-server����߿���Ч��
    devServer: {
        contentBase: './',
        host: 'localhost',
        port: 9090, //Ĭ��8080
        inline: true, //���Լ��js�仯
        hot: true //������
    }
}