var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('./shop/product-detail_01.html');
});

module.exports = router;
