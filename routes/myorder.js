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
	multipleStatements : true,
	dateStrings:'date'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	var total = 0;
	var user = req.session.uid;
	console.log(user);
	pool.getConnection(function (err, connection) {
		var selectOrder = 'SELECT * from orders where customer = ?;';
		var so = mysql.format(selectOrder, user);
		var selectreview = 'SELECT * from order_lists where order_o_num = (select o_num from orders where customer = ?);';
		var sr = mysql.format(selectreview, user);
		connection.query(so + sr, user, function (err, rows) {
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
						var orders = rows[0];
						var lists = rows[1];
						console.log(orders);
						console.log(lists[0]);
						res.render('./shop/myorder.html', {session:req.session, orders:orders, lists:lists});
						connection.release();
		});
	});
});

/* POST users listing. */
router.post('/', function(req, res, next) {
  var user = req.session.uid;
  var d = new Date();
  var o_num = d.getTime();
  var name = req.body.name;
  var p_code = req.body.p_code;
  var amount = req.body.amount;
  var address = req.body.address;
  var phone = req.body.phone;
  var datas1 = [o_num, user, address, phone, name];
  var datas2 = [o_num, p_code, amount];
	pool.getConnection(function (err, connection) {
	// review 테이블에 insert한다.
		var insert1 = 'insert insert into orders(o_num, customer, address, phone, name) values(?,?,?,?,?);';
    var i1 = mysql.format(insert1, datas1);
    var insert2 = 'insert insert into order_lists(o_num, product_p_code, amount) values(?,?,?);';
    var i2 = mysql.format(insert2, datas2);
    var deletecart = 'delete mycart where user_id = ?;';
    var d1 = mysql.format(deletecart, user);
		connection.query(i1 + i2 + d1, req.session.uid, function (err, rows) {
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));

            if(rows.affectedRows==0){
			 				res.send("<script> alert('관리자에게 문의하세요.'); history.back();</script>");
			 			}
			 			else{
			 				res.send("<script> alert('결제완료!'); location.href='/checkout';</script>");
			 			}
						connection.release();
		});
	});
});


module.exports = router;
