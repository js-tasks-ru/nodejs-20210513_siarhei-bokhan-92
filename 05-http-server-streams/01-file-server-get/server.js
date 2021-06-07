const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
	switch (req.method) {
		case 'GET':
			return handleGetRequest(req, res);

		default:
			res.statusCode = 501;
			res.end('Not implemented');
	}
});

function handleGetRequest(req, res) {
	const url = new URL(req.url, `http://${req.headers.host}`)
	const pathname = url.pathname.slice(1)
	const filepath = path.join(__dirname, 'files', pathname);

	if (pathname.includes("/")) {
		res.statusCode = 400;
		return res.end();
	}

	if (!fs.existsSync(filepath)) {
		res.statusCode = 404;
		return res.end();
	}

	fs.createReadStream(filepath).pipe(res);
}

module.exports = server;
