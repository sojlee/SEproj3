var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const crypto = require('crypto');

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
  res.render('./shop/login.html');
});

/* Post users listing. */
router.post('/', function(req, res, next) {
  console.log('req.body : ' + JSON.stringify(req.body));
	var id = req.body.id;
	var inputPassword = req.body.password;

	pool.getConnection(function(err, conn) {
		if(err) throw err;
		var sqlForInsertUser = "select salt, passwd, email from user where id = ?";
		conn.query(sqlForInsertUser, id, function (err, rows) {
			if(err) console.log("err : " + err);
			console.log("rows : " + JSON.stringify(rows));
			var salt = rows[0].salt;
			var passwd = rows[0].passwd;
			var email = rows[0].email;
			var hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
			console.log(hashPassword);
			console.log(passwd);
			if(passwd === hashPassword){
				req.session.email = email;
				console.log(req.session);
				res.send("<script> alert('로그인 성공'); location.href='/';</script>");
			}
			else{
				res.send("<script> alert('아이디 혹은 비밀번호가 일치하지 않습니다.'); history.back();</script>");
			}

			conn.release();
		});
	});
});

module.exports = router;
