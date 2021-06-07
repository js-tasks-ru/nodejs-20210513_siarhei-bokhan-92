const {
	Server
} = require('http');
const path = require('path');
const fs = require('fs');
const {
	finished,
} = require('stream');
const LimitSizeStream = require("./LimitSizeStream");
const LimitExceededError = require('./LimitExceededError');

const server = new Server();

server.on('request', (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`)

	switch (req.method) {
		case 'POST':
			return handlePostRequest(url, req, res);

		default:
			res.statusCode = 501;
			res.end('Not implemented');
	}
});

function handlePostRequest(url, req, res) {
	const pathname = url.pathname.slice(1)
	const filepath = path.join(__dirname, 'files', pathname);
	let streamError;

	if (fs.existsSync(filepath)) {
		res.statusCode = 409;
		return res.end();
	}

	if (pathname.includes("/")) {
		res.statusCode = 400;
		return res.end();
	}

	const limitSizeStream = new LimitSizeStream({
		limit: 1e+6
	});
	const writeFileStream = fs.createWriteStream(filepath);
	const errorHandler = error => {
		if (res.finished) return;

		if (error) streamError = error;

		if (error instanceof LimitExceededError) {
			res.statusCode = 413;
		} else {
			res.statusCode = 500;
		}
		res.end();

		limitSizeStream.destroy();
		writeFileStream.destroy();
	};

	limitSizeStream.on("error", errorHandler);
	writeFileStream.on("error", errorHandler);

	req.pipe(limitSizeStream).pipe(writeFileStream);

	finished(writeFileStream, () => {
		if (streamError) fs.unlinkSync(filepath);
		if (!res.finished) {
			res.statusCode = 201;
			res.end();
		}
	})

	req.on('abort', () => {
		if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
	});
}

module.exports = server;
