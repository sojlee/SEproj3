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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('./shop/register.html');
});

/* Post users listing. */
router.post('/', function(req, res, next) {
  console.log('req.body : ' + JSON.stringify(req.body));
  // mysql상으로 확인
	res.json(req.body);
});

module.exports = router;
