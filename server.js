var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
require("./public/assignment/server/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);