var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.session.destroy();
  res.clearCookie('sid');
  res.send("<script> alert('로그아웃 되었습니다.'); location.href='/';</script>");

});

module.exports = router;
