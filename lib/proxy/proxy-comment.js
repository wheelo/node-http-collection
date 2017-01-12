const http = require('http');
const net = require('net');
const url = require('url');
//如果在connect事件和reques事件中都打印log，那么就会发现request在connect之前
// Create an HTTP tunneling proxy
var proxy = http.createServer( (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});
//http.Server的connect事件，Emitted each time a client requests a http CONNECT method
proxy.on('connect', (req, cltSocket, head) => {
  // connect to an origin server
  var srvUrl = url.parse(`http://${req.url}`);
  //获取到请求的URL地址，也就是req.url请求地址
  //console.log(srvUrl);
  //这个对象具有如下的函数签名方法：
  /*
  Url {
    protocol: 'http:',
    slashes: true,
    auth: null,
    host: 'www.google.com:80',
    port: '80',
    hostname: 'www.google.com',
    hash: null,
    search: null,
    query: null,
    pathname: '/',
    path: '/',
    href: 'http://www.google.com:80/' }
  */
  //net.connect方法的返回类型是一个net.Socket类型，同时连接到特定的url
  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    //在http.Server对象的connect事件中第二个参数为一个socket，连接客户端和服务器端
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    //利用双方的socket用于发送消息
    srvSocket.write(head);
    //这个也是一个net.Socket类型
    srvSocket.pipe(cltSocket);
    //readable.pipe(destination[, options])
    cltSocket.pipe(srvSocket);
  });
});

// now that proxy is running
//http.Server开始启动了
proxy.listen(9999, 'localhost', () => {
  // make a request to a tunneling proxy
  var options = {
    port: 9999,
    hostname: 'localhost',
    method: 'CONNECT',//客户端请求一个http的CONNECT方法
    path: 'www.google.com:80'
  };
  var req = http.request(options);
  req.end();
  //客户端请求完毕服务器的CONNECT事件，这时候服务器的connect事件被触发
  req.on('connect', (res, socket, head) => {
    console.log('got connected!');
    // make a request over an HTTP tunnel
    //每次服务器通过CONNECT方法来回应客户端的时候触发
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});