/**
 * 小工具
 * 说明: 本模块可跨不同产品使用, 与业务无关, 不依赖任何业务模块, 但依赖部分第三方模块
 * 作者: 卢培培
 * 日期: 2015-04-14
 */

var fs = require('fs');
var morgan = require('morgan');
var path = require('path');
var moment = require('moment');
var httpRequest = require('request');

var utils = {};

/**
 * 获得Express Morgan日志中间件
 * 说明: 主要用于生产环境下记录HTTP请求日志, 每天的日志分别记录在以日期命名的文件中
 * 示例: app.use(utils.productionHttpLogger(path.join(__dirname, 'logs')));
 * 技术参考: https://github.com/expressjs/morgan/blob/master/README.md
 * @param {String} logPath 以根目录开始的完整路径
 * @returns {Function} Express Morgan日志中间件
 */
utils.productionHttpLogger = function (logPath) {
    if ('string' != typeof logPath) {
        return null;
    }

    fs.existsSync(logPath) || fs.mkdirSync(logPath);
    var accessLogStream = require('file-stream-rotator').getStream({
        filename: path.join(logPath, '/access_%DATE%.log'),
        frequency: 'daily',
        date_format: 'YYYY-MM-DD',
        verbose: false
    });
    var logOptions = {
        stream: accessLogStream,
        skip: function (req, res) {
            var exts = '.js|.jpg|.png|.css'.split('|');
            for (var i = 0; i < exts.length; ++i) {
                var pos = req.url.lastIndexOf(exts[i]);
                if ((pos != -1) && (pos == (req.url.length - exts[i].length))) {
                    return true;
                }
            }
            return false;
        }
    };
    morgan.token('localDate', function () {
        return moment().format('YYYY-MM-DD HH:mm:ss', new Date());
    });
    var logFormat = '[:localDate] :remote-addr [:method :url :status] :response-time ms, :res[content-length] bytes';
    return morgan(logFormat, logOptions);
};

/**
 * 生成随机字符串
 * @param {Number} length 字符串长度
 * @param {String} type 'n'表示仅包含数字, 's'表示仅包含英文字母, 'ns'或'sn'表示包含数字和英文字母, 'all'表示包含数字和英文字母以及个别特殊字符
 * @param {Boolean} containUpperCase 是否包含大写英文字母: true表示包含大写和小写字母, false表示仅包含小写字母
 * @returns {String} 随机字符串
 */
utils.randomString = function (length, type, containUpperCase) {
    if ('number' != typeof length || 'string' != typeof type) {
        return null;
    }

    var chars = null;
    if (type === 'n') {
        chars = '0123456789';
    } else if (type === 's') {
        chars = 'abcdefghijklmnopqrstuvwxyz';
    } else if (type === 'ns' || type === 'sn') {
        chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    } else if (type === 'all') {
        chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*_';
    } else {
        return null;
    }

    if (type != 'n' && ('boolean' == typeof containUpperCase) && containUpperCase) {
        chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    chars = new Buffer(chars);

    var result = '';
    for (var i = 0; i < length; i++) {
        result += String.fromCharCode(chars[Math.ceil(Math.random() * (chars.length - 1))]);
    }
    return result;
};

/**
 * 获得iOS App的信息
 * @param {String} appId 苹果应用唯一标识
 * @param {Function} cb 回调函数: function(err, app)
 */
utils.getiOSAppInfo = function (appId, cb) {
    if (!appId || ('function' != typeof cb)) {
        return;
    }

    var options = {
        url: 'http://itunes.apple.com/cn/lookup',
        qs: {
            id: appId
        },
        json: true
    };

    httpRequest.get(options, function (err, res, body) {
        if (!err && (res.statusCode == 200) && (body.resultCount == 1)) {
            cb(null, body.results[0]);
        } else {
            cb(err || new Error('苹果服务器响应错误'), null);
        }
    });
};

/**
 * 解析User-Agent获得请求方系统类型和系统版本
 * 说明: 几种场景下的User-Agent示例如下
 * 【iOS模拟器】user-agent: test 1.0 rv:1 (iPhone Simulator; iPhone OS 8.3; en_US)
 * 【iOS真机】user-agent: test 1.0 rv:1 (iPhone; iPhone OS 8.3; zh_CN)
 * 【Android真机(自定义)】user-agent: Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn; Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
 * @param {String} userAgent HTTP请求头中的userAgent
 * @returns {Object} 解析结果
 */
utils.parseUserAgent = function(userAgent) {
    if (!userAgent) {
        return null;
    }

    // 解析请求方操作系统和版本
    var clientOS = userAgent.match(/Android .*;/);
    if (!clientOS || clientOS.length == 0) {
        clientOS = userAgent.match(/iPhone OS .[^\s]*/);
    }

    var result = {userAgent: userAgent};
    if (clientOS && clientOS.length != 0) {
        clientOS = clientOS[0].replace(';', '').split(' ');
        if (clientOS[0] == 'Android') {
            result.OS = 'Android';
            result.OSVersion = clientOS[1];
        } else if (clientOS[0] == 'iPhone') {
            result.OS = 'iOS';
            result.OSVersion = clientOS[2];
        }
    }

    // 解析请求方客户端app
    var clientApp = userAgent.match(/love\/[^\s]*/i);
    if (clientApp && clientApp.length != 0) {
        result.clientVersion = clientApp[0].split('/')[1];
    }

    // 解析请求方客户端微信版本
    var wxApp = userAgent.match(/MicroMessenger\/[^\s]*/);
    if (wxApp && wxApp.length != 0) {
        result.weixinVersion = wxApp[0].split('/')[1];
    }

    return result;
};

/**
 * 创建多级目录(递归创建多级子目录)
 * @param {String} dir 目录完整路径
 * @param {String} mode fs.mkdir的mode
 * @param {Function} cb 回调函数: function(err)
 */
utils.mkdirs = function(dir, mode, cb) {
    if (!dir || ('function' != typeof cb)) {
        return;
    }

    fs.stat(dir, function(err, stats) {
        if (stats && stats.isDirectory()) return cb();

        // 尝试创建父目录, 然后再创建当前目录
        utils.mkdirs(path.dirname(dir), mode, function() {
            fs.mkdir(dir, mode, cb);
        });
    });
};

module.exports = utils;