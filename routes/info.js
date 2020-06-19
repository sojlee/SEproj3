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

/* Post users listing. */
router.get('/', function(req, res, next) {
	var grade = req.session.grade;
	if(grade != 2 || grade != 0 || grade != 1){
		res.send("<script> alert('로그인이 필요합니다.'); history.back();</script>");
	}
  var email = req.session.email;
	pool.getConnection(function(err, conn) {
		if(err) throw err;
 		var sqlForInsertUser = "select id, email, name, address1, address2, birth, phone from user where email = ?";
 		conn.query(sqlForInsertUser, email, function (err, rows) {
 			if(err) console.log("err : " + err);
 			console.log("rows : " + JSON.stringify(rows));
			var address = rows[0].address1 + rows[0].address2;
      res.render("./shop/info.html", {session:req.session, rows:rows[0], address:address});
 			conn.release();
 		});
 	});
});


module.exports = router;
