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


// 이미지 업로드 관련 설정 부분
var multer = require('multer');
var app = express();

// 파일을 디스크에 저장
var storage = multer.diskStorage({
    destination: (req, file, cb) => {   // 저장할 경로 설정
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {      // 저장할 파일명 설정
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage }); // 파일 저장 위치를 storage 함수로 지정
// 이미지 업로드 관련 설정 부분 끝

/* GET users listing. */
router.get('/', function(req, res, next) {
	pool.getConnection(function (err, connection) {
        if(err) throw err;
        // Use the connection
        var sqlForSelectList = "SELECT p_code, p_name, p_desc, p_price, p_amount, update_date FROM product";
        connection.query(sqlForSelectList, function (err, rows){
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
						var p_code = new Array();
						var p_name = new Array();
						var p_price = new Array();
						var p_amount = new Array();
						var p_update = new Array();

						for (var i = 0; i < rows.length; i++){
							p_code[i] = rows[i].p_code;
							p_name[i] = rows[i].p_name;
							p_price[i] = rows[i].p_price;
							p_amount[i] = rows[i].p_amount;
							p_update[i] = rows[i].update_date;
						}
						res.render('./admin/table-data.html', {rows:rows.length, p_code:p_code, p_name:p_name, p_price:p_price, p_amount:p_amount, p_update:p_update} );
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });

});

router.get('/create', function(req, res, next) {
		res.render('./admin/create_product.html');
});


router.post('/create', upload.array('IMG_FILE'), function(req, res, next) {
	var p_code = req.body.p_code;
	var p_name = req.body.p_name;
	var p_desc = req.body.p_desc;
	var p_amount = req.body.p_amount;
	var p_price = req.body.p_price;
	var product = './uploads/product-' + p_code + '.jpg';
	var item = './uploads/item-' + p_code + '.jpg';
	var large = './uploads/large-' + p_code + '.jpg';
	var cart = './uploads/cart-' + p_code + '.jpg';
	var datas = [p_code,p_name,p_desc,p_amount,p_price, cart, large, item, product];
	console.log(datas);
	pool.getConnection(function (err, connection) {
				if(err) throw err;
				// Use the connection
				var sqlForSelectList = "insert into product(p_code,p_name,p_desc,p_amount,p_price, cart_img, large_img, item_img, product_img) values(?,?,?,?,?,?,?,?,?)";
				connection.query(sqlForSelectList, datas, function (err, rows){
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
						if(rows.affectedRows==0){
			 				res.send("<script> alert('관리자에게 문의하세요.'); history.back();</script>");
			 			}
			 			else{
			 				res.redirect('/productDB');
			 			}
						connection.release();

						// Don't use the connection here, it has been returned to the pool.
				});
		});
});


router.get('/update/:p_code', function(req, res, next) {
	var p_code = req.params.p_code;
	pool.getConnection(function (err, connection) {
				if(err) throw err;
				// Use the connection
				var sqlForSelectList = "SELECT p_code, p_name, p_desc, p_price, p_amount, update_date FROM product where p_code = ?";
				connection.query(sqlForSelectList, p_code, function (err, rows){
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
					 res.render('./admin/form-elements.html', {rows:rows[0]} );
						connection.release();

						// Don't use the connection here, it has been returned to the pool.
				});
		});
});


router.post('/update', upload.array('IMG_FILE'), function(req, res, next) {
	var p_code = req.body.p_code;
	var p_name = req.body.p_name;
	var p_desc = req.body.p_desc;
	var p_amount = req.body.p_amount;
	var p_price = req.body.p_price;
	var product = './uploads/product-' + p_code + '.jpg';
	var item = './uploads/item-' + p_code + '.jpg';
	var large = './uploads/large-' + p_code + '.jpg';
	var cart = './uploads/cart-' + p_code + '.jpg';
	var datas = [p_name, p_desc, p_amount, p_price, p_code, product, item, cart, large, p_code];
	pool.getConnection(function (err, connection) {
				if(err) throw err;
				// Use the connection
				var sqlForSelectList = "update product set p_name=?, p_desc=?, p_amount=?, p_price=? product_img = ?, item_img = ?, cart_img = ?, large_img = ? where p_code = ?";
				connection.query(sqlForSelectList, datas, function (err, rows){
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
						if(rows.affectedRows==0){
			 				res.send("<script> alert('관리자에게 문의하세요.'); history.back();</script>");
			 			}
			 			else{
			 				res.redirect('/productDB');
			 			}
						connection.release();

						// Don't use the connection here, it has been returned to the pool.
				});
		});
});

router.get('/delete/:p_code', function(req, res, next) {
	var p_code = req.params.p_code;
	console.log(p_code);
	pool.getConnection(function (err, connection) {
				if(err) throw err;
				// Use the connection
				var sqlForSelectList = "delete from product where p_code = ?";
				connection.query(sqlForSelectList, p_code, function (err, rows){
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
						if(rows.affectedRows==0){
			 				res.send("<script> alert('삭제 실패. 관리자에게 문의하세요.'); history.back();</script>");
			 			}
			 			else{
			 				res.send("<script> alert('삭제 완료.'); location.href='/productDB';</script>");
			 			}
						connection.release();

						// Don't use the connection here, it has been returned to the pool.
				});
		});
});


module.exports = router;
