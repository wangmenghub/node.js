/**
 * 联系我们
 * 作者: 王蒙
 * 日期: 2015-11-25
 */

var express = require('express');
var utils = require('../utils/index');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('product');
});

module.exports = router;
