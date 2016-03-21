# 友蜜蜜产品官网

## 日志
### 开发日志采用pomelo-logger(log4js)模块
日志文件保存在'logs'目录下。
```js
var logger = require('pomelo-logger').getLogger('categoryName', require('path').basename(__filename), process.pid);
logger.trace('test');
logger.debug('test');
logger.info('test');
logger.warn('test');
logger.error('test');
logger.fatal('test');
```
### HTTP请求日志采用morgan(for express)中间件
日志文件保存在'logs/http'目录下。
开发环境下，日志输出到标准输出，默认为process.stdout。(NODE_ENV系统环境变量设置为'development')
生产环境下，日志输出到指定文件。(NODE_ENV系统环境变量设置为'production'或其它)

## 配置文件
config.development.js
config.production.js
config.js