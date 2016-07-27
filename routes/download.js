/**
 * 下载
 * 作者: 王蒙
 * 日期: 2015-10-06
 */

var express = require('express');
var utils = require('../utils/index');
var config = require('../config');
var httpRequest = require('request');
var async = require('async');

var router = express.Router();

router.get('/', function (req, res, next) {
    var userAgent = utils.parseUserAgent(req.get('User-Agent'));
    var platform = userAgent.OS;

    async.series({
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
        if (result.iOS) result.iOS.downloadUrl = downloadBaseUrl + result.iOS.id + '/file';
        if (result.android) result.android.downloadUrl = downloadBaseUrl + result.android.id + '/file';

        res.render('download', {iOS: result.iOS, android: result.android});
    });
});

module.exports = router;
