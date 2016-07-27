/**
 * 用户协议
 * 作者: 王蒙
 * 日期: 2015-10-06
 */

var express = require('express');
var utils = require('../utils/index');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('use-agreement');
});

module.exports = router;
