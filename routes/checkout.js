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
	var total = 0;
	pool.getConnection(function (err, connection) {
	// review 테이블에 insert한다.
		var selectreview = 'select p.p_name, p.p_price from product as p join mycart as c on p.p_code = c.product_p_code where c.user_id = ?';
		connection.query(selectreview, req.session.uid, function (err, rows) {
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
						console.log(rows[0].p_name);
						console.log(rows[1].p_price);
						for (var i = 0; i < rows.length; i ++){
							total += rows[i].p_price;
						}
						res.render('./shop/checkout.html', {session:req.session, rows:rows, total:total});
						connection.release();
		});
	});
});

module.exports = router;
