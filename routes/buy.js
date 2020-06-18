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
		var user = req.session.uid; // 쓴 작성자 id, 세션이나 sql을 통해서 id를 가져와야함
		
		pool.getConnection(function (err, connection) {
		// 해당 유저의 order 테이블에서 가져온다.
			var selectbuy = "select * from orders where customer = ?";
			connection.query(selectbuy, user, function (err, rows) {
							if (err) console.error("err : " + err);
							console.log("rows : " + JSON.stringify(rows));
							console.log(rows);
							
							res.render('./shop/buy.html', {session:req.session, rows:rows});
							connection.release();
			});
		});
});

module.exports = router;
