/*** config start ***/
var PROXY_PORT = '8888';            //对外端口
/*** config end ***/

var http = require('http');
var https = require('https');
var fs = require('fs');
var net = require('net');
var url = require('url');

function request(cReq, cRes) {
  var u = url.parse(cReq.url);

  var options = {
    hostname : u.hostname, 
    port     : u.port || 80,
    path     : u.path,       
    method   : cReq.method,
    headers  : cReq.headers
  };

  var pReq = http.request(options, function(pRes) {
    cRes.writeHead(pRes.statusCode, pRes.headers);
    pRes.pipe(cRes);
  }).on('error', function(e) {
    cRes.end();
  });

  cReq.pipe(pReq);
}

function connect(cReq, cSock) {
  var u = url.parse('http://' + cReq.url);

  var pSock = net.connect(u.port, u.hostname, function() {
    cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    pSock.pipe(cSock);
  }).on('error', function(e) {
    cSock.end();
  });

  cSock.pipe(pSock);
}

var options = {
  key  : fs.readFileSync('./private.pem'),
  cert : fs.readFileSync('./public.crt')
};

https.createServer(options)
  .on('request', request)
  .on('connect', connect)
  .listen(PROXY_PORT, '0.0.0.0');


  /**
git clone代码后，在代码根目录生成证书公私钥：
``openssl genrsa -out private.pem 2048
openssl req -new -x509 -key private.pem -out public.crt -days 99999
``
第二行命令运行后，需要填写一些证书信息。需要注意的是 Common Name 一定要填写后续提供 HTTPS 服务的域名或 IP，其它信息随意填写。然后把 public.crt 下载到本地，导入到系统受信任根证书列表中。

最后, Node proxy-advanced2


  **/