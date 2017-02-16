# node-http-collection
I will collect some interesting Node.js HTTP modules in this place. :)


## HTTP Concept
**Grips with HTTP**
- In basic terms, HTTP is a well-designed protocol for networking communicating, which must be abided by millions of computers to communicate. 
- Process: 1.http client asks for a request and create related port 2.http server listens to the request comming from the client at the same port 3.http server returns state and content back to the client.

**What happens when you type url into your browser and press enter?**
- 1.DNS lookup
	- 浏览器搜索自身的DNS缓存
	- 浏览器如果没有找到缓存或缓存已经失效，搜索OS自身的DNS缓存
	- 读取本地HOST文件
	- 浏览器发起一个DNS系统调用
		- 宽带运营商服务器查看本地缓存
		- 运营商服务器发起一个迭代DNS解析的请求
			- 运营商服务器把结果返回操作系统内核同时缓存起来
			- 操作系统把结果返回给浏览器
			- 最终浏览器拿到了请求域名对应的IP地址
- 2.HTTP three-time handshake(after IP address of corresponding url is acquired)
	- 浏览器会以随机端口(arbitrary)向服务器的web程序发起TCP连接请求。(比如Nginx：80)。路由设备->服务器->网卡->web服务端
	- 三次握手，连接建立。连接建立后，浏览器想服务器发送HTTP请求，可以采用HTTP中的GET或POST，可采用HTTP 1.0协议。
- 3.服务器端接收到了这个请求，根据路径参数，经过后端的一些处理之后，把处理后的一个结果数据返回给浏览器，比如html页面。
- 4.浏览器拿到完整的HTML页面代码(字符串)后，解析与渲染页面。一些静态资源如js,css,图片也会以http请求形式同样经过上面的几个步骤。

*Note:http的请求与响应都包含http头与正文信息

*For a more detailed process about the procedures discussed above, you might refer to these blogs:
- [WEB请求处理系列](https://my.oschina.net/xianggao/blog/667621)和[HTTP协议处理流程](http://www.qixing318.com/article/the-http-protocol-handling-process.html)
- [FEX：Under the hood](http://fex.baidu.com/blog/2014/05/what-happen/)
- [Mozilla: Alex](https://github.com/alex/what-happens-when)

## API
**Some important Node.js HTTP APIs**

- http.request(options, callback)
	- return: (Writable) `http.ClientRequest`
		- Event: 'abort, checkExpectation, *connect, continue, response, socket, upgrade'
			- connect: Emitted each time a server responds to a request with a CONNECT method
	- callback: function(req)
		- req: (Readable) `http.IncomingMessage`(1)(http.ClientResponse?)
		- the callback shape is identical to the callback of the 'response' event on 'http.request'. 

*For the http request module, most of time you should use the mature frameworks like [Request](https://github.com/request/request) to handle edge cases and have full features of node's request.

- http.createServer(function (request, response) { })  (it is also the 'request' event on the createServer())
	- Emitted each time there is a request. Note that there may be multiple requests per connection (in the case of keep-alive connections). `request` is an instance of `http. IncomingMessage` and `response` is an instance of `http.ServerResponse`.
		- request: (Readable) `http.IncomingMessage`(2)(http.ServerRequest?). method: method, url, headers, cookie
		- response: (Writable) `http.ServerResponse`. method: wirteHead, g(s)etHeader('Set-Cookie')

	- return: instance of `http.Server`(extends from `net.Server`) 
		- Event: 'connect, connection, request, upgrade, close, listen'
			- connect: Emitted each time a client requests a http `CONNECT` method
			- connection: When a new TCP stream is established. connection(functon(socket)): socket:(an object of type `net.Socket`)


*An IncomingMessage object is created by http.Server or http.ClientRequest and passed as the first argument to the 'request' and 'response' event respectively. It may be used to access response status, headers and data.

- Class: net.Socket
	- (Duplex Stream): an abstraction of a TCP or local socket net.Socket.
They can be created by the user and used as a client (with connect()) or they can be created by Node.js and passed to the user through the 'connection' event of a server.
	- Client
	``
	var client(net.Socket) = net.connect({port: 8124}, function() {
		client.write('')
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
- Node官方文档里面有一处讲到了这个例子：[参考Node代码](https://nodejs.org/docs/latest-v5.x/api/http.html#http_event_connect)。讲解http.ClientRequest中'connect'事件时下面的例子。

![](https://st.imququ.com/i/webp/static/uploads/2015/11/web_tunnel.png.webp)


- **The mature frameworks [Request](https://github.com/request/request#proxies),[node-http-proxy](https://github.com/nodejitsu/node-http-proxy) and [express-http-proxy](https://github.com/villadora/express-http-proxy) have more powerful features to handle the proxy.  You should check them out.**


