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

/*********详细点的post请求***********/
// get请求内容都在请求报头；如果遇到post请求，需要表单，文件提交，JSON上传，需要用户对内容进行接收雨解析

/*
// 判断请求中是否带有内容
var hasBody = function(req) {
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
}

function(req, res) {
    if (hasBody(req)) {
        var buffers = [];
        req.on('data', function (chunk) {
            buffers.push(chunk);
        });

        req.on('end', function () {
            // Buffer中数据暂时放到req.rawBody中
            req.rawBody = Buffer.concat(buffers).toString();
            handle(req, res);            
        });
    } else {
        handle(req, res);
    }
}
*/




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