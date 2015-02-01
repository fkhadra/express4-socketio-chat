var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('./io');
var os = require('os');

var routes = require('./routes/index');
var users = require('./routes/users');

var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

var COOKIE_SECRET = "plop-master";
var COOKIE_NAME   = "sid";
var sessionConfig = session(
	{
		name: COOKIE_NAME,
		secret: COOKIE_SECRET,
		resave: false,
		saveUninitialized: true
		//cookie: {secure: true}
	}
);


io.use(function(socket, next){
	sessionConfig(socket.request, socket.request.res, next);
});
app.use(logger('dev'));
app.use(cookieParser(COOKIE_SECRET));
app.use(sessionConfig);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));


app.use(routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
