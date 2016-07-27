/**
 * ��ϵ����
 * ����: ����
 * ����: 2015-11-25
 */

var express = require('express');
var utils = require('../utils/index');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('product');
});

module.exports = router;
