var express = require('express');
var router = express.Router();
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
	database: dbConfig.database
});
var fs = require('fs');         // 파일 삭제 구현 목적

// 이미지 업로드 관련 설정 부분
var multer = require('multer');
var app = express()
// 파일을 디스크에 저장
var storage = multer.diskStorage({
    destination: (req, file, cb) => {   // 저장할 경로 설정
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {      // 저장할 파일명 설정
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage }); // 파일 저장 위치를 storage 함수로 지정
/* GET users listing. */
router.get('/:p_code', function(req, res, next) {
	var p_code = req.params.p_code;
	pool.getConnection(function (err, connection) {
				if(err) throw err;
				// Use the connection
				var sqlForSelectList = "SELECT p_code, p_name, p_desc, p_img, p_price, p_amount, update_date FROM product where p_code = ?";
				connection.query(sqlForSelectList, p_code, function (err, rows){
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
					 res.render('./admin/updateDB.html', {rows:rows[0]} );
						connection.release();

						// Don't use the connection here, it has been returned to the pool.
				});
		});
});

module.exports = router;
