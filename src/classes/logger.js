//const globals = (function() {
//	return this;
//}());
//----------------------------------------------------------------------------------------------
(function (globals) {
  'use strict';
  //----------------------------------------------------------------------------------------------
  globals.utils = globals.utils || {};
  //----------------------------------------------------------------------------------------------
  (function () {
    globals.utils.logger = globals.utils.logger || {};
    //----------------------------------------------------------------------------------------------
    const isLogger = value => value instanceof globals.utils.logger.Logger;
    //----------------------------------------------------------------------------------------------
    const LEVEL = (function () {
      const LEVEL = { info: 4, log: 3, debug: 2, error: 1, warn: 0 };

      Object.freeze(LEVEL);
      Object.preventExtensions(LEVEL);

      return LEVEL;
    })();
    //----------------------------------------------------------------------------------------------
    const Logger = (function () {
      let _logLevel = null;
      let _console = null;

      const isLoggerExists = value => !globals.toolset.isNullOrUndefined(_console) && value in _console;

      const isInfoEnabled = () => _logLevel === globals.utils.logger.LEVEL.info;
      const isLogEnabled = () => _logLevel === globals.utils.logger.LEVEL.log;
      const isDebugEnabled = () => _logLevel === globals.utils.logger.LEVEL.debug;
      const isErrorEnabled = () => _logLevel === globals.utils.logger.LEVEL.error;
      const isWarnEnabled = () => _logLevel === globals.utils.logger.LEVEL.warn;

      const that = {};
      that.setLogLevel = function (logLevel) {
        //logLevel && typeof logLevel=='number' && logLevel>=0 && logLevel<=2
        if (!globals.toolset.isIntNumber(logLevel)) {
          throw {
            name: 'TypeError',
            message: `incorrect input argument: {logLevel} is not integer number < ${logLevel} >`,
          };
        }
        if (-1 == Object.values(globals.utils.logger.LEVEL).indexOf(state)) {
          throw globals.exception.argumentException(
            'OutOfBoundsError',
            `incorrect input argument: logLevel < ${logLevel} > is invalid`
          );
        }
        _logLevel = logLevel;
      };
      that.getLogLevel = function () {
        return _logLevel;
      };
      that.info = function () {
        if (!isInfoEnabled() || !isLoggerExists('info')) return;
        const slice = Array.prototype.slice,
          args = slice.apply(arguments, [0]);
        //var args = jQuery.makeArray(arguments);
        _console.info.apply(_console, args);
      };
      that.log = function () {
        if (!isLogEnabled() || !isLoggerExists('log')) return;
        const slice = Array.prototype.slice,
          args = slice.apply(arguments, [0]);
        //var args = jQuery.makeArray(arguments);
        args.unshift(`${new Date().format()} >>>`); //"yyyy-mm-dd ## HH:MM:ss"
        _console.log.apply(_console, args);
      };
      that.debug = function () {
        if (!isDebugEnabled() || !isLoggerExists('debug')) return;
        const slice = Array.prototype.slice,
          args = slice.apply(arguments, [0]);
        //var args = jQuery.makeArray(arguments);
        args.unshift('(App)');
        args.unshift(`< ${new Date()} >`);
        _console.debug.apply(_console, args);
      };
      that.error = function () {
        if (!isErrorEnabled() || !isLoggerExists('error')) return;
        const slice = Array.prototype.slice,
          args = slice.apply(arguments, [0]);
        args.unshift(`${new Date().format()} >>>`); //"yyyy-mm-dd ## HH:MM:ss"
        _console.error.apply(_console, args);
      };
      that.warn = function () {
        if (!isWarnEnabled() || !isLoggerExists('warn')) return;
        const slice = Array.prototype.slice,
          args = slice.apply(arguments, [0]);
        args.unshift(`${new Date().format()} >>>`); //"yyyy-mm-dd ## HH:MM:ss"
        _console.warn.apply(_console, args);
      };
      that.clear = function () {
        if (!isLoggerExists('clear')) return;
        _console.clear();
      };
      that.assert = function (expr) {
        if (!jsar.toolset.isBoolean(expr)) {
          throw jsar.exception.typeException({
            name: 'TypeError',
            message: `incorrect boolean value: < ${expr} >`,
          }); //new TypeError('');
        }
        if (!isLoggerExists('assert')) return;
        const slice = Array.prototype.slice,
          args = slice.apply(arguments, [0]);
        _console.assert.apply(_console, args);
      };

      function Logger() {
        _logLevel = globals.utils.logger.LEVEL.info;
        _console = window.console;
      }
      Logger.prototype = that;

      const _logger = new Logger();
      return _logger;
    })();
    //----------------------------------------------------------------------------------------------
    globals.utils.logger.LEVEL = LEVEL;
    globals.utils.logger.Logger = Logger;
    //----------------------------------------------------------------------------------------------
  })();
})(typeof globals !== 'undefined' ? globals : this);

//globals.utils.logger.Logger.dump(jsar.utils.Logger);
//globals.utils.logger.Logger.log(jsar.utils.Logger);
//globals.utils.logger.Logger.clear();
//globals.utils.logger.Logger.error(jsar.utils.Logger);
//globals.utils.logger.Logger.warn(jsar.utils.Logger);
//globals.utils.logger.Logger.assert(1==2, jsar.utils.Logger);
