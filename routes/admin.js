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
	database: dbConfig.database,
	multipleStatements : true
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	var grade = req.session.grade;
	if(grade == 2){
    res.send("<script> alert('관리자, 판매자 계정만 접근 가능합니다.'); history.back();</script>");
  }
  //res.render('./admin/index.html');
	pool.getConnection(function (err, connection) {
	// review 테이블에 insert한다.
		var income = 'SELECT SUM(total) as income FROM orders;';
		var orders = 'SELECT count(o_num) as orders FROM myflower.orders;';
		var users = 'SELECT count(id) as users FROM user;';
		connection.query(income + orders + users, function (err, rows) {
						if (err) console.error("err : " + err);
						var r1 = rows[0];
						var r2 = rows[1];
						var r3 = rows[2];
						console.log("rows : " + JSON.stringify(rows));
						console.log(r1[0].income);
						console.log(r2[0].orders);
						console.log(r3[0].users);
						res.render('./admin/index.html', {income:r1[0].income, orders:r2[0].orders, users:r3[0].users});
						connection.release();
		});
	});
});

module.exports = router;
