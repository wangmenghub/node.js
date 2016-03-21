/**
 * 生产环境配置
 * 作者: 卢培培
 * 日期: 2015-04-14
 */

var config = {};

/**
 * 服务器配置
 */
config.server = {
    port: 8802,
    logPath: 'logs/http',
    filePath: {
        temp: 'files/temp',
        files: 'files/uploads'
    },
    mallUrl: 'https://shop136779775.taobao.com/?spm=a230r.7195193.1997079397.38.oScYo8',
    site: {
        name: '友蜜蜜',
        slogan: '有情有趣友蜜蜜',
        copyright: '和信达'
    }
};

/**
 * 核心服务配置
 */
config.service = {
    url: 'http://api.youmimi.net',
    appSecret: '185058ca61d34915b76f744c8c53fe29',
    accessToken: '6f1d6c7374984dc5aed8cb77dde00de83a98a710c8734ee7a75282990f32d678'
};

/**
 * 微信服务号配置
 */
config.weixin = {
    appId: 'wxfcaa2b29b8951e6b',
    appSecret: 'e924c1f68423d5fb9fe10874add191e3'
};

/**
 * 日志配置(pomelo-logger[log4js])
 * 参考资料:
 * https://github.com/nomiddlename/log4js-node/blob/master/README.md
 * https://github.com/NetEase/pomelo-logger/blob/master/README.md
 */
config.log = {
    appenders: [
        {type: 'console'},
        {
            category: 'server',
            type: 'file',
            filename: 'logs/server.log',
            maxLogSize: 1024 * 1024 * 1024,
            backups: 3,
            layout: {type: 'basic'}
        }
    ],
    levels: {                   // 日志级别: ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < OFF
        server: 'ALL'
    },
    replaceConsole: true,       // 替换命令行日志, 即 console.log/console.error/console.warn 等
    lineDebug: true             // 包含代码行号
};

module.exports = config;