jsar.utils = {};
//--------------------------------------------------------------
jsar.utils.chainProvider = (function () {
  const that = {};
  // store your callbacks
  const methods = [];
  // keep a reference to your response
  let response = null;
  // all queues start off unflushed
  let flushed = false;
  //
  //var that = Object.create(jsar.utils.chainProvider.prototype);
  //that.prototype = jsar.utils.chainProvider;
  //var isChainProvider = function(x) {
  //	return (x instanceof jsar.utils.chainProvider);
  //};
  that.add = function (fn) {
    // if the queue had been flushed, return immediately
    //otherwise push it on the queue
    if (!jsar.toolset.isFunction(fn)) {
      throw {
        name: 'ValueError',
        message: `incorrect function value < ${fn} >`,
      };
    }
    if (flushed) {
      fn(response);
    } else {
      methods.push(fn);
    }
  };
  that.flush = function (resp) {
    // note: flush only ever happens once
    if (flushed) return;
    // store your response for subsequent calls after flush()
    response = resp;
    // mark that it's been flushed
    flushed = true;
    // shift 'em out and call 'em back
    while (methods[0]) {
      methods.shift()(resp);
    }
  };
  return that;
})();

/*
<script src="jquery.js"></script>
<script src="async-queue.js"></script>
<script>
(function($) {
	$.fn.fetch = function(url) {
		var queue = jsar.utils.chainProvider();
		this.each(function() {
			var el = this;
			queue.add(function(resp) {
				$(el).html(resp);
			});
		});
		$.ajax({
			url: url,
			dataType: 'html',
			success: function(html) {
				queue.flush(html);
			}
		});
		return this;
	};
})(jQuery);
</script>
$("<div/>").fetch('/server/navigation.html').addClass('column').appendTo('#side');
*/
/*
fetchTweet(url).linkify().filterBadWords().appendTo('#status');
function fetchTweet(url) {
	this.queue = jsar.utils.chainProvider();
	this.tweet = "";
	var self = this;
	ajax(url, function(resp) {
		self.tweet = resp;
		self.queue.flush(this);
	});
}
fetchTweet.prototype = {
	linkify: function() {
		this.queue.add(function(self) {
			self.tweet = self.tweet.replace(/\b@(\w{1,20}\b/g, '<a href="...">$1</a>');
		});
		return this;
	},
	filterBadWords: function() {
		this.queue.add(function(self) {
			self.tweet = self.tweet.replace(/\b(fuck|shit|piss)\b/g, "");
		});
		return this;
	},
	appendTo: function(selector) {
		this.queue.add(function(self) {
			$(self.tweet).appendTo(selector);
		});
		return this;
	}
};
*/
