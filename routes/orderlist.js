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
/* GET users listing. */
router.get('/', function(req, res, next) {

    pool.getConnection(function (err, connection) {
          if(err) throw err;
          // Use the connection
          var sqlForSelectList = "SELECT * FROM orders WHERE ship = 0";
          connection.query(sqlForSelectList, function (err, rows){
              if (err) console.error("err : " + err);
              console.log("rows : " + JSON.stringify(rows));
  						var o_num = new Array();
  						var customer = new Array();
  						var c_addr = new Array();
  						var o_date = new Array();

  						for (var i = 0; i < rows.length; i++){
							o_num[i] = rows[i].o_num;
							customer[i] = rows[i].customer;
							c_addr[i] = rows[i].c_addr;
							o_date[i] = rows[i].o_date;
  						}
  						res.render('./admin/orderlist.html', {rows:rows.length, o_num:o_num, customer:customer, c_addr:c_addr, o_date:o_date} );
              connection.release();
              // Don't use the connection here, it has been returned to the pool.
          });
      });
  //}
});


module.exports = router;
