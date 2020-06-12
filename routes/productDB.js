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
var app = express();

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
// 이미지 업로드 관련 설정 부분 끝

/* GET users listing. */
router.get('/', function(req, res, next) {
	pool.getConnection(function (err, connection) {
        if(err) throw err;
        // Use the connection
        var sqlForSelectList = "SELECT p_code, p_name, p_desc, p_img, p_price, p_amount, update_date FROM product";
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


module.exports = router;


/*
// 글쓰기 화면 표시 GET
router.get('/write', function(req, res, next){
    res.render("write",{title : "게시판 글 쓰기"});
});

// 글쓰기 로직 처리 POST
router.post('/write', upload.single('imgFile'), function(req,res,next){

    // 이미지를 첨부하는지의 여부 확인
    var imgurl;
    if(req.file)
        imgurl = req.file.filename; // image의 파일명을 불러온다
    else
        imgurl = '';

    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;

    pool.getConnection(function (err, connection) {
        // Use the connection

        var imageurl = imgurl;
        var datas = [creator_id,title,content, imageurl, passwd];
        console.log(datas);

        var sqlForInsertBoard = "insert into board(creator_id, title, content, imageurl, passwd) values(?,?,?,?,?)";
        connection.query(sqlForInsertBoard,datas, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/board');
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });
});

// 글조회 로직 처리 GET
router.get('/read/:idx',function(req, res, next)
{
    var idx = req.params.idx;

    pool.getConnection(function(err, connection)
    {
        var sql = "select idx, creator_id, title, imageurl, content, hit from board where idx=?";
        connection.query(sql,[idx], function(err,row)
        {
            if(err) console.error(err);
            console.log("1개 글 조회 결과 확인 : ",row);
            res.render('read', {title:"글 조회", row:row[0]});
            connection.release();
        });
    });
});

var r_img; // 삭제할 imageurl from board
// 글수정 화면 표시 GET
router.get('/update',function(req,res,next)
{
    var idx = req.query.idx;

    pool.getConnection(function(err, connection)
    {
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select idx, creator_id, title, content, imageurl, hit from board where idx=?";
        connection.query(sql, [idx], function(err,rows)
        {
            if(err) console.error(err);

            r_img = rows[0].imageurl;   // 글삭제/수정할 때 삭제할 이미지의 경로

            console.log("update에서 1개 글 조회 결과 확인 : ",rows);
            res.render('update', {title:"글 수정", row:rows[0]});
            connection.release();
        });
    });
});

// 글수정 로직 처리 POST
router.post('/update', upload.single('imgFile'), function(req, res, next)
{
    // 이미지의 첨부 여부 확인
    var imgurl;
    if(req.file)
        imgurl = req.file.filename; // 수정할 image의 파일명을 불러온다
    else
        imgurl = '';

    var idx = req.body.idx;
    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [creator_id,title,content,imgurl, idx, passwd];

    console.log(imgurl);

    // 기존 이미지 삭제
    if(r_img != '') {
        var remove_path = 'c://mynode/joinForm/uploads/' + r_img;
        fs.unlink(remove_path, (err) => {
        if(err) throw err;

        console.log("삭제한 이미지 명: " + r_img);
         })
    }

    pool.getConnection(function (err, connection) {
        var sql = "update board set creator_id=?, title=?, content=?, imageurl=? where idx=? and passwd=?";
        connection.query(sql, datas, function (err, result) {
            console.log(result);
            if (err) console.error("글 수정 중 에러 발생 err : ", + err);

            if (result.affectedRows == 0)
            {
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>")
            }
            else
            {
                res.redirect('/board/read/'+idx);
            }
            connection.release();
        });
    });
});

// 글삭제 화면 처리 GET
router.get('/delete', function(req, res, next){
    var idx = req.query.idx;

    pool.getConnection(function(err, connection)
    {
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select idx, creator_id, title, content, imageurl, hit from board where idx=?";
        connection.query(sql, [idx], function(err,rows)
        {
            if(err) console.error(err);

            r_img = rows[0].imageurl;   // 글삭제/수정할 때 삭제할 이미지의 경로

            console.log("delete에서 1개 글 조회 결과 확인 : ",rows);
            res.render('delete', {title:"글 삭제", row:rows[0]});
            connection.release();
        });
    });
});

// 글삭제 로직 처리 POST
router.post('/delete', function(req,res,next)
{
    var idx = req.body.idx;
    var passwd = req.body.passwd;
    var datas = [idx, passwd];

    // 해당 이미지 삭제
    if(r_img != '') {
        var remove_path = 'c://mynode/joinForm/uploads/' + r_img;
        fs.unlink(remove_path, (err) => {
        if(err) throw err;

        console.log("삭제한 이미지 명: " + r_img);
         })
    }

    pool.getConnection(function(err,connection) {
        var sql = "delete from board where idx=? and passwd=?";
        connection.query(sql, datas, function (err, result)
        {
            console.log(result);
            if(err) console.error("글 삭제 중 에러 발생 err : ", + err);

            if (result.affectedRows == 0)
            {
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>")
            }
            else
            {
                res.redirect('/board');
            }
            connection.release();
        });
    });
});

module.exports = router;
*/
