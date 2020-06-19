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
	var grade = req.session.grade;
	if(grade != 2 || grade != 0 || grade != 1){
		res.send("<script> alert('로그인이 필요합니다.'); history.back();</script>");
	}
	var total = 0;
	pool.getConnection(function (err, connection) {
		var selectreview = 'select * from product as p join mycart as c on p.p_code = c.product_p_code where c.user_id = ?';
		connection.query(selectreview, req.session.uid, function (err, rows) {
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
						console.log(rows[0].p_name);
						for (var i = 0; i < rows.length; i ++){
							total += rows[i].p_price;
						}
						res.render('./shop/checkout.html', {session:req.session, rows:rows, total:total});
						connection.release();
		});
	});
});

module.exports = router;
