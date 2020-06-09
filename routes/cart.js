var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('./shop/shopping-cart.html');
});

module.exports = router;
