"use strict";

/**
 * Module dependencies
 */
const dateFormat			 = require('dateformat');

const { isString, isObject } = require('./helpers');
const Converter 			 = require('./converter');
const dateLocale 			 = require('../resources/i18n/datetime/datetime_EN');

dateFormat.i18n = dateLocale;

const DEFAULT_DATETIME_FORMAT = 'dddd, mmmm dS, yyyy, hh:MM:ss TT';
const DEFAULT_COLORS_PRESET = {
	white: '#ffffff',
	pink: '#ff00ff',
	yellow: '#ffff00',
	green: '#00ff00',
	blue: '#0000ff',
	black: '#000000',
	red: '#f00000',
};

const output = (dateTime, message, ...args) => `Logger => time: ${dateTime}, message: ${message}, args: ${args}`;

const getOutputStyle = (type) => 'color: ' + (DEFAULT_COLORS_PRESET[type] ? DEFAULT_COLORS_PRESET[type] : DEFAULT_COLORS_PRESET['black']);

const getTime = (format, utc = false) => {
	format = isString(format) ? format : DEFAULT_DATETIME_FORMAT;
	return dateFormat(Date.now(), format, utc);
}

const getLocalTime = (format, offset = 0, utc = false) => {
	format = isString(format) ? format : DEFAULT_DATETIME_FORMAT;
	let currentDate = new Date();
	let currentTime = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
	let localCurrentTime = new Date(currentTime + (offset * 3600000));
	return dateFormat(localCurrentTime, format, utc);
};

const tag = (messages, ...args) => {
	let result = '';
	for(let i=0; i<args.length; i++) {
		result += messages[i];
		result += isObject(args[i]) ? Converter.serialize(args[i]) : args[i];
	}
	result += messages[messages.length - 1];
	return result;
};

const tag2 = (messages, ...args) => {
	return messages.reduce((s, v, idx) => {
		return s + (idx > 0 ? (isObject(args[idx-1]) ? Converter.serialize(args[idx-1]) : args[idx-1]) : '') + v;
	}, '');
};

const rawTag = (messages, ...args) => {
	let result = '';
	for(let i=0; i<args.length; i++) {
		result += messages.raw[i];
		result += isObject(args[i]) ? Converter.serialize(args[i]) : args[i];
	}
	result += messages.raw[messages.length - 1];
	return result;
};

const rawTag2 = (messages, ...args) => {
	return messages.reduce((s, v, idx) => {
		return String.raw`s` + (idx > 0 ? (isObject(args[idx-1]) ? Converter.serialize(args[idx-1]) : args[idx-1]) : '') + String.raw`v`;
	}, '');
};

const currencyTag = (symbol, messages, ...args) => {
	return messages.reduce((s, v, idx) => {
		if(idx > 0) {
			if(isNumber(args[idx-1])) {
				s += `${symbol}${args[idx-1].toFixed(2)}`;
			} else {
				s += args[idx-1];
			}
		}
		return s + v;
	}, '');
};

const Logger = (function() {
	
	function Logger() {
		const INSTANCE = Symbol.for('instance');
		
		if(Logger[INSTANCE]) {
			return Logger[INSTANCE];
		}
		
		const debug = (message, ...args) => {
			console.log('%c' + output(getTime(), message, args), getOutputStyle('green'));
		};
		
		const error = (message, ...args) => {
			console.error('%c' + output(getTime(), message, args), getOutputStyle('red'));
		};
		
		const warn = (message, ...args) => {
			console.warn('%c' + output(getTime(), message, args), getOutputStyle('blue'));
		};
		
		const info = (message, ...args) => {
			console.info('%c' + output(getTime(), message, args), getOutputStyle('pink'));
		};
		
		const group = (message, ...args) => {
			console.group(output(getTime(), message));
			console.log(args);
			console.groupEnd();
		};
		
		return Logger[INSTANCE] = {
			debug,
			error,
			warn,
			info,
			group
		};
	};
	
	return Logger();
}());

module.exports = {
	tag,
	rawTag,
	currencyTag,
	Logger
};