var http = require("http"),
    fs = require("fs"),
    path = require("path"),
    url = require("url");

var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    var filepath = path.join("/tmp", "wwwroot", pathname);
    var stream = fs.createReadStream(filepath, {flags : "r", encoding : null});
    stream.on("error", function() {
        res.writeHead(404);
        res.end();
    });
    stream.pipe(res);
});
server.on("error", function(error) {
    console.log(error);
});
server.listen(8088, "127.0.0.1");

