var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app),

  session = require('express-session');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(
  { secret: '0dc529ba-5051-4cd6-8b67-c9a901bb8bdf',
    resave: false,
    saveUninitialized: false
  }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

var routes = require('./src/routes');
//Importing Handlers

app.use("/", routes);
//Importing Routes

app.listen(port);
console.log("Server running successfully at PORT ", port)
