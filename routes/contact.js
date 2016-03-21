/**
 * 联系我们
 * 作者: 卢培培
 * 日期: 2015-10-06
 */

var express = require('express');
var utils = require('../utils/index');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('contact');
});

module.exports = router;
