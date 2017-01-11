// 1.获取get参数
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res){
    var urlObj = url.parse(req.url);
    var query = urlObj.query;
    var queryObj = querystring.parse(query);

    console.log( JSON.stringify(queryObj) );

    res.end('ok');
});

server.listen(3000);

//{"nick":"chyingp","hello":"world"}





// 2.获取post参数
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res){

    var body = '';  
    req.on('data', function(thunk){
        body += thunk;
    });

    req.on('end', function(){
        console.log( 'post body is: ' + body );
        res.end('ok');
    }); 
});

server.listen(3000);

/*
curl -d 'nick=casper&hello=world' http://127.0.0.1:3000
echo: post body is: nick=casper&hello=world
``
request body:
POST / HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/x-www-form-urlencoded
Cache-Control: no-cache

nick=casper&hello=world

``
*/