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
  res.render('./shop/product-detail_01.html', {session:req.session});
});

/* 리뷰 작성 post 로직 */
router.post('/write_review', function(req, res, next) {
	// review 테이블에 쓸 값을 가져온다.
	var product_code = 11; // 임의의 값, sql문으로 가져와야함
	var user = req.session.email; // 쓴 작성자 id, 세션이나 sql을 통해서 id를 가져와야함
	var content = "req.body.review_content";
	var score = 3; //"req.body.rate";
	var datas = [product_code,user,content, score];

	console.log(datas);

	pool.getConnection(function (err, connection) {
	// review 테이블에 insert한다.
	var insertReview = "insert into review(product_p_code, user_id, content, score) values(?, ?, ?, ?)";
        connection.query(insertReview, datas, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
		
            res.redirect('/detail');
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
		});
	});
});

module.exports = router;
