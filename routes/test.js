var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('./dbConfig');
var pool = mysql.createPool({
	connectionLimit: 5,
	host: dbConfig.host,
	port: dbConfig.port,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database
});
/* GET home page. */
router.get('/', function(req, res, next) {
		res.render('index.html', {session:req.session});
});

router.get('/test', function(req, res, next) {
		res.render('./admin/imgtest.html');
});
module.exports = router;
