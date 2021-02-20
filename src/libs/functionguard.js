//http://javascriptweblog.wordpress.com/2010/07/19/a-javascript-function-guard/
function FunctionGuard(fn, quietTime, context /*,fixed args*/) {
    this.fn = fn;
    this.quietTime = quietTime || 500;
    this.context = context || null;
    this.fixedArgs = (arguments.length > 3) ? Array.prototype.slice.call(arguments, 3) : [];
};
FunctionGuard.prototype.run = function(/*dynamic args*/) {
    this.cancel(); //clear timer
    var fn = this.fn, context = this.context, args = this.mergeArgs(arguments);
    var invoke = function() {
        fn.apply(context, args);
    }
    this.timer = setTimeout(invoke, this.quietTime); //reset timer
};
FunctionGuard.prototype.mergeArgs = function(dynamicArgs) {
    return this.fixedArgs.concat(Array.prototype.slice.call(dynamicArgs, 0)); 
};
FunctionGuard.prototype.cancel = function() {
    this.timer && clearTimeout(this.timer);
};

//var resizeMonitor = new FunctionGuard(resized);
//window.onresize =  function() {resizeMonitor.run()}

//simple test
//var logWhenDone = new FunctionGuard(window.alert);
//typo...
//logWhenDone.run('testnig');
//within 500ms correct to...
//logWhenDone.run('testing'); //console logs -> 'testing'

//set a fixed param and a time
//var logWhenDone = new FunctionGuard(window.alert, 5000, null, 'hello');
//logWhenDone.run('don\'t log this');
//within 5 seconds add...
//logWhenDone.run('you can log this now'); //console logs -> 'hello you can log this now'


//Requires FunctionGuard utility. 
if (typeof console == "undefined") {alert("show your console and refresh");}

var messageManager = {
    history: [],
    logMessages: function() {
        console.clear ? console.clear() : console.log('----------------------');
        for (var i=0; i<this.history.length; i++) {
            var message = this.history[i];
            var secondsAgo = Math.round(((+new Date) - message.time)/1000);
            console.log(message.text + ' (' + secondsAgo + ' seconds ago via ' + message.via.id + ')');
        }
    },
    addMessage: function(element, text) {
        element.value = '(message logged)';
        element.select();
        var message = {
            text: text,
            time: +new Date,
            via: element
        }
        this.history.push(message);
        this.logMessages();
    }
};

var messager = document.createElement('INPUT');
messager.setAttribute('id', 'inputter');
messager.setAttribute('value', 'what are you doing?');
messager.setAttribute('size', 70);
document.body.appendChild(messager);
messager.select();

var messageMonitor = new FunctionGuard(messageManager.addMessage, 2000, messageManager, messager);
messager.onkeyup = function() {messageMonitor.run(messager.value)};