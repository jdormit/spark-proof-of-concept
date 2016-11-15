/**
 * This module holds a buffer of input data (keystrokes).
 * Input data is stored as objects:
 *
 * {
 *  cursor: {
 *    row: Number,
 *    col: Number
 *  },
 *  value: String | Number
 * }
 *
 * The value field is either a string representing a character
 * or a number representing charcodes or keycodes.
 */
const InputSerializer = function() {
    const self = this;
    let buffer = [];

    self.flushInputBuffer = function() {
        const bufferData = buffer;
        buffer = [];
        return bufferData;
    }

    self.addInput = function(input) {
        buffer.push(input);
    }

    self.getBuffer = function() {
        return buffer;
    }
}

module.exports = InputSerializer;
