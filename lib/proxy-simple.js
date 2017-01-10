var http = require("http");
var url = require("url");

// No. 1 with the concrete event
http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    var urlToProxy = urlObj.query.url;
    if (!urlToProxy) {
        res.statusCode = 400;
        res.end("URL是必须的。");
    }
    else {
        console.log("处理代理请求：" + urlToProxy);
        var parsedUrl = url.parse(urlToProxy);
        var opt = {
            host : parsedUrl.hostname,
            port : parsedUrl.port || 80,
            path : (parsedUrl.pathname || "") + (parsedUrl.search || "") + (parsedUrl.hash || "")
        };
        http.get(opt, function(pres) {
            res.statusCode = pres.statusCode;
            var headers = pres.headers;
            for (var key in headers) {
                res.setHeader(key, headers[key]);
            }
            pres.on("data", function(chunk) {
                res.write(chunk);
            });
            pres.on("end", function() {
                res.end();
            });
        });
    }
}).listen(8088, "127.0.0.1");



// No.2 - More simple one
/*
var net = require('net');

function request(cReq, cRes) {
    var u = url.parse(cReq.url);

    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
        path     : u.path,       
        method     : cReq.method,
        headers     : cReq.headers
    };

    var pReq = http.request(options, function(pRes) {
        cRes.writeHead(pRes.statusCode, pRes.headers);
        pRes.pipe(cRes);
    }).on('error', function(e) {
        cRes.end();
    });

    cReq.pipe(pReq);
}

http.createServer().on('request', request).listen(8888, '0.0.0.0');

*/


