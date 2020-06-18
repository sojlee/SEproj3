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

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.render('./shop/index.html', {session : req.session})
	pool.getConnection(function (err, connection) {
	// review 테이블에 insert한다.
		//var selectNew = 'select * from product order by update_date DESC;';
		var selectGood = 'select p.item_img, p.p_code, p.p_name, avg(r.score) as score from product as p join review as r on p.p_code = r.product_p_code group by (r.product_p_code) order by score desc;';
		var selectNew = 'select item_img from product order by update_date DESC;';
		connection.query(selectGood + selectNew, function (err, rows) {
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
						var goodproduct = rows[0];
						var newproduct = rows[1];
						console.log(goodproduct);
						console.log(newproduct);
						console.log(goodproduct[0].item_img);
						console.log(newproduct[0].item_img);
						res.render('./shop/index.html', {session : req.session, newimg:newproduct, goodimg:goodproduct});
						connection.release();
		});
	});
});

module.exports = router;
