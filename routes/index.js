/**
 * 根请求路由
 * 作者: 卢培培
 * 日期: 2015-08-12
 */

var express = require('express');
var utils = require('../utils/index');
var config = require('../config');
var httpRequest = require('request');
var async = require('async');
var WechatAPI = require('wechat-api');

var router = express.Router();

/**
 * 初始化微信API
 */
var wechatAPI = new WechatAPI(config.weixin.appId, config.weixin.appSecret, function(cb) {
    getWeixin(function(err, result) {
        if (err) return cb(err);
        cb(null, result.accessToken);
    });
}, function(token, cb) {
    cb();
});
wechatAPI.registerTicketHandle(function(type, cb) {
    getWeixin(function(err, result) {
        if (err) return cb(err);
        cb(null, result.jsApiTicket);
    });
}, function(type, jsapi_ticket, cb) {
    cb();
});

/**
 * 站点首页
 */
router.get('/', function (req, res, next) {
    var userAgent = utils.parseUserAgent(req.get('User-Agent'));
    var inApp = (userAgent && userAgent.clientVersion);
    var inWeixin = (userAgent && userAgent.weixinVersion);
    var platform = userAgent.OS;

    async.series({
        wxJSSDKConfig: function(cb) {
            if (!userAgent.weixinVersion) return cb();

            var param = {
                debug: false,
                url: 'http://' + req.get('host') + req.originalUrl
            };
            wechatAPI.getJsConfig(param, function(err, result) {
                if (err) return cb(err);
                cb(null, result);
            });
        },
        android: function (cb) {
            var options = {
                url: config.service.url + "/v1/client-packages/current",
                headers: {Authorization: config.service.accessToken},
                qs: {platform: 'Android'},
                json: true
            };
            httpRequest.get(options, function(err, response, body) {
                if (err) return cb(err);
                if (response.statusCode !== 200) return cb(new Error('Core Service Error'));
                cb(null, body);
            });
        },
        iOS: function (cb) {
            var options = {
                url: config.service.url + "/v1/client-packages/current",
                headers: {Authorization: config.service.accessToken},
                qs: {platform: 'iOS'},
                json: true
            };
            httpRequest.get(options, function(err, response, body) {
                if (err) return cb(err);
                if (response.statusCode !== 200) return cb(new Error('Core Service Error', 999));
                cb(null, body);
            });
        }
    }, function(err, result){
        if (err && err.message != 'Core Service Error') return next(err);

        var downloadBaseUrl = config.service.url + '/client-packages/';
        var downloadUrl = {
            iOS: (result.iOS ? downloadBaseUrl + result.iOS.id + '/file' : ''),
            android: (result.android ? downloadBaseUrl + result.android.id + '/file' : '')
        };

        if (platform == 'iOS') {
            res.render('mobile/mobile-ios', {
                platform: platform,
                downloadUrl: downloadUrl.iOS,
                wxJSSDKConfig: result.wxJSSDKConfig,
                mallUrl:config.server.mallUrl,
                inApp:inApp,
                inWeixin:inWeixin
            });
        } else if (platform == 'Android') {
            res.render('mobile/mobile-android', {
                platform: platform,
                downloadUrl: downloadUrl.android,
                wxJSSDKConfig: result.wxJSSDKConfig,
                mallUrl:config.server.mallUrl,
                inApp:inApp,
                inWeixin:inWeixin
            });
        } else {
            res.render('index', {downloadUrl: downloadUrl,mallUrl:config.server.mallUrl});
        }
    });
});

/**
 * 获得微信信息
 * 说明: 通过向核心服务器发请求获得微信accessToken和jsApiTicket等
 */
function getWeixin(cb) {
    var options = {
        url: config.service.url + "/v1/weixin",
        headers: {Authorization: config.service.accessToken},
        json: true
    };
    httpRequest.get(options, function(err, response, body) {
        if (err) return cb(err);
        if (response.statusCode !== 200) return cb(new Error('Core Service Error'));
        cb(null, body);
    });
}

module.exports = router;
