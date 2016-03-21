/**
 * 开发环境配置
 * 作者: 卢培培
 * 日期: 2015-08-12
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
        name: '友蜜蜜[开发版]',
        slogan: '有情有趣友蜜蜜[开发版]',
        copyright: '和信达'
    }
};

/**
 * 核心服务配置
 */
config.service = {
    url: 'http://api.dev.youmimi.net',
    appSecret: '44d896c97b6b4907b2bfeeaf63e23aad',
    accessToken: '99f607ea75b443cd985f53afa4e6dface80e618a431f4485a48a09942649c2bb'
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