var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('./shop/login.html');
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log('req.body : ' + JSON.stringify(req.body));
  // mysql상으로 확인
	res.json(req.body);
});

module.exports = router;
