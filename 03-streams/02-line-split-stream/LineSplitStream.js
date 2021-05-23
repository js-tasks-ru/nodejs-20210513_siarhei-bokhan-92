const stream = require('stream');
const os = require('os');

const lineBreakRegExp = new RegExp(`${os.EOL}`);
const endWithLineBreakRegExp = new RegExp(`${os.EOL}$`);

class LineSplitStream extends stream.Transform {
	#buffer = "";

	constructor(options) {
		super(options);
	}

	_transform(chunk, encoding, callback) {
		const chunkString = chunk.toString();
		this.#buffer += chunkString;

		if (!lineBreakRegExp.test(chunkString)) return callback();

		let lines = this.#buffer.split(os.EOL);
		this.#buffer = endWithLineBreakRegExp.test(chunkString) ? "" : lines.pop();
		lines.forEach(line => this.push(line));

		callback();
	}

	_flush(callback) {
		if (this.#buffer !== "") this.push(this.#buffer);

		callback();
	}
}

module.exports = LineSplitStream;
