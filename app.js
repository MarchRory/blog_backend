var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { isRevoked } = require('./utils/token/jwt')
var usersRouter = require('./routes/users/index');
var tagsRouter = require('./routes/tags/index')
var articleRouter = require('./routes/articles/index')
var friRouter = require('./routes/friends/index')
var talkRouter = require('./routes/talk/index')
var frontRouter = require('./routes/front/index')
var { uploadRouter } = require('./routes/upload/index')
const { expressjwt:jwt } = require("express-jwt")
const { tokenSecret } = require('./utils/token/jwt')
var app = express();
var cors = require('cors')
var path = require("path")
app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(jwt({
    secret: tokenSecret,
    algorithms: ["HS256"],   // 加密方式
}).unless({
path: ['/users/login', '/upload', /^\/front\/.*/]
}))
app.use('/front', frontRouter)
app.use('/images', express.static(path.join(__dirname, './uploads')))
app.use('/upload', uploadRouter)
app.use('/users', usersRouter);
app.use('/tags', tagsRouter)
app.use('/article', articleRouter)
app.use('/friends', friRouter)
app.use('/talk', talkRouter)

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
  //res.render('error');
});

module.exports = app;
