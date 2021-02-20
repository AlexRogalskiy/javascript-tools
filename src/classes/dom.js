jsar.dom = {};
//--------------------------------------------------------------
//Определение координат элемента относительно верхнего угла страницы
jsar.dom.getElementBounds = function(elem) {
	if(!jsar.toolset.isDomElement(elem)) { throw {
											name: 'ValueError',
											message: 'incorrect DOMElement: < ' + elem + ' >'
										};
	}
	var left = elem.offsetLeft;
	var top = elem.offsetTop;
	for (var parent = elem.offsetParent; parent; parent = parent.offsetParent) {
		left += parent.offsetLeft - parent.scrollLeft;
		top += parent.offsetTop - parent.scrollTop;
	}
	return {'left': left, 'top': top, 'width': elem.offsetWidth, 'height': elem.offsetHeight};
};
jsar.dom.getOffset = function(elem) {
	if(!jsar.toolset.isDomElement(elem)) { throw {
											name: 'ValueError',
											message: 'incorrect DOMElement: < ' + elem + ' >'
										};
	}
	var getOffsetSum = function(elem) {
		var top=0, left=0;
		while(elem) {
			top += parseInt(elem.offsetTop);
			left += parseInt(elem.offsetLeft);
			elem = elem.offsetParent;
		}
		return {'top': top, 'left': left};
	};
	var getOffsetRect = function(elem) {
		// (1)
		var box = elem.getBoundingClientRect();
		// (2)
		var body = document.body;
		var docElem = document.documentElement;
		// (3)
		var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		// (4)
		var clientTop = docElem.clientTop || body.clientTop || 0;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		// (5)
		var top  = box.top +  scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;
		return {'top': Math.round(top), 'left': Math.round(left)};
	};
    if (elem.getBoundingClientRect) {
        // "правильный" вариант
        return getOffsetRect(elem);
    } else {
        // пусть работает хоть как-то
        return getOffsetSum(elem);
    }
};
//var elem = document.getElementById('myElement');
//var bounds = jsar.dom.getElementBounds(elem);
//document.writeln('Координаты элемента: ' + 'left, top (' + bounds.left + ',' + bounds.top + ') x ' + 'width, height (' + bounds.width + ',' + bounds.height + ')');
//--------------------------------------------------------------
jsar.dom.cleanNode = function(elem) {
	if(!jsar.toolset.isDomElement(elem)) { throw {
											name: 'ValueError',
											message: 'incorrect DOMElement: < ' + elem + ' >'
										};
	}
	while (elem.firstChild) {
		elem.removeChild(elem.firstChild);
	}
};
var elem = document.getElementById('myElement');
//jsar.dom.cleanNode(elem);
//--------------------------------------------------------------
jsar.dom.eventuality = function(that) {
	var registry = {};
	that.trigger = function(event) {
		var array, func, handler, type = (jsar.toolset.isString(event) ? event : event.type);
		if(Object.prototype.hasOwnProperty.call(registry, type)) {
			array = registry[type];
			for(var i=0; i<array.length; i++) {
				handler = array[i];
				func = handler.method;
				if(typeof func === 'string') {
					func = this[func];
				}
				func.apply(this, handler.parameters || [event]);
			}
		}
		return this;
	};
	that.bind = function(type, method, parameters) {
		var handler = {
			method: method,
			parameters: parameters
		};
		if(Object.prototype.hasOwnProperty.call(registry, type)) {
			registry[type].push(handler);
		} else {
			registry[type] = [handler];
		}
		return this;
	};
	return that;
};
//jsar.dom.eventuality(this);
//this.bind("created", function(event) {alert(event);});
//this.trigger("created");
//--------------------------------------------------------------
var addHandler = function(nodes) {
	var helper = function(i) {
		return function(e) {
			alert(i);
		};
	};
	var i;
	for(i=0; i<nodes.length; i++) {
		nodes[i].onclick = helper(i);
	}
};
//--------------------------------------------------------------
jsar.dom.fade = function(elem, per) {
	if(!jsar.toolset.isDomElement(elem)) { throw {
											name: 'ValueError',
											message: 'incorrect DOMElement: < ' + elem + ' >'
										};
	}
	//
	per = (per == null) ? 100 : (jsar.toolset.isNumber(per) && per > 0) ? per : null;
	if(per == null) throw {name: 'ValueError', message: 'incorrect period value: < ' + per + ' >'};
	//
	var level = 1;
	var step = function() {
		var hex = level.toString(16);
		elem.style.backgroundColor = '#FFFF' + hex + hex;
		if(level < 15) {
			level += 1;
			setTimeout(step, per);
		}
	};
	setTimeout(step, per);
};
//jsar.dom.fade(document.body);
//--------------------------------------------------------------
jsar.dom.getElementsByAttribute = function(elem, att, value) {
	if(!jsar.toolset.isDomElement(elem) || !jsar.toolset.isString(att)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input parameters: DOMElement < ' + elem + ' >, attribute < ' + att + ' >'
																			};
	}
	var res = [];
	var walkDom = function walkDom(node, func) {
		func(node);
		node = node.firstChild;
		while(node) {
			walkDom(node, func);
			node = node.nextSibling;
		}
	};
	walkDom(elem, function(node) {
		var actual = (node.nodeType === 1 && node.getAttribute(att));
		if(jsar.toolset.isString(actual) && (actual === value || !jsar.toolset.isString(value))) {
			res.push(node);
		}
	});
	return res;
};
//var res = jsar.dom.getElementsByAttribute(document.body, '');
//document.writeln(res.length);
//--------------------------------------------------------------
jsar.dom.elem2span = function(elem) {
	if(!jsar.toolset.isDomElement(elem)) { throw {
											name: 'ValueError',
											message: 'incorrect DOMElement: < ' + elem + ' >'
										};
	}
	var span = document.createElement('span');
	while (elem.firstChild) span.appendChild(elem.firstChild);
	elem.parentNode.replaceChild(span, elem);
}
//jsar.dom.elem2span(document.body);
//--------------------------------------------------------------
jsar.dom.testKey = function(e) {
	// Make sure to use event.charCode if available
	var key = (typeof e.charCode === 'undefined' ? e.keyCode : e.charCode);
	// Ignore special keys
	if (e.ctrlKey || e.altKey || key < 32) return true;
	key = String.fromCharCode(key);
	return /\w/.test(key); /*/[\d\.]/*/
};
//--------------------------------------------------------------
jsar.dom.toogle = function(elem) {
	var displayCache = {};
	var isHidden = function(el) {
		var width = el.offsetWidth, height = el.offsetHeight, tr = el.nodeName.toLowerCase() === "tr";
		return (width === 0 && height === 0 && !tr) ? true : ((width > 0 && height > 0 && !tr) ? false : getRealDisplay(el));
	};
	var show = function(el) {
		if (getRealDisplay(el) != 'none') return;
		var old = el.getAttribute("displayOld");
		el.style.display = old || "";
		if ( getRealDisplay(el) === "none" ) {
			var nodeName = el.nodeName, body = document.body, display;
			if ( displayCache[nodeName] ) {
				display = displayCache[nodeName];
			} else {
				var testElem = document.createElement(nodeName);
				body.appendChild(testElem);
				display = getRealDisplay(testElem);
				if (display === "none" ) {
					display = "block";
				}
				body.removeChild(testElem);
				displayCache[nodeName] = display;
			}
			el.setAttribute('displayOld', display);
			el.style.display = display;
		}
	};
	var hide = function(el) {
		if (!el.getAttribute('displayOld')) {
			el.setAttribute("displayOld", el.style.display);
		}
		el.style.display = "none";
	};
	var getRealDisplay = function(el) {
		if (el.currentStyle) {
			return el.currentStyle.display;
		} else if (window.getComputedStyle) {
			var computedStyle = window.getComputedStyle(el, null);
			return computedStyle.getPropertyValue('display');
		}
	};
	if(!jsar.toolset.isDomElement(elem)) { throw {
											name: 'ValueError',
											message: 'incorrect DOMElement: < ' + elem + ' >'
										};
	}
	isHidden(elem) ? show(elem) : hide(elem);
};
//jsar.dom.toogle(document.getElementById('tiigle'));
//--------------------------------------------------------------
jsar.dom.firstAncestor = function(elem, tagName) {
	if(!jsar.toolset.isDomElement(elem) || !jsar.toolset.isString(tagName)) { throw {
																				name: 'ValueError',
																				message: 'incorrect input values: DOMElement < ' + elem + ' >, tag name < ' + tagName + ' >'
																			};
	}
	while(elem = elem.parentNode, elem && (elem.tagName != tagName.toUpperCase()));
	return elem;
}
//document.writeln(jsar.dom.firstAncestor(document.body, 'div'));
//--------------------------------------------------------------
jsar.dom.replaceURLWithHTMLLinks = function(text) {
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(exp, "<a href='$1'>$1</a>"); 
};
//--------------------------------------------------------------
jsar.dom.sortUnorderedList = function(ul, sortDescending) {
    if(jsar.toolset.isString(ul)) {
		ul = document.getElementById(ul);
	}
    // Получаем ячейки списка в массив
    var lis = ul.getElementsByTagName("LI");
    var vals = [];
    for(var i = 0, l = lis.length; i < l; i++) {
		vals.push(lis[i].innerHTML);
	}
    // Сортируем их
    vals.sort();
    // Если в обрятном порядке, то оборачиваем
    if(sortDescending) {
		vals.reverse();
	}
    // Меняем содержимое элементов списка
    for(i = 0, l = lis.length; i < l; i++) {
		lis[i].innerHTML = vals[i];
	}
};
//jsar.dom.sortUnorderedList("list-id"); // Сортируем список с id="list-id" в прямом порядке
//jsar.dom.sortUnorderedList("list-id", true); // В обратном порядке
//--------------------------------------------------------------
jsar.dom.getBodyScrollTop = function() {
	return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
};
//--------------------------------------------------------------
/*
function getEventType(e) {
	if (!e) e = window.event;
	alert(e.type);
}

function(event) {
  // получить объект событие.
  // вместо event лучше писать window.event
  event = event || window.event

  // кросс-браузерно получить target
  var t = event.target || event.srcElement

  alert(t.className)
}

// Обработчик для mouseover
function mouseoverHandler(event) {
	event = event || window.event
	var relatedTarget = event.relatedTarget || event.fromElement
	// для mouseover
	// relatedTarget - элемент, с которого пришел курсор мыши
}
// Обработчик для mouseout
function mouseoutHandler(event) {
	event = event || window.event
	var relTarg = event.relatedTarget || event.toElement
	// для mouseout
	// relatedTarget - элемент, на который перешел курсор мыши
}

function mouseShowHandler(e){
	e = e || window.event

	if (e.pageX == null && e.clientX != null ) { 
		var html = document.documentElement
		var body = document.body
	
		e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
		e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
	}

	
	document.getElementById('mouseX').value = e.pageX
	document.getElementById('mouseY').value = e.pageY
}
if (!e.which && e.button) {
  if (e.button & 1) e.which = 1
  else if (e.button & 4) e.which = 2
  else if (e.button & 2) e.which = 3
}
*/

/*
function removeChildren(node) {
    var children = node.childNodes

    while(children.length) {
        node.removeChild(children[0])
    }
}
function removeChildren(node) {
    var children = node.childNodes

    for(i=children.length; i--; )
        node.removeChild(children[0]);
    }
}
*/
//--------------------------------------------------------------
jsar.dom.getElemText = function(elem) {
	if(!jsar.toolset.isDomElement(elem)) { throw {
											name: 'ValueError',
											message: 'incorrect DOMElement: < ' + elem + ' >'
										};
	}
    jsar.dom.getElemText = (elem.innerText !== undefined) ?
					function(elem) {return elem.innerText} :
					function(elem) {return elem.textContent};
 
    return jsar.dom.getElemText(elem);
};
//--------------------------------------------------------------





