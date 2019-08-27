var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title:"工作日誌查詢系統"});
});

module.exports = router;
