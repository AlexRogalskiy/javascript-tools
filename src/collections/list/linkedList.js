(function (globals) {
  'use strict';
  //----------------------------------------------------------------------------------------------
  globals.collections = globals.collections || {};
  //----------------------------------------------------------------------------------------------
  var compare = function (a, b) {
    var hasProperty = function (obj, prop) {
      var proto = obj.__proto__ || obj.constructor.prototype;
      return prop in obj || prop in proto || proto[prop] === obj[prop];
    };
    if (a === b) {
      return 0;
    }
    if (typeof a === typeof b) {
      if (hasProperty(a, 'compareTo')) {
        return a.compareTo(b);
      } else {
        return a < b ? -1 : 1; //a.localCompare(b)
      }
    }
    return typeof a < typeof b ? -1 : 1;
  };
  //----------------------------------------------------------------------------------------------
  const isLinkedList = value => value instanceof globals.collections.list.LinkedList;
  //----------------------------------------------------------------------------------------------
  /* @public
   * @module collections
   * @param {Array} spec Input array of items.
   * @param {Function} cmp Optional. A function that defines an
   * alternative sort order. The function should return a negative,
   * zero, or positive value, dep_ending on the arguments.
   * @return {Object} Linked list.
   *
   * @example
   * var mylinkedList = globals.collections.linkedList([1, 4, 5, 5, 6, 7]);
   */
  (function () {
    globals.collections.list = globals.collections.list || {};
    //----------------------------------------------------------------------------------------------
    (function () {
      globals.collections.list.iterator = globals.collections.list.iterator || {};
      //----------------------------------------------------------------------------------------------
      (function () {
        var _head = null;
        var _current = null;
        var _previous = null;
        var _next = null;
        var _index = null;

        var that = {};
        that.hasNext = function () {
          return _current != null; // && _current.getNext() != null);
        };
        that.next = function () {
          if (this.hasNext()) {
            if (_next != null) {
              _previous = _next.getNext();
              _current = _previous.getNext();
              _next = null;
            } else {
              _previous = _current;
              _current = _current.getNext();
            }
            _index++;
            return _previous;
          }
          return (_previous = null);
        };
        that.hasPrevious = function () {
          return _current != null; // && _current.getPrevious() != null);
        };
        that.previous = function () {
          if (this.hasPrevious()) {
            if (_previous != null) {
              _next = _previous.getPrevious();
              _current = _next.getPrevious();
              _previous = null;
            } else {
              _next = _current;
              _current = _current.getPrevious();
            }
            _index--;
            return _next;
          }
          return (_next = null);
        };
        that.nextIndex = function () {
          if (!this.hasNext()) return _index;
          return _index + 1;
        };
        that.previousIndex = function () {
          if (!this.hasPrevious()) return -1;
          return _index - 1;
        };
        that.remove = function () {
          if (_next != null) {
            if (_next != _head && _current != null) {
              _current.setNext(_next.getNext());
              _next.getNext().setPrevious(_current);
              delete _next;
              _next = null;
            } else {
              _head = _next.getNext();
              if (_current == null) _next.getNext().setPrevious(_current);
              else _next.getNext().setPrevious(_next.getNext());
              _current = _head;
              delete _next;
              _next = null;
            }
            return true;
          }
          if (_previous != null) {
            if (_previous != _head && _current != null) {
              _current.setPrevious(_previous.getPrevious());
              _previous.getPrevious().setNext(_current);
              delete _previous;
              _previous = null;
            } else {
              _head = _previous.getNext();
              if (_current == null) _previous.getNext().setPrevious(_current);
              else _previous.getNext().setPrevious(_previous.getNext());
              _current = _head;
              delete _previous;
              _previous = null;
            }
            return true;
          }

          if (_current == null) return false;
          var node = _current;
          if (this.hasPrevious()) {
            _current.getPrevious().setNext(_current.getNext());
          }
          if (this.hasNext()) {
            _current.getNext().setPrevious(_current.getPrevious());
          }
          if (_current == _head && _current.getPrevious() != _head) {
            _head = _current.getNext();
          }
          if (_current == _head && _current.getPrevious() == _head) {
            _head = null;
          }
          _current = _current.hasNext() ? _current.next() : _current.previous();
          delete node;
          return true;
        };
        //set/ add

        function LinkedListIterator(head) {
          _head = head;
          _current = head;
          _previous = null;
          _next = null;
          _index = -1;
        }
        LinkedListIterator.prototype = that;

        globals.collections.list.iterator.LinkedListIterator = LinkedListIterator;
      })();
    })();
    //----------------------------------------------------------------------------------------------
    (function () {
      globals.collections.list.node = globals.collections.list.node || {};
      //----------------------------------------------------------------------------------------------
      (function () {
        var _data = null;
        var _previous = null;
        var _next = null;

        var that = {};
        that.getData = function () {
          return _data;
        };
        that.setData = function (data) {
          _data = Object.clone(data);
        };
        that.getPrevious = function () {
          return _previous;
        };
        that.setPrevious = function (previous) {
          _previous = previous;
        };
        that.getNext = function () {
          return _next;
        };
        that.setNext = function (next) {
          _next = next;
        };
        that.compareTo = function (node) {
          if (node == null) {
            throw {
              name: 'NullPointerError',
              message: 'incorrect input argument: {node} is null  < ' + node + ' >',
            };
          }
          if (!(node instanceof globals.collections.list.node.ListNode)) {
            throw {
              name: 'TypeError',
              message: 'incorrect input argument: not ListNode instance  < ' + node + ' >',
            };
          }
          return compare(_data, node.getData());
          //return (_data < node.getData() ? -1 : (_data == node.getData() ? 0 : 1));
        };
        that.equals = function (node) {
          if (node == this) return true;
          if (!(node instanceof globals.collections.list.node.ListNode)) return false;
          //if((node == null) || (node.getClass() != this.getClass())) return false;
          //return (_data === node.getData());// && _next === node.getNext());
          return (
            (_data == node.getData() || (_data != null && _data.equals(node.getData()))) &&
            (_previous == node.getPrevious()() ||
              (_previous != null && _previous.equals(node.getPrevious()))) &&
            (_next == node.getNext() || (_next != null && _next.equals(node.getNext())))
          );
        };
        that.hashCode = function () {
          var hashValue = 11;
          var sfVal = _data == null ? 0 : _data.hashCode();
          hashValue = 31 * hashValue + sfVal;

          sfVal = _previous == null ? 0 : _previous.hashCode();
          hashValue = 31 * hashValue + sfVal;

          sfVal = _next == null ? 0 : _next.hashCode();
          hashValue = 31 * hashValue + sfVal;

          return hashValue;
        };
        that.toString = function () {
          return '(data: {' + _data.toString() + '})';
        };

        function LinkedListNode(data, previous, next) {
          _data = Object.clone(data);
          _previous = previous;
          _next = next;
        }
        LinkedListNode.prototype = that;

        globals.collections.list.node.LinkedListNode = LinkedListNode;
      })();
    })();
    //----------------------------------------------------------------------------------------------
    (function () {
      var _start = null;
      var _end = null;
      var _count = null;

      var isInRange = function (num) {
        return num < _count && num >= 0;
      };

      var that = {};
      //var that = Object.create(globals.collections.list.linkedList);
      //that.prototype = globals.collections.list.linkedList;
      that.add = function (data) {
        if (this.isEmpty()) {
          _start = new globals.collections.linkedlist.node.LinkedListNode(data, null, null);
          _start.setPrevious(_start);
          //_start.setNext(_end);
          _end = _start;
        } else {
          var temp = new globals.collections.linkedlist.node.LinkedListNode(data, null, null);
          //temp.setNext(_end.getNext());
          temp.setPrevious(_end);
          _end.setNext(temp);
          _end = _end.getNext();
        }
        _count++;
      };
      that.addAt = function (data, index) {
        if (!globals.toolset.isIntNumber(index)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input argument: not positive integer number < ' + index + ' >',
          };
        }
        if (!isInRange(index)) {
          throw globals.exception.argumentException(
            'OutOfBoundsError',
            'incorrect input argument: index < ' + index + ' > is out of range {0,' + this.size() + '}'
          );
        }
        var current = _start;
        while (current !== null) {
          if (index-- === 0) {
            if (current === _start) {
              current = new globals.collections.list.node.LinkedListNode(data, null, null);
              current.setNext(_start);
              current.setPrevious(current);
              current.getNext().setPrevious(current);
              _start = current;
              _count++;
              return true;
            }
            if (current === _end) {
              current = new globals.collections.list.node.LinkedListNode(data, null, null);
              current.setNext(_end);
              current.setPrevious(_end.getPrevious());
              current.getNext().setPrevious(current);
              current.getPrevious().setNext(current);
              _count++;
              return true;
            }
            var node = new globals.collections.list.node.LinkedListNode(data, null, null);
            node.setNext(current);
            node.setPrevious(current.getPrevious());
            node.getNext().setPrevious(node);
            node.getPrevious().setNext(node);
            _count++;
            return true;
          }
          current = current.getNext();
        }
        return false;
      };
      that.addFirst = function (node) {
        if (node != null && !(node instanceof globals.collections.list.node.ListNode)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input parameter: node  < ' + node + ' >',
          };
        }
        if (node == null) return false;
        if (this.isEmpty()) {
          _start = node;
          _start.setPrevious(_start);
          _start.setNext(_end);
          _end = _start;
        } else {
          node.setNext(_start);
          node.setPrevious(node);
          node.getNext().setPrevious(node);
          _start = node;
        }
        _count++;
      };
      that.addLast = function (node) {
        if (node != null && !(node instanceof globals.collections.list.node.ListNode)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input parameter: node  < ' + node + ' >',
          };
        }
        if (node == null) return false;
        if (this.isEmpty()) {
          _start = node;
          _start.setPrevious(_start);
          _start.setNext(_end);
          _end = _start;
        } else {
          node.setNext(_end.getNext());
          node.setPrevious(_end);
          node.getPrevious().setNext(node);
          _end = node;
        }
        _count++;
      };
      that.getFirst = function () {
        return _start;
        //return this.item(0);
      };
      that.getLast = function () {
        return _end;
        //return this.item(this.size());
      };
      that.removeFirst = function () {
        if (this.isEmpty()) return null;
        var removed = _start;
        if (_start === _end) {
          _start = _end = null;
        } else {
          _start = _start.getNext();
        }
        var data = removed.getData();
        _count--;
        delete removed;
        return data;
      };
      that.removeLast = function () {
        if (this.isEmpty()) return null;
        var removed = _end;
        if (_start === _end) {
          _start = _end = null;
        } else {
          var current = _start,
            previous;
          while (current !== _end) {
            previous = current;
            current = current.getNext();
          }
          _end = previous;
        }
        var data = removed.getData();
        _count--;
        delete removed;
        return data;
      };
      that.removeAt = function (index) {
        if (!globals.toolset.isIntNumber(index)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input argument: {index} is not positive integer number < ' + index + ' >',
          };
        }
        if (!isInRange(index)) {
          throw globals.exception.argumentException(
            'OutOfBoundsError',
            'incorrect input argument: index < ' + index + ' > is out of range {0,' + this.size() + '}'
          );
        }
        var current = _start;
        var removed = null;
        while (current !== null) {
          if (index-- === 0) {
            if (current === _start) {
              _start = current.getNext();
              _start.setPrevious(_start);
              _count--;
              removed = current.getData();
              delete current;
              return removed;
            }
            if (current === _end) {
              _end = current.getPrevious();
              _end.setNext(null);
              _count--;
              removed = current.getData();
              delete current;
              return removed;
            }
            current.getPrevious().setNext(current.getNext());
            current.getNext().setPrevious(current.getPrevious());
            _count--;
            removed = current.getData();
            delete current;
            return removed;
          }
          current = current.getNext();
        }
        return removed;
      };
      that.addAll = function (list) {
        if (list != null && !(list instanceof globals.collections.list.List)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input argument: {list} not a list  < ' + list + ' >',
          };
        }
        if (list == null) return null;
        list.entries().forEach(function (value) {
          this.add(value);
        });
      };
      that.item = function (index) {
        if (!globals.toolset.isIntNumber(index)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input argument: not positive integer number < ' + i + ' >',
          };
        }
        if (!isInRange(index)) {
          throw globals.exception.argumentException(
            'OutOfBoundsError',
            'incorrect input argument: index < ' + i + ' > is out of range {0,' + this.size() + '}'
          );
        }
        var current = _start;
        while (current !== _end) {
          if (index-- === 0) {
            return current;
          }
          current = current.getNext();
        }
        return null;
      };
      that.addSort = function (data) {
        if (_start === null) {
          _start = new globals.collections.linkedlist.node.LinkedListNode(data, null, null);
          _end = _start;
        } else {
          var current = _start;
          var newNode = new globals.collections.linkedlist.node.LinkedListNode(data, null, null);
          while (current !== null) {
            if (compare(data, current.getData()) < 0) {
              newNode.setNext(current);
              if (current === _start) {
                newNode.setPrevious(null);
                _start = newNode;
              } else {
                current.getPrevious().setNext(newNode);
                newNode.setPrevious(current.getPrevious());
              }
              current.setPrevious(newNode);
              _count++;
              return;
            }
            current = current.getNext();
          }
          newNode.setPrevious(_end);
          _end.setNext(newNode);
          _end = newNode;
          _count++;
        }
      };
      that.toString = function () {
        var res = '[ ';
        res += this.entries().join(', ');
        return res + ']';
      };
      that.entries = function () {
        if (this.isEmpty()) return null;
        var result = globals.toolset.vector(),
          current = _start;
        do {
          result.push(current.getData());
          current = current.getNext();
        } while (current != _start);
        return result;
      };
      that.remove = function (data) {
        if (this.isEmpty()) return false;
        var current = _start;
        do {
          if (compare(current.getData(), data) == 0) {
            current.getPrevious().setNext(current.getNext());
            current.getNext().setPrevious(current.getPrevious());
            if (current == _start && current.getPrevious() != _start) {
              _start = current.getNext();
            }
            if (current == _start && current.getPrevious() == _start) {
              _start = null;
            }
            delete current;
            _count--;
            return true;
          }
          current = current.getNext();
        } while (current != _start);
        return false;
      };
      that.removeAll = function () {
        if (this.isEmpty()) return;
        var current = _start,
          temp;
        do {
          temp = current;
          current = current.getNext();
          delete temp;
        } while (current != _start);
        _start = null;
        _count = 0;
      };
      that.findMToLastElement = function (m) {
        if (!globals.toolset.isIntNumber(m)) {
          throw {
            name: 'ValueError',
            message: 'incorrect input value: < ' + m + ' >',
          };
        }
        if (this.isEmpty()) return;
        var current = _start,
          mBehind;
        for (var i = 0; i < m; i++) {
          if (current.getNext()) {
            current = current.getNext();
          } else {
            return;
          }
        }
        mBehind = _start;
        while (current.getNext()) {
          current = current.getNext();
          mBehind = mBehind.getNext();
        }
        return mBehind;
      };
      that.each = function (func) {
        if (!globals.toolset.isFunction(func)) {
          throw {
            name: 'ValueError',
            message: 'incorrect function value: < ' + func + ' >',
          };
        }
        if (this.isEmpty()) return;
        var current = _start;
        do {
          func(current.getData());
          current = current.getNext();
        } while (current != _start);
      };
      that.isEmpty = function () {
        return _start === null;
      };
      that.has = function (data, func) {
        if (this.isEmpty()) return false;
        var current = _start;
        do {
          if (compare(data, current.getData()) == 0) {
            return true;
          }
          current = current.getNext();
        } while (current != _start);
        return false;
      };
      that.size = function (node) {
        if (node != null && !(node instanceof globals.collections.list.node.ListNode)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input parameter: node  < ' + node + ' >',
          };
        }
        var current = node || _start;
        var index = 0;
        if (this.isEmpty()) return index;
        do {
          index++;
          current = current.getNext();
        } while (current != _start);
        return index;
      };
      that.isLoop = function (node) {
        if (node != null && !(node instanceof globals.collections.list.node.ListNode)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input parameter: node  < ' + node + ' >',
          };
        }
        if (this.isEmpty()) return false;
        node = node || _start;
        var slow = node,
          fast = node.getNext();
        while (true) {
          if (!fast || !fast.getNext()) {
            return false;
          } else if (fast == slow || fast.getNext() == slow) {
            return true;
          } else {
            slow = slow.getNext();
            fast = fast.getNext().getNext();
          }
        }
      };
      that.findBeginning = function () {
        var slow = _start; //node || _start
        var fast = _start; //node || _start

        while (fast != null && fast.getNext() != null) {
          slow = slow.getNext();
          fast = fast.getNext().getNext();
          if (slow == fast) {
            break;
          }
        } //while(fast != _start && fast.getNext() != _start)

        if (fast == null || fast.getNext() == null) {
          //fast == _start && fast.getNext() == _start
          return null;
        }

        slow = _start; //node || _start
        while (slow != fast) {
          slow = slow.getNext();
          fast = fast.getNext();
        }
        return fast;
      };
      that.isRadar = function (node) {
        var result = function (node, result) {
          return { node: node, result: result };
        };

        var isRadar_ = function (head, len) {
          if (head == null || len == 0) {
            //(head.getNext() == _start)
            return result(null, true);
          } else if (len == 1) {
            return result(head.getNext(), true);
          } else if (len == 2) {
            return result(head.getNext().getNext(), compare(head, head.getNext()) == 0);
          }
          var res = isRadar_(head.getNext(), len - 2);
          if (!res.result || res.node == null) {
            return res;
          } else {
            res.result = compare(head.res.node) == 0;
            res.node = res.node.getNext();
            return res;
          }
        };

        if (node != null && !(node instanceof globals.collections.list.node.ListNode)) {
          throw {
            name: 'TypeError',
            message: 'incorrect input parameter: node  < ' + node + ' >',
          };
        }
        var current = node || _start;
        var p = isRadar_(current, this.size(current));
        return p.result;
      };
      that.iterator = function () {
        return new globals.collections.list.iterator.LinkedListIterator(_start);
      };
      that.clone = function () {
        return new globals.collections.list.LinkedList(this.entries(), compare);
      };

      var initialize = function (nodes) {
        if (!globals.toolset.isNull(nodes)) {
          if (!globals.toolset.isArray(nodes)) {
            throw {
              name: 'ValueError',
              message: 'incorrect initialization value: array of elements < ' + nodes + ' >',
            };
          }
          for (var i = 0; i < nodes.length; i++) {
            that.add(nodes[i]); //data.push(element);
          }
        }
      };

      function LinkedList(nodes, cmp) {
        _start = null;
        _end = null;
        _count = 0;
        initialize(nodes);
        compare = globals.toolset.isFunction(cmp) ? cmp : compare;
      }
      LinkedList.prototype = that;

      globals.collections.list.LinkedList = LinkedList;
    })();
    //----------------------------------------------------------------------------------------------
  })();
})(typeof exports !== 'undefined' ? exports : this);
