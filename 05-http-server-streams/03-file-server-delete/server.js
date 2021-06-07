const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'DELETE':
      handleDeleteRequest(req, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function handleDeleteRequest(req, res) {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

	if (pathname.includes("/")) {
		res.statusCode = 400;
		return res.end();
	}

	if (!fs.existsSync(filepath)) {
		res.statusCode = 404;
		return res.end();
	}

  fs.unlink(filepath, error => {
    if (error) res.statusCode = 500;
    res.end();
  });

}

module.exports = server;
