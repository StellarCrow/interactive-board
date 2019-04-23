const express = require('express');
const morgan = require('morgan');
//const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const createError = require('http-errors');

let indexRouter = require('../routes/index');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(process.env.PORT || 8081);

module.exports = app;





