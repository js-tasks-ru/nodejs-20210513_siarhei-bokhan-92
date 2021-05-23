const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #byteReadNumber = 0;
  #limit = Infinity;

  constructor(options) {
    super(options);
    this.#limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.#byteReadNumber += chunk.length;

    if (this.#byteReadNumber > this.#limit) return callback(new LimitExceededError());

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
