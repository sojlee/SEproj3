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
		var total = new Array();
		pool.getConnection(function (err, connection) {
		// review 테이블에 insert한다.
			var selectreview = 'select * from product as p join mycart as c on p.p_code = c.product_p_code where c.user_id = ?';
			connection.query(selectreview, req.session.uid, function (err, rows) {
							if (err) console.error("err : " + err);
							console.log("rows : " + JSON.stringify(rows));
							console.log(rows[0].p_name);
							console.log(rows[0].p_price);
							for (var i = 0; i < rows.length; i ++){
								total[i] = rows[i].p_price * rows[i].amount;
							}
							res.render('./shop/shopping-cart.html', {session:req.session, rows:rows, total:total});
							connection.release();
			});
		});
});

router.post('/', function(req, res, next) {

	var p_code = req.body.p_code;
	var id = req.session.uid;
	var amount = req.body.p_amount;
	var datas = [p_code, id, amount];
	console.log(datas);

	pool.getConnection(function (err, connection) {
	// review 테이블에 insert한다.
	var insertReview = "insert into mycart(product_p_code, user_id, amount) values(?, ?, ?)";
        connection.query(insertReview, datas, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/cart');
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
		});
	});
});

module.exports = router;
