// This sets up two servers. A TCP and an HTTP one.
// For each response, it parses the received string as JSON, converts that object and returns a string
const net = require(`net`);
const http = require(`http`);

function renderAnimalString(jsonString) {
  const data = JSON.parse(jsonString);
  return `${data.test}: your are a ${data.type} and you have ${data.feet} feet.`;
}


/*  ------------------  */
/*  --  NET server  --  */
/*  ------------------  */

net
  .createServer((socket) => {
    socket.on(`data`, (jsonString) => {
      socket.end(renderAnimalString(jsonString));
    });
  })
  .listen(8888);


/*  -------------------  */
/*  --  HTTP server  --  */
/*  -------------------  */

function parseIncomingMessage(res) {
  return new Promise((resolve) => {
    let data = ``;

    res.on(`data`, (chunk) => {
      data += chunk;
    });

    res.on(`end`, () => resolve(data));
  });
}

http
  .createServer()
  .listen(8080)
  .on(`request`, (req, res) => {
    parseIncomingMessage(req).then((jsonString) => {
      res.end(renderAnimalString(jsonString));
    });
  });
