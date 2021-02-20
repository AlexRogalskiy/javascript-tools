//http://javascriptweblog.wordpress.com/2010/06/01/a-tracer-utility-in-2kb/
var tracer = {
  nativeCodeEx: /\[native code\]/,
    indentCount: -4,
    tracing: [],
    traceMe(func, methodName) {
        var traceOn = function() {
                var startTime = +new Date;
                var indentString = " ".repeat(tracer.indentCount += 4);
                console.info(indentString + methodName + '(' + Array.prototype.slice.call(arguments).join(', ') + ')');
                var result = func.apply(this, arguments);
                console.info(indentString + methodName, '-> ', result, "(", new Date - startTime, 'ms', ")");
                tracer.indentCount -= 4;
                return result;
        }
        traceOn.traceOff = func;
        for (var prop in func) {
            traceOn[prop] = func[prop];
        }
        console.log("tracing " + methodName);
        return traceOn;
    },
  traceAll: function (root, recurse) {
    if ((root == window) || !((typeof root == 'object') || (typeof root == 'function'))) {return;}
    }
    for (var key in root) {
      if ((root.hasOwnProperty(key)) && (root[key] != root)) {
                let thisObj = root[key];
                if (typeof thisObj == 'function') {
                    if ((this != root) && !thisObj.traceOff && !this.nativeCodeEx.test(thisObj)) {
                        root[key] = this.traceMe(root[key], key);
                        this.tracing.push({obj:root,methodName:key});
                    }
        }
        recurse && this.traceAll(thisObj, true);
      }
    }
  },
  untraceAll: function() {
        for (let i=0; i<this.tracing.length; ++i) {
            let thisTracing = this.tracing[i];
            thisTracing.obj[thisTracing.methodName] =
                thisTracing.obj[thisTracing.methodName].traceOff;
        }
        console.log('tracing disabled');
    tracer.tracing = [];
  },
};

//tracer.traceAll(jQuery,true);
//>> tracing init
//>> tracing size
//>> tracing toArray
//>> tracing get
//>> tracing pushStack
//>> tracing each
//>> tracing ready
//etc.

//tracer.untraceAll();
//>> tracing disabled

//function add(a,b) {return a + b};
//add = tracer.traceMe(add,'add');
//>> tracing add
//add(2, 4)
//>> add(2,4);
//>> add -> 6 (9 ms)
