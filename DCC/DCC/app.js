var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
var passport = require('passport');
var models = require('./server/models');
var http = require('http');
var auto = require('./server/automatic');
var desktop = require('./server/notification/desktop');
var logger = require('morgan');
var email = require('./server/notification/email');


// Init App
var app = express();

var fs = require('fs');

//, httpapp = express()
 // , fs = require('fs')
//, httpapp = express()
 // ,
 // , options = {
//    key: fs.readFileSync('./cert/client.key'),
//    cert: fs.readFileSync('./cert/client.crt'),
//    requestCert: true
//}
// , http = require('http').createServer(httpapp)
//  , server = require('https').createServer(options, app)

//  , io = require('socket.io').listen(server);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // what is this ? It used process ldaps port 636 : open tls then use ssl in server

// set view engine
app.use(expressLayouts);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 10 * 24 * 3600 * 1000
    },
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
//register static dir
app.set('partials', path.join(__dirname, '/client'));
app.use(express.static(path.join(__dirname, '/client')));


//register router
app.use('/', require('./server/routes/index.js'));

//create database tables
// models.sequelize.sync({force:false});

// Set Port
//app.set('port', (process.env.PORT || 8443));
// var server = http.createServer({
app.set('port', (process.env.PORT || 80));
//var server = https.createServer({

//     // key: fs.readFileSync('./etc/apache2/ssl/apache.key'),
//     // cert: fs.readFileSync('./etc/apache2/ssl/apache.crt'),

//     // requestCert: false,
//     // rejectUnauthorized: false
// }, app).listen(app.get('port'), function () {
// });
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
});
//io = require('socket.io').listen(server);
// httpapp.get('*',function(req,res){
//     res.redirect('https://192.168.122.23:443'+req.url)
// })
// server.listen(443);
// http.listen(80);
auto.job_sendEmail.createJobSendEmail();
auto.job_sendEmail.sendMailFeedbackJob();
auto.job_sendEmail.sendMailReminderFeedback();
auto.updateStatusClassRecord.updateStatusClassRecord();
// var io = require('socket.io')(server);
// io.on('connection', function (socket) { });
desktop.createSocketServer(server);

module.exports = server;