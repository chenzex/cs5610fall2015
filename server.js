var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set("views", __dirname + '\\public')
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    // res.sendfile('hello.html',{ root: __dirname + "/public" });
    res.render('hello');
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ipaddress);