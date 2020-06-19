var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var grade = req.session.grade;
  if(grade != 2 || grade != 0 || grade != 1){
    res.send("<script> alert('로그인이 필요합니다.'); history.back();</script>");
  }
  req.session.destroy();
  res.clearCookie('sid');
  res.send("<script> alert('로그아웃 되었습니다.'); location.href='/';</script>");

});

module.exports = router;
