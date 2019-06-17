const express = require('express');
const morgan = require('morgan');
//const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');
// const history = require('connect-history-api-fallback');

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let boardsRouter = require('../routes/boards');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(busboy());
app.use(busboyBodyParser());

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.use(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/', indexRouter);
app.use('/users/', usersRouter);
app.use('/boards/', boardsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


app.use(express.static(path.join(__dirname, '../../client/dist/')));

app.get(/.*/, function (req, res) {
    res.sendFile(__dirname + '../../client/dist/index.html');
});


app.listen(process.env.PORT || 8081);

module.exports = app;






