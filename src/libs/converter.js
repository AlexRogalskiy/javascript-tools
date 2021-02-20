'use strict';

/**
 * Module dependencies
 */
const { isFunction } = require('./helpers');

const DEFAULT_INDENT_SPACE = 4;

const Converter = {
  serialize(obj, callback) {
    callback = isFunction(callback) ? callback : '';
    return JSON.stringify(obj, callback, DEFAULT_INDENT_SPACE);
  },

  unserialize(obj, callback) {
    callback = isFunction(callback) ? callback : '';
    return JSON.parse(obj, callback);
  },
};

module.exports = Converter;
