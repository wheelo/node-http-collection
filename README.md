# node-http-collection
I will collect some interesting http modules in this place. :)


## 接口API
一些重要API

- http.request(options, callback)
	- return: (Writable) http.ClientRequest
	- callback: function(req)
		- req: (Readable) http.IncomingMessage(1)

- http.createServer(function (request, response) { })
	- request: (Readable) IncomingMessage(2)
	- response: (Writable) http.ServerResponse
	- return: instance of http.Server(extends from net.Server) 
		- Event: 'connection, listen, close, upgrade, (request)'

- Class: net.Socket
	- (Duplex Stream): an abstraction of a TCP or local socket net.Socket.
They can be created by the user and used as a client (with connect()) or they can be created by Node.js and passed to the user through the 'connection' event of a server.
		- Client
		``
		var client(net.Socket) = net.connect({port: 8124}, function() {
			client.wirte('')
		})
		client.on('data')
		``
		- Server
		``
		net.createServer().on('connection', function(socket) {
			socket.on('data')
			socket.on('end')
		})
		``


## 两种代理
**普通代理**：HTTP权威指南(6)-「代理」

- HTTP 客户端向代理发送请求报文，代理服务器需要正确地处理请求和连接（例如正确处理 Connection: keep-alive），同时向服务器发送请求，并将收到的响应转发给客户端。
- [RFC 7230 - HTTP/1.1: Message Syntax and Routing](http://tools.ietf.org/html/rfc7230)（即修订后的 RFC 2616，HTTP/1.1 协议的第一部分）描述的普通代理。这种代理扮演的是「中间人」角色，对于连接到它的客户端来说，它是服务端；对于要连接的服务端来说，它是客户端。它就负责在两端之间来回传送 HTTP 报文。

![](https://st.imququ.com/i/webp/static/uploads/2015/11/web_proxy.png.webp)


**隧道代理**: HTTP权威指南(8)-「集成点：网关、隧道及中继」- 8.5「隧道」

- HTTP 客户端通过 CONNECT 方法请求隧道代理创建一条到达任意目的服务器和端口的 TCP 连接，并对客户端和服务器之间的后继数据进行盲转发。
- [Tunneling TCP based protocols through Web proxy servers](https://tools.ietf.org/html/draft-luotonen-web-proxy-tunneling-01)（通过 Web 代理服务器用隧道方式传输基于 TCP 的协议）描述的隧道代理。它通过 HTTP 协议正文部分（Body）完成通讯，以 HTTP 的方式实现任意基于 TCP 的应用层协议代理。这种代理使用 HTTP 的 CONNECT 方法建立连接，但 CONNECT 最开始并不是 RFC 2616 - HTTP/1.1 的一部分，直到 2014 年发布的 HTTP/1.1 修订版中，才增加了对 CONNECT 及隧道代理的描述，详见 [RFC 7231 - HTTP/1.1: Semantics and Content](https://tools.ietf.org/html/rfc7231#section-4.3.6)。
- Node官方文档里面有一处讲到了这个例子：[参考Node代码](https://nodejs.org/docs/latest-v5.x/api/http.html#http_class_http_server)。讲解http.ClientRequest中'connect'事件时下面的例子。

![](https://st.imququ.com/i/webp/static/uploads/2015/11/web_tunnel.png.webp)


