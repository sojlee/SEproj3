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
  res.render('./shop/register.html');
});

/* Post users listing. */
router.post('/', function(req, res, next) {
  console.log('req.body : ' + JSON.stringify(req.body));
	var id = req.body.id;
	var name = req.body.name;
	var birth = req.body.birth;
	var email = req.body.email;
	var phone = req.body.phone;
	var inputPassword = req.body.passwd;
	var salt = Math.round((new Date().valueOf() * Math.random())) + "";
  var hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
	var address1 = req.body.address1;
	var address2 = req.body.address2;
	var friend = req.body.friend;
	var datas = [id, name, email, phone, birth, address1, hashPassword, address2, salt];
	console.log(datas);
  // mysql상으로 확인
	pool.getConnection(function(err, conn) {
		if(err) throw err;
 		var sqlForInsertUser = "insert into user(id, name, email, phone, birth, address1, passwd, address2, salt) values(?,?,?,?,?,?,?,?,?)";
 		conn.query(sqlForInsertUser, datas, function (err, rows) {
 			if(err) console.log("err : " + err);
 			console.log("rows : " + JSON.stringify(rows));

			if(rows.affectedRows==0){
 				res.send("<script> alert('관리자에게 문의하세요.'); history.back();</script>");
 			}
 			else{
 				 res.send("<script> alert('가입되었습니다.'); location.href='/';</script>");
 			}
 			conn.release();
 		});
 	});
});

module.exports = router;
