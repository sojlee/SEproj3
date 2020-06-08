var express = require('express');
var router = express.Router();

/* GET home page. */ 
router.get('/', function(req, res, next) {
		res.send('This is test, <img src="./images/1024.png">');
});

router.get('/test', function(req, res, next) {
		res.render('test', {title:'안녕.'});
});

module.exports = router;
