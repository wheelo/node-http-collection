// This makes two connections, one to a tcp server, one to an http server (both in server.js)
// It fires off a bunch of connections and times the response

// Both send strings.

const net = require(`net`);
const http = require(`http`);

function parseIncomingMessage(res) {
  return new Promise((resolve) => {
    let data = ``;

    res.on(`data`, (chunk) => {
      data += chunk;
    });

    res.on(`end`, () => resolve(data));
  });
}

const testLimit = 5000;


/*  ------------------  */
/*  --  NET client  --  */
/*  ------------------  */
function testNetClient() {
  const netTest = {
    startTime: process.hrtime(),
    responseCount: 0,
    testCount: 0,
    payloadData: {
      type: `millipede`,
      feet: 100,
      test: 0,
    },
  };

  function handleSocketConnect() {
    netTest.payloadData.test++;
    netTest.payloadData.feet++;

    const payload = JSON.stringify(netTest.payloadData);

    this.end(payload, `utf8`);
  }

  function handleSocketData() {
    netTest.responseCount++;

    if (netTest.responseCount === testLimit) {
      const hrDiff = process.hrtime(netTest.startTime);
      const elapsedTime = hrDiff[0] * 1e3 + hrDiff[1] / 1e6;
      const requestsPerSecond = (testLimit / (elapsedTime / 1000)).toLocaleString();

      console.info(`net.Server handled an average of ${requestsPerSecond} requests per second.`);
    }
  }

  while (netTest.testCount < testLimit) {
    netTest.testCount++;
    const socket = net.connect(8888, handleSocketConnect);
    socket.on(`data`, handleSocketData);
  }
}


/*  -------------------  */
/*  --  HTTP client  --  */
/*  -------------------  */
function testHttpClient() {
  const httpTest = {
    startTime: process.hrtime(),
    responseCount: 0,
    testCount: 0,
  };

  const payloadData = {
    type: `centipede`,
    feet: 100,
    test: 0,
  };

  const options = {
    hostname: `localhost`,
    port: 8080,
    method: `POST`,
    headers: {
      'Content-Type': `application/x-www-form-urlencoded`,
    },
  };

  function handleResponse(res) {
    parseIncomingMessage(res).then(() => {
      httpTest.responseCount++;

      if (httpTest.responseCount === testLimit) {
        const hrDiff = process.hrtime(httpTest.startTime);
        const elapsedTime = hrDiff[0] * 1e3 + hrDiff[1] / 1e6;
        const requestsPerSecond = (testLimit / (elapsedTime / 1000)).toLocaleString();

        console.info(`http.Server handled an average of ${requestsPerSecond} requests per second.`);
      }
    });
  }

  while (httpTest.testCount < testLimit) {
    httpTest.testCount++;
    payloadData.test = httpTest.testCount;
    payloadData.feet++;

    const payload = JSON.stringify(payloadData);

    options[`Content-Length`] = Buffer.byteLength(payload);

    const req = http.request(options, handleResponse);
    req.end(payload);
  }
}

/*  --  Start tests  --  */
// flip these occasionally to ensure there's no bias based on order
setTimeout(() => {
  console.info(`Starting testNetClient()`);
  testNetClient();
}, 50);

setTimeout(() => {
  console.info(`Starting testHttpClient()`);
  testHttpClient();
}, 2000);
