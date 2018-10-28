// Set Up --------------------------------
// npm modules
const express   = require('express');
const app       = express();

app.use(express.static(__dirname + "/views"));  // Directory used by template tool
const port      = process.env.PORT || 9099;

const uuid      = require('uuid/v4');       //Generate random ID
const session   = require('express-session'); //Permit sessions to be performed
const secret    = "884745c3-fb4b-4a39-bbbc-518b9d2d957a"; //Secret for each sessions
const FileStore = require('session-file-store')(session); //Permit session to be performed even when server is shutdown then run again
// const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');  //Parse body content in request
const passport  = require('passport');
const mongoose  = require('mongoose');
const flash     = require('connect-flash');

const configDB  = require('./config/database');

const morgan    = require('morgan');


// Configuration -------------------------
mongoose.connect(configDB.url);


require('./config/passport')(passport); // pass passport for configuration

// app.use(cookieParser());
// app.use(bodyParser);    // DEPRECATED ------
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.set('view engine','ejs');

// app and middleware config
app.use(session({
    // genid: function (req) {return uuid(},//Create a UUID for the session if session unknown
    store: new FileStore(), //Store the actual session to prevent new session when servers reload
    secret: secret,         //Secret for each session
    resave: false,          //
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Routes --------------------------------
require('./app/routes')(app, passport);


// Launch --------------------------------
app.listen(port);
console.log('App listening on port ' + port + ' !');