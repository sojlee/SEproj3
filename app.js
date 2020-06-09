var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var test = require('./routes/test');
var join = require('./routes/join');
var product = require('./routes/product');
var user = require('./routes/user');
var login = require('./routes/login');
var admin = require('./routes/admin');
var notice = require('./routes/notice');
var register = require('./routes/join');
var detail = require('./routes/detail');
var checkout = require('./routes/checkout');
var cart = require('./routes/cart');

var app = express();

// view engine setup
app.set('views','./views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname+'/public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', test);
app.use('/join', join);
app.use('/product', product);
app.use('/user', user);
app.use('/login', login);
app.use('/register', register);
app.use('/admin', admin);
app.use('/notice', notice);
app.use('/detail', detail);
app.use('/checkout', checkout);
app.use('/cart', cart);

app.use('/hi', (req, res, next)=>{
    res.send('Hi? <img src="./1024.png">');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
