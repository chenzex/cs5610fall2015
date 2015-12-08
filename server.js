var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var cookieParser  = require('cookie-parser');
var mongoose = require('mongoose');
var server = require('http').createServer(app)
var io = require("socket.io").listen(server);

var connectionString = 'mongodb://localhost/cs5610';


if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

var db = mongoose.connect(connectionString);

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function (req, res) {
    res.redirect('project/client/index.html');
})
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// require("./public/assignment/server/app.js")(app, db, mongoose);
require("./public/project/server/app.js")(app, db, mongoose, passport, LocalStrategy);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var onlineUsers = {};

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    delete onlineUsers[socket.id];
    var msg2 = {
      type: 'refresh',
      onlineUsers: onlineUsers
    }
    io.sockets.emit('user', msg2);
    console.log('user disconnected');
  });
  socket.on('user', function (msg) {
    if (msg.type == 'guestLogin') {
      var user = msg.user;
      user.connId = socket.id;
      onlineUsers[socket.id] = user;
      var msg2 = {
        type: 'refresh',
        onlineUsers: onlineUsers
      }
      socket.emit('user',{
        type: 'login',
        connId: socket.id,
        onlineUsers: onlineUsers
      });
      socket.broadcast.emit('user', msg2);
    }else if(msg.type == 'request'){
      var msg2 = msg;
      msg2.sourceId = socket.id;
      io.sockets.connected[msg.targetId].emit("user", msg2);
    }else if(msg.type == 'group'){
      var msg2 = {
        type : 'group',
        targetId : socket.id
      }
      io.sockets.connected[msg.targetId].emit("user", msg2);
      
    }
  });
  socket.on('chat', function (msg) {
    io.sockets.connected[msg.targetId].emit('chat', msg);
  });
  socket.on('trace', function (trace) {
    io.sockets.connected[trace.targetId].emit('trace', trace);
  });
  socket.on('webrtc', function (msg) {
    var msg2;
    if (msg.type == 'request') {
      msg2 = {
        type: 'request',
        name: msg.name
      }
    } else if (msg.type == 'accept') {
      msg2 = {
        type: 'accept'
      }
    } else if (msg.type == 'close') {
      msg2 = msg;
    } else if (msg.type == 'webrtc') {
      msg2 = msg;
    }
    io.sockets.connected[msg.targetId].emit('webrtc', msg2);
  });
});
server.listen(port, ipaddress, function () {
  console.log( "Listening on " + ipaddress + ", server_port " + port )
});
// app.listen(port, ipaddress);
// server.listen(3000);

