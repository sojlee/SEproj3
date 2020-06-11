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
		pool.getConnection(function(err, conn) {
		var sqlForSelectList = "SELECT * FROM user";
		conn.query(sqlForSelectList, function(err, rows) {
			if(err) console.log("err: " + err);
			console.log("rows : " + JSON.stringify(rows));
			res.send(JSON.stringify(rows));
			conn.release();
		});
	});
});

router.get('/test', function(req, res, next) {
		res.render('test', {title:'안녕.'});
});

module.exports = router;
