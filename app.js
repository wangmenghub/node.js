var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var utils = require('./utils');
var config = require('./config');

var app = express();
app.set('x-powered-by', false);
app.set('trust proxy', true);

// 初始化站点配置信息
app.locals.site = config.server.site;

// 初始化视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);


app.use(favicon(__dirname + '/public/favicon.ico'));

// Express中间件: 记录HTTP请求日志(开发环境和生产环境采用不同方案)
if (app.get('env') === 'development') {
    app.use(logger('dev'));
} else {
    app.use(utils.productionHttpLogger(path.join(__dirname, config.server.logPath)));
}

// Express中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest: path.join(__dirname, 'public', config.server.filePath.temp)}));

// 页面路由
app.use('/', require('./routes'));
app.use('/download', require('./routes/download'));
app.use('/contact', require('./routes/contact'));
app.use('/about', require('./routes/about'));
app.use('/use-agreement', require('./routes/use-agreement'));
app.use('/product', require('./routes/product'));

// 捕获404错误并移交错误处理中间件
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 错误处理中间件: 开发环境下返回错误栈, 生产环境下则只返回错误码和错误信息
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    var error = {
        errcode: err.code || -1,
        errmsg: err.message || '未知错误'
    };

    if (app.get('env') === 'development') {
        error.stack = err.stack;
    }

    res.format({
        'text/html': function () {
            res.render('error', {
                message: err.message,
                error: (app.get('env') === 'development' ? err : {})
            });
        },
        'application/json': function () {
            res.json(error);
        },
        'default': function () {
            res.render('error', {
                message: err.message,
                error: (app.get('env') === 'development' ? err : {})
            });
        }
    });
});

module.exports = app;
