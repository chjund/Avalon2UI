/**
 * Created by Administrator on 2016/5/25 0025.
 */
'use strict'
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
// ���ô����Զ���������滻���
config.entry.unshift('webpack-dev-server/client?http://localhost:9090', "webpack/hot/dev-server");
config.plugins.push(new webpack.HotModuleReplacementPlugin());
// �������ã�����http://localhost:9090/index.php��
// �൱��ͨ������node�������������http://testapi.uhouzz.com/index.php
var proxy = [{
    path: "/index.php/*",
    target: "http://pc.uhouzz.com",
    host: "pc.uhouzz.com"
}]
//��������
var app = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot:true,
    historyApiFallback: true,
    proxy:proxy
});
app.listen(9090);