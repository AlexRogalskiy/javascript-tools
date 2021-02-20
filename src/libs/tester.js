//Auto-generating JavaScript Unit Tests
//http://javascriptweblog.wordpress.com/2010/09/20/auto-generating-javascript-unit-tests/
//tester.testAll(adhocDesigner, {path:'adHocDesigner', debug: true});

Math.max = tester.test(Math.max, {
    customTestBefore: tester.argumentsCountTest);
}
Math.max(1);

alert = tester.test(alert, {customTestBefore: tester.argumentsCountTest});
alert();
//alert: 0 arguments supplied, 1 defined

tester.testAll
@param root {Object} create a test for all functions that are descendants of this object
@param options {Object}:
    path {string} the path of the root object – useful for debugging
    debug {boolean} if true debugger will launch on every test failure
	
tester.test
@param fn {Object} create a test for this function
@param options {Object}:
    customTestBefore {Function} a custom function to be invoked before the original function is invoked
    customTestAfter {Function} a custom function to be invoked after the original function is invoked
    debug {boolean} if true, the script debugger (if installed) will launch on every test failure
	
tester.untestAll
Reverts all test functions to their original functions.

‘before’ tests
@param fn {Function} the original function
@param args {Arguments} the value of the arguments in the current execution scope
@param thisBinding {Object} the ‘this’ value of the current execution scope

‘after’ tests
@param fn {Function} the original function
@param result {Object} the value returned when invoking the original function

var tester = {
    testing: [],
    console: window.console || {log: function(a) {window.status = a}, warn: alert},
 
    defineBaseTests: function() {
        this.baseTestBefore = [this.argumentsDefinedTest, this.thisBindingTest];
        this.baseTestAfter = [this.returnTest];
    },
 
    testAll: function(root, options) {
        if (!root || (root == (function(){return this})())) {
            alert("too many functions to iterate\nspecify a non-global root");  return;
        }
 
        options = options || {};
 
        var testChildren = function(root, path) {
            var nextPath, recurse;
            root && (root.assignedName = path);
 
            for (var key in root) {
                var obj = root[key];
                var objType = typeof obj;
                nextPath = path + (path && ".") + key;
                if ((objType == 'function')) {
                    root[key].assignedName = obj.name || nextPath;
                    root[key].owners = [root];
                    root[key] = tester.test(obj, {debug: options.debug});
                    this.console.log('writing tests for ' + nextPath);
                    tester.testing.push({root:root, key:key});
                } else {
                    recurse =
                        objType == "object" &&
                        obj != root &&
                        ('.' + path + '.').indexOf('.' + key + '.') == -1 &&
                        root.hasOwnProperty(key);
                    recurse && testChildren(obj, nextPath);
                }
            }
        }
        testChildren(root || window, options.path || "");
    },
 
    untestAll : function() {
        for (var i = 0, thisTest; thisTest = this.testing[i]; i++) {
            thisTest.root[thisTest.key] = thisTest.root[thisTest.key].original;
        }
        this.testing = [];
    },
 
    test: function(fn, options) {
        options = options || {};
 
        var fnName = fn.assignedName || fn.name;
 
        if (fn.original && (fn.assignedName != fn.original.assignedName)) {
            //there are multiple references to this function, concat owners
            [].push.apply(fn.original.owners,fn.owners);
        }
 
        //if this is already a test revert to original function and create new test
        fn = fn.original || fn;
 
        var getTestFunction = function(fn, testBefore, testAfter) {
            return function() {
                for (var i=0; i<testBefore.length; i++) {
                    (msg = testBefore[i](fn, arguments, this)) && diagnostic(msg);
                }
                var result = fn.apply(this,arguments);
                for (var i=0; i<testAfter.length; i++) {
                    (msg = testAfter[i](fn, result)) && diagnostic(msg);
                }
                return result;
            }
        }
 
        var diagnostic = function(msg) {
            this.console.warn(fnName + ": " + msg);
            if (options.debug) { debugger }
        };
 
        //build test suite
        !this.baseTestBefore && this.defineBaseTests();
        var testBefore = this.baseTestBefore.slice();
        var testAfter = this.baseTestAfter.slice();     
        options.customTestBefore && testBefore.push(options.customTestBefore);
        options.customTestAfter && testAfter.push(options.customTestAfter);
 
        var testFunction = getTestFunction(fn, testBefore, testAfter);
        testFunction.original = fn;
        for (var prop in fn) {
            testFunction[prop] = fn[prop];
        }
        return testFunction;
    },
 
 
    //LIBRARY OF TESTS
    // 'before' tests take original function, arguments and thisBinding
    argumentsCountTest: function(fn, args, thisBinding) {
            return (args.length < fn.length) &&
                args.length + " arguments supplied, " +  fn.length + " defined";
    },
 
    argumentsDefinedTest: function(fn, args, thisBinding) {
        for (var i=0; args[i] !== undefined; i++);
        return (i != args.length) && "undefined arguments were passed";
    },
 
    thisBindingTest: function(fn, args, thisBinding) {
        //("thisBinding.constructor" checks for constructor functions)
        return !(thisBinding.constructor && (thisBinding.constructor == fn)) &&  
            fn.owners && (!~fn.owners.indexOf(thisBinding)) &&
            "this bound to " + thisBinding + ", but function owner is " +
                fn.owners.pluck('assignedName').join(" OR ");
    },
 
    // 'after' tests take original function, and result of function call
    returnTest: function(fn, result) {
        return (fn.toString().match(/[\s]+return\s[^\s]+;\n[\s]?}$/) && (result === undefined)) &&
            "return value expected";
    },
 
    resultIsNumber: function(fn, result) {
        if (typeof result != 'number') {
            return "expecting number for result, got a " + typeof result;
        }
    }
}
 
//UTILITIES
Array.prototype.pluck = function(prop) {
    for (var i = 0, member, result = []; member = this[i]; i++) {
        result.push(member[prop] || member);
    }
    return result;  
}
 
//new function needed for non ECMA 5 compliant browsers only
Array.prototype.indexOf = [].indexOf || function(member) {
    for (var i = 0, len = this.length; i<len; i++) {
        if (this[i] === member) {
            return i;
        }
    }
    return -1;
}