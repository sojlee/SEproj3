var express = require('express');
var router = express.Router();
// MySQL load
var mysql = require('mysql');
var dbConfig = require('./dbConfig');
var pool = mysql.createPool({
	connectionLimit: 5,
	host: dbConfig.host,
	port: dbConfig.port,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database,
	dateStrings:'date'
});
var fs = require('fs');         // 파일 삭제 구현 목적

/* GET users listing. */
router.get('/', function(req, res, next) {
  var grade = req.session.grade;
/*  if(grade != 0){
    res.send("<script> alert('관리자 계정만 접근 가능합니다.'); history.back();</script>");
  }
  else {*/
    pool.getConnection(function (err, connection) {
          if(err) throw err;
          // Use the connection
          var sqlForSelectList = "SELECT grade, name, id, phone, birth, email FROM user";
          connection.query(sqlForSelectList, function (err, rows){
              if (err) console.error("err : " + err);
              console.log("rows : " + JSON.stringify(rows));
  						var id = new Array();
  						var name = new Array();
  						var grade = new Array();
  						var email = new Array();
  						var phone = new Array();
              var birth = new Array();

  						for (var i = 0; i < rows.length; i++){
  							id[i] = rows[i].id;
  							name[i] = rows[i].name;
  							email[i] = rows[i].email;
  							phone[i] = rows[i].phone;
  							birth[i] = rows[i].birth;
                grade[i] = rows[i].grade;
  						}
  						res.render('./admin/userDB.html', {rows:rows.length, id:id, name:name, grade:grade, email:email, phone:phone, birth:birth} );
              connection.release();

              // Don't use the connection here, it has been returned to the pool.
          });
      });
  //}
});

router.get('/update/:id', function(req, res, next) {
	var id = req.params.id;
	pool.getConnection(function (err, connection) {
				if(err) throw err;
				// Use the connection
				var sqlForSelectList = "SELECT grade, name, id, phone, birth, email FROM user where id = ?";
				connection.query(sqlForSelectList, id, function (err, rows){
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
					 res.render('./admin/update_userDB.html', {rows:rows[0]} );
						connection.release();

						// Don't use the connection here, it has been returned to the pool.
				});
		});
});

router.post('/update', function(req, res, next) {
  var grade = req.body.grade;
	var id = req.body.id;
  var datas = [grade, id];

	pool.getConnection(function (err, connection) {
				if(err) throw err;
				// Use the connection
				var sqlForSelectList = "update user set grade = ? where id = ?";
				connection.query(sqlForSelectList, datas, function (err, rows){
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
						if(rows.affectedRows==0){
			 				res.send("<script> alert('관리자에게 문의하세요.'); history.back();</script>");
			 			}
			 			else{
			 				res.redirect('/userDB');
			 			}
						connection.release();

						// Don't use the connection here, it has been returned to the pool.
				});
		});
});


module.exports = router;
