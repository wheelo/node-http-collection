const http = require('http');
// Create an HTTP server
var srv = http.createServer( (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});
//服务器监听upgrade事件
srv.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');
  //发送消息到服务器端
  socket.pipe(socket); // echo back
});

// now that server is running
srv.listen(7777, '127.0.0.1', () => {
  // make a request
  var options = {
    port: 7777,
    hostname: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  };
  //如果客户端有一个请求到来了，那么马上向服务器发送一个upgrade请求
  var req = http.request(options);
  req.end();
  //客户端接收到upgrade事件，要清楚的知道升级协议不代表上面的http.createServer回调会执行，这个回调函数只有当浏览器访问的时候才会触发
  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});