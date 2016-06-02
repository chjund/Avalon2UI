/**
 * Created by Administrator on 2016/5/30 0030.
 */
var path=require('path');
var glob=require('glob')
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

//�ṫ��js
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.NODE_ENV !== 'production';

var entries = getEntry('src/js/model/**/*.js', 'src/js/model/');
var chunks = Object.keys(entries);

var config={
   /* entry: { //��������ļ����м���д����
        index: './src/js/model/index.js',
        list: './src/js/model/list.js',
        about: './src/js/model/about.js'
    },*/
    entry:entries,
    output: {
        path: path.join(__dirname, 'dist'), //���Ŀ¼�����ã�ģ�塢��ʽ���ű���ͼƬ����Դ��·�����ö��������
        publicPath: '/dist/',               //ģ�塢��ʽ���ű���ͼƬ����Դ��Ӧ��server�ϵ�·��
        filename: 'js/[name].js',           //ÿ��ҳ���Ӧ����js����������
        chunkFilename: 'js/[id].chunk.js?[chunkhash]'   //chunk���ɵ�����
    },

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
                loader: "html?-minimize"    //����ѹ��html,https://github.com/webpack/html-loader/issues/50
                //loader: "html?attrs=img:src img:data-src"
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
           // { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
           // {test: /\.(tpl|ejs)$/, loader: 'ejs'},
        ]
    },
    //���
    plugins: [
        //ʹ��ProvidePlugin����ʹ��Ƶ�ʸߵ�ģ��
        new webpack.ProvidePlugin({ //����jq
            avalon:'avalon2'
           // $: 'jquery'
        }),

        //�ṫ��js��common.js�ļ���
        // new webpack.optimize.CommonsChunkPlugin('common.js'),
        /* new webpack.optimize.CommonsChunkPlugin({
         name: 'vendors', // ������ģ����ȡ��������Ϊ`vendors`��chunk
         chunks: ['index','list','about'], //��ȡ��Щģ�鹲�еĲ���
         minChunks: 3 // ��ȡ����3��ģ�鹲�еĲ���
         }),*/

        new CommonsChunkPlugin({
            name: 'vendors', // ������ģ����ȡ��������Ϊ`vendors`��chunk
            chunks: chunks,
            minChunks: chunks.length // ��ȡ����entry��ͬ������ģ��
        }),

        //����ʽͳһ������.css�ļ���
        //����ʽͳһ������style.css��
        /* new ExtractTextPlugin("style.css", {
         allChunks: true,
         disable: false
         }),*/
        new ExtractTextPlugin('css/[name].css'), //����ʹ��link��ǩ����css������·���������output�����е�publickPath

        //HtmlWebpackPlugin��ģ��������ص����ã�ÿ������һ��ҳ������ã��м���д����
      /*  new HtmlWebpackPlugin({ //����ģ�����css/js����������HTML
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
        */
        debug ? function() {} : new UglifyJsPlugin({ //ѹ������
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require','avalon'] //�ų��ؼ���
        }),


      // new webpack.HotModuleReplacementPlugin() //�ȼ���
    ]
  /*  //���������������
    resolve: {
        extensions: ['', '.js', '.json', '.less','.scss', '.ejs', '.png', '.jpg'],
        alias: {
            avalon:'./avalon/avalon',
            filter: path.join(__dirname, 'src/filters')
        }
    },*/
    //ʹ��webpack-dev-server����߿���Ч��
   /* ,devServer: {
        contentBase: './',
        host: 'localhost',
        port: 9090, //Ĭ��8080
        inline: true, //���Լ��js�仯
        hot: true //������
    }*/
}

var pages = Object.keys(getEntry('src/view/**/*.html', 'src/view/'));
pages.forEach(function(pathname){
    console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDpathname0:'+pathname);
    var conf={
        filename: './view/' + pathname + '.html', //���ɵ�html���·���������path
        template: './src/view/' + pathname + '.html', //htmlģ��·�� ��Ե�·��
        inject: 'body'  //js�����λ�ã�true/'head'/'body'/false
        /*
         * ѹ����飬������html-minify���ᵼ��ѹ��ʱ��ĺܶ�html�﷨������⣬
         * ����html��ǩ������ʹ��{{...}}���ʽ�����Ժܶ�����²�����Ҫ�ڴ�����ѹ���
         * ���⣬UglifyJsPlugin����ѹ�������ʱ����ͬhtmlһ��ѹ����
         * Ϊ����ѹ��html����Ҫ��html-loader������'html?-minimize'����loaders��html-loader�����á�
         */
        // minify: { //ѹ��HTML�ļ�
        //  removeComments: true, //�Ƴ�HTML�е�ע��
        //  collapseWhitespace: false //ɾ���հ׷��뻻�з�
        // }
        /*  new HtmlWebpackPlugin({ //����ģ�����css/js����������HTML
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
         */

    }
    if(pathname in config.entry){
        conf.favicon = 'src/images/favicon.ico';
        conf.inject = 'body';
        conf.chunks = ['vendors', pathname];
        conf.hash = true;
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports=config;

function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;
    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-entry:'+entry);
        dirname = path.dirname(entry);
        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-dirname:'+dirname);
        extname = path.extname(entry);
        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-extname:'+extname);
        basename = path.basename(entry, extname);
        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-basename:'+basename);
        pathname = path.join(dirname, basename);
        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-pathname1:'+pathname);
        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-pathDir:'+pathDir);
        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-pathDir01:'+pathname.replace(new RegExp('^' + pathDir), ''));
        pathname = pathDir ? entry.replace(new RegExp('^' + pathDir), '').split('.')[0] : entry;
        //pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
        //pathname = pathDir ? basename: pathname;
        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-pathname2:'+pathname);
        entries[pathname] = ['./' + entry];
        console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-pathname3:'+['./' + entry]);

    }
    for(n in entries){
        console.log('DDDDDDD-'+n+':'+entries[n]);
    }

    console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDD-entries:'+entries);
    return entries;
}