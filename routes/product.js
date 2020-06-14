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
	pool.getConnection(function (err, connection) {
				if(err) throw err;
				// Use the connection
				var sqlForSelectList = "select * from product where p_code < 2000";
				connection.query(sqlForSelectList, function (err, rows){
						if (err) console.error("err : " + err);
						console.log("rows : " + JSON.stringify(rows));
						var p_code = new Array();
						var p_name = new Array();
						var p_desc = new Array();
						var p_price = new Array();
						var img = new Array();
						for(var i = 0; i < rows.length; i ++){
							p_code[i] = rows[i].p_code;
							p_name[i] = rows[i].p_name;
							p_desc[i] = rows[i].p_desc;
							p_price[i] = rows[i].p_price;
							img[i] = rows[i].product_img;
						}
						res.render('./shop/shop_01.html', {session:req.session, p_code:p_code, p_name:p_name, p_desc:p_desc, p_price:p_price, img:img});
						connection.release();

						// Don't use the connection here, it has been returned to the pool.
				});
		});
});


module.exports = router;
