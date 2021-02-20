jsar.utils = {};
//--------------------------------------------------------------
jsar.utils.Event = (function () {
  const that = {};
  let guid = 0;
  //
  //var that = Object.create(jsar.utils.Event.prototype);
  //var isEvent = function(x) {
  //	return (x instanceof jsar.utils.Event);
  //};
  //
  const fixEvent = function (event) {
    event = event || window.event;
    if (event.isFixed) {
      return event;
    }
    event.isFixed = true;
    event.preventDefault =
      event.preventDefault ||
      function () {
        this.returnValue = false;
      };
    event.stopPropagation =
      event.stopPropagaton ||
      function () {
        this.cancelBubble = true;
      };

    if (!event.target) {
      event.target = event.srcElement;
    }

    if (!event.relatedTarget && event.fromElement) {
      event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
    }

    if (event.pageX == null && event.clientX != null) {
      const html = document.documentElement,
        body = document.body;
      event.pageX =
        event.clientX +
        ((html && html.scrollLeft) || (body && body.scrollLeft) || 0) -
        (html.clientLeft || 0);
      event.pageY =
        event.clientY + ((html && html.scrollTop) || (body && body.scrollTop) || 0) - (html.clientTop || 0);
    }

    if (!event.which && event.button) {
      event.which = event.button & 1 ? 1 : event.button & 2 ? 3 : event.button & 4 ? 2 : 0;
    }
    return event;
  };
  /* Вызывается в контексте элемента всегда this = element */
  const commonHandle = function (event) {
    event = fixEvent(event);
    const handlers = this.events[event.type];
    const errors = [];

    for (const g in handlers) {
      try {
        const handler = handlers[g];
        const ret = handler.call(this, event);
        if (ret === false) {
          event.preventDefault();
          event.stopPropagation();
        } //else if ( ret !== undefined) {//Передача результата работы одного обработчика другому
        //	event.result = ret;
        //}
        //if (event.stopNow) break;//Мгновенная остановка обработки события
      } catch (e) {
        errors.push(e);
      }
    }

    if (errors.length == 1) {
      throw errors[0];
    } else if (errors.length > 1) {
      const e = new Error("Multiple errors thrown in handling 'sig', see errors property");
      e.errors = errors;
      throw e;
    }
  };
  that.add = function (elem, type, handler) {
    if (elem.setInterval && elem != window && !elem.frameElement) {
      elem = window;
    }
    if (!handler.guid) {
      handler.guid = ++guid;
    }
    if (!elem.events) {
      elem.events = {};
      elem.handle = function (event) {
        if (typeof event !== 'undefined') {
          return commonHandle.call(elem, event);
        }
      };
    }
    if (!elem.events[type]) {
      elem.events[type] = {};
      if (elem.addEventListener) {
        elem.addEventListener(type, elem.handle, false);
      } else if (elem.attachEvent) {
        elem.attachEvent(`on${type}`, elem.handle);
      }
    }
    elem.events[type][handler.guid] = handler;
  };
  that.remove = function (elem, type, handler) {
    const handlers = elem.events && elem.events[type];
    if (!handlers) return;

    //Удаление всех обработчиков нужного типа.
    if (!handler) {
      for (const handle in handlers) {
        delete events[type][handle];
      }
      return;
    } else {
      if (handlers[handler.guid] != handler) return;
      delete handlers[handler.guid];
      for (var any in handlers) return;
    }

    if (elem.removeEventListener) {
      elem.removeEventListener(type, elem.handle, false);
    } else if (elem.detachEvent) {
      elem.detachEvent(`on${type}`, elem.handle);
    }
    delete elem.events[type];

    for (var any in elem.events) return;
    try {
      delete elem.handle;
      delete elem.events;
    } catch (e) {
      // IE
      elem.removeAttribute('handle');
      elem.removeAttribute('events');
    }
  };
  return that;
})();

//function handler(event) {
//	this.innerHTML = "event.pageX=" + event.pageX;
//}
//jsar.utils.Event.add(elem, 'click', handler);
//jsar.utils.Event.remove(elem, 'click', handler);
