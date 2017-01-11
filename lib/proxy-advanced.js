var http = require('http');
var net = require('net');
var url = require('url');

function connect(cReq, cSock) {
    var u = url.parse('http://' + cReq.url);
    
    // TCP 连接。做TCP客户端，pSock是可读可写流
    var pSock = net.connect(u.port, u.hostname, function() {
        cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        pSock.pipe(cSock);
    }).on('error', function(e) {
        cSock.end();
    });

    cSock.pipe(pSock);
}

// HTTP服务端，建立底层TCP链接，开启了keep-alive。连接建立时触发
http.createServer().on('connect', connect).listen(8888, '0.0.0.0');
