(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("prop-types"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "prop-types"], factory);
	else if(typeof exports === 'object')
		exports["VirtualList"] = factory(require("react"), require("prop-types"));
	else
		root["VirtualList"] = factory(root["react"], root["prop-types"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _propTypes = __webpack_require__(2);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Item = function (_React$PureComponent) {
	  _inherits(Item, _React$PureComponent);

	  function Item() {
	    _classCallCheck(this, Item);

	    return _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
	  }

	  _createClass(Item, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          itemIndex = _props.itemIndex,
	          itemView = _props.itemView,
	          item = _props.item;

	      return _react2.default.createElement(
	        'div',
	        { className: 'VirtualList-item' },
	        _react2.default.cloneElement(itemView, { itemIndex: itemIndex, item: item })
	      );
	    }
	  }]);

	  return Item;
	}(_react2.default.PureComponent);

	var throttle = function throttle(func, wait) {
	  var isFuncQueued = false,
	      timestampOfLastFuncCall = void 0;

	  var doFunc = function doFunc(now) {
	    return (timestampOfLastFuncCall = now) && func();
	  };

	  var later = function later(now) {
	    isFuncQueued = false;
	    !timestampOfLastFuncCall && doFunc(now);
	    now - timestampOfLastFuncCall > wait && doFunc(now);
	  };

	  return function () {
	    return !isFuncQueued && (isFuncQueued = true) && requestAnimationFrame(later);
	  };
	};

	function defaultGetItem(items, index) {
	  return items[index];
	}

	function defaultGetItemKey(item, index) {
	  return index;
	}

	// Public: `VirtualList` is a React component that virtualizes the rendering of its item rows in
	// order to provide an efficient, high performing list view capable of handling a huge number of
	// items.
	//
	// What sets `VirtualList` apart from other virtualized list implementations is that it makes no
	// assumptions about the heights of your individual rows. Instead it makes an informed guess about
	// how many rows it should render based on an average row height of the first 10 item rows. This
	// defines a render "window". Then, as the user scrolls the list, it checks to see which items have
	// scrolled out of view on and slides the window by that many items. This means that you can have
	// arbitrarily sized rows and even rows whose sizes are purely determined by the browser. Thus, you
	// should be able to swap this component in for any vertical list view that is rendered inside some
	// fixed height container.
	//
	// Using `VirtualList` is straightforward. Simply give it an array of items and a component to use
	// as the individual item views. The item view component will be passed `itemIndex` and `item`
	// props representing the index of the item in the array and the item itself.
	//
	//   <VirtualList items={myItemArray}>
	//     <MyItemView />
	//   </VirtualList>
	//
	// The `VirtualList` component must be rendered inside of a fixed size container since it is
	// positioned absolutely with top, right, bottom, and left offsets of 0. The item views are rendered
	// inside of a nested content div. This content div has its top padding set to the average row
	// height times the number of items before the rendered window. The bottom padding is set
	// similarily. This is what creates the scrollable area and causes the browser to add an
	// appropriately sized scrollbar. As the user scrolls through the list and the window is adjusted,
	// the paddings are also adjusted accordingly.

	var VirtualList = function (_React$Component) {
	  _inherits(VirtualList, _React$Component);

	  function VirtualList(props) {
	    _classCallCheck(this, VirtualList);

	    var _this2 = _possibleConstructorReturn(this, (VirtualList.__proto__ || Object.getPrototypeOf(VirtualList)).call(this, props));

	    _this2.state = {
	      winStart: 0,
	      winSize: 10,
	      viewportHeight: 1,
	      avgRowHeight: 1,
	      scrollTop: 0
	    };

	    _this2.onScroll = _this2.onScroll.bind(_this2);
	    if (_this2.props.throttle) _this2.updateScrollPosition = throttle(_this2.updateScrollPosition, 1 / 60 * 1000);
	    _this2.checkForResize = _this2.checkForResize.bind(_this2);
	    return _this2;
	  }

	  // Internal: After the component is mounted we do the following:
	  //
	  // 1. Start a timer to periodically check for resizes of the container. When the container is
	  //    resized we have to adjust the display window to ensure that we are rendering enough items
	  //    to fill the viewport.
	  // 2. Calculate the initial viewport height and display window size by triggering the resize
	  //    handler.
	  // 3. Sample the just rendered row heights to get an average row height to use while handling
	  //    scroll events.


	  _createClass(VirtualList, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._resizeTimer = setInterval(this.checkForResize, this.props.resizeInterval);
	      this.handleResize();
	      this.sampleRowHeights();
	    }

	    // Internal: After the component is updated we do the following:
	    //
	    // 1. Invoke the `onFirstVisibleItemChange` callback if the first visible item has changed since
	    //    the last update.
	    // 2. Re-sample row heights if we have fewer items than the display window size.
	    // 3. Sync the components `scrollTop` state property with the node's `scrollTop` property. This is
	    //    necessary to keep scrolling smooth as we add or remove rows whose heights differ from the
	    //    average row height.

	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      var node = this.node;
	      var childNodes = this.content.childNodes;
	      var _state = this.state,
	          winSize = _state.winSize,
	          scrollTop = _state.scrollTop;


	      this.notifyFirstVisibleItemIfNecessary();

	      if (childNodes.length < winSize) {
	        this.sampleRowHeights();
	      }

	      if (node.scrollTop !== scrollTop) {
	        node.scrollTop = scrollTop;
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      clearInterval(this._resizeTimer);
	    }
	  }, {
	    key: 'checkForResize',
	    value: function checkForResize() {
	      var clientHeight = this.node.clientHeight;
	      var viewportHeight = this.state.viewportHeight;


	      if (clientHeight !== viewportHeight) {
	        this.handleResize();
	      }
	    }

	    // Internal: When the container node has been resized we need to adjust the internal
	    // `viewportHeight` and `winSize` state properties. This will ensure that we are always rendering
	    // enough rows to fill the viewport.

	  }, {
	    key: 'handleResize',
	    value: function handleResize() {
	      var node = this.node;
	      var avgRowHeight = this.state.avgRowHeight;

	      var viewportHeight = node.clientHeight;
	      var winSize = Math.ceil(viewportHeight / avgRowHeight) + this.props.buffer;
	      if (viewportHeight !== this.state.viewportHeight || winSize !== this.state.winSize) {
	        this.setState({ viewportHeight: viewportHeight, winSize: winSize });
	      }
	    }
	  }, {
	    key: 'sampleRowHeights',
	    value: function sampleRowHeights() {
	      var node = this.node;
	      var childNodes = this.content.childNodes;

	      if (childNodes.length) {
	        var totalHeight = 0;
	        for (var i = 0; i < childNodes.length; i++) {
	          totalHeight += childNodes[i].offsetHeight;
	        }
	        var avgRowHeight = totalHeight / childNodes.length;
	        var winSize = Math.ceil(node.clientHeight / avgRowHeight) + this.props.buffer;
	        if (avgRowHeight !== this.state.avgRowHeight || winSize !== this.state.winSize) {
	          this.setState({ avgRowHeight: avgRowHeight, winSize: winSize });
	        }
	      }
	    }
	  }, {
	    key: 'notifyFirstVisibleItemIfNecessary',
	    value: function notifyFirstVisibleItemIfNecessary() {
	      if (!this.props.onFirstVisibleItemChange) {
	        return;
	      }

	      var first = this.findFirstVisibleItem();

	      if (this._first !== first) {
	        this.props.onFirstVisibleItemChange(first);
	        this._first = first;
	      }
	    }
	  }, {
	    key: 'findFirstVisibleItem',
	    value: function findFirstVisibleItem() {
	      var childNodes = this.content.childNodes;
	      var items = this.props.items;
	      var _state2 = this.state,
	          winStart = _state2.winStart,
	          scrollTop = _state2.scrollTop;


	      for (var i = 0; i < childNodes.length; i++) {
	        if (childNodes[i].offsetTop + childNodes[i].offsetHeight >= scrollTop) {
	          return items[winStart + i];
	        }
	      }

	      return undefined;
	    }
	  }, {
	    key: 'handleDownwardScroll',
	    value: function handleDownwardScroll(delta, callback) {
	      var childNodes = this.content.childNodes;
	      var items = this.props.items;
	      var _state3 = this.state,
	          winSize = _state3.winSize,
	          avgRowHeight = _state3.avgRowHeight;

	      var maxWinStart = Math.max(0, items.length - winSize);
	      var _state4 = this.state,
	          winStart = _state4.winStart,
	          scrollTop = _state4.scrollTop;


	      scrollTop += delta;

	      for (var i = 0; i < childNodes.length; i++) {
	        if (winStart < maxWinStart && childNodes[i].offsetTop + childNodes[i].offsetHeight < scrollTop) {
	          winStart++;
	          scrollTop += avgRowHeight - childNodes[i].offsetHeight;
	        } else {
	          break;
	        }
	      }

	      scrollTop = Math.round(scrollTop);

	      this.setState({ winStart: winStart, scrollTop: scrollTop }, callback);
	    }
	  }, {
	    key: 'handleUpwardScroll',
	    value: function handleUpwardScroll(delta, callback) {
	      var _this3 = this;

	      var node = this.node;
	      var childNodes = this.content.childNodes;
	      var _state5 = this.state,
	          winStart = _state5.winStart,
	          scrollTop = _state5.scrollTop;

	      var n = 0;

	      scrollTop += delta;

	      for (var i = childNodes.length - 1; i >= 0; i--) {
	        if (winStart > 0 && childNodes[i].offsetTop - scrollTop > node.offsetHeight) {
	          winStart--;
	          n++;
	        } else {
	          break;
	        }
	      }

	      this.setState({ winStart: winStart, scrollTop: scrollTop }, function () {
	        var childNodes = _this3.content.childNodes;
	        var avgRowHeight = _this3.state.avgRowHeight;
	        var scrollTop = _this3.state.scrollTop;


	        for (var _i = 0; _i < n; _i++) {
	          scrollTop -= avgRowHeight - childNodes[_i].offsetHeight;
	        }

	        scrollTop = Math.round(scrollTop);

	        _this3.setState({ scrollTop: scrollTop }, callback);
	      });
	    }
	  }, {
	    key: 'handleLongScroll',
	    value: function handleLongScroll(delta, callback) {
	      var items = this.props.items;
	      var _state6 = this.state,
	          winSize = _state6.winSize,
	          avgRowHeight = _state6.avgRowHeight;
	      var scrollTop = this.state.scrollTop;

	      var maxWinStart = Math.max(0, items.length - winSize);
	      scrollTop += delta;
	      this.setState({
	        winStart: Math.min(maxWinStart, Math.floor(scrollTop / avgRowHeight)), scrollTop: scrollTop
	      }, callback);
	    }
	  }, {
	    key: 'scroll',
	    value: function scroll(delta, callback) {
	      var viewportHeight = this.state.viewportHeight;


	      if (Math.abs(delta) > viewportHeight) {
	        this.handleLongScroll(delta, callback);
	      } else if (delta > 0) {
	        this.handleDownwardScroll(delta, callback);
	      } else if (delta < 0) {
	        this.handleUpwardScroll(delta, callback);
	      }

	      return this;
	    }
	  }, {
	    key: 'scrollToIndex',
	    value: function scrollToIndex(index, callback) {
	      var items = this.props.items;
	      var _state7 = this.state,
	          winSize = _state7.winSize,
	          avgRowHeight = _state7.avgRowHeight;

	      var maxWinStart = Math.max(0, items.length - winSize);
	      var winStart = Math.min(maxWinStart, index);
	      var scrollTop = winStart * avgRowHeight;

	      this.setState({ winStart: winStart, scrollTop: scrollTop }, callback);
	    }
	  }, {
	    key: 'scrollToItem',
	    value: function scrollToItem(item, callback) {
	      var index = this.props.items.indexOf(item);

	      if (index >= 0) {
	        this.scrollToIndex(index, callback);
	      }

	      return this;
	    }
	  }, {
	    key: 'scrollToTop',
	    value: function scrollToTop(callback) {
	      return this.scrollToIndex(0, callback);
	    }

	    // Public: Invoke this method whenever the `items` array has been mutated to cause the list to
	    // sync up the display window and re-render.
	    //
	    // callback - An optional function to call once rendering has occurred.
	    //
	    // Returns the receiver.

	  }, {
	    key: 'itemsMutated',
	    value: function itemsMutated(callback) {
	      var items = this.props.items;
	      var _state8 = this.state,
	          winStart = _state8.winStart,
	          winSize = _state8.winSize;

	      var maxWinStart = Math.max(0, items.length - winSize);

	      if (winStart > maxWinStart) {
	        this.setState({ winStart: maxWinStart }, callback);
	      } else {
	        this.forceUpdate(callback);
	      }

	      return this;
	    }
	  }, {
	    key: 'onScroll',
	    value: function onScroll(e) {
	      e.persist();
	      if (e.target.scrollTop === this.state.scrollTop) {
	        this.props.onScroll && this.props.onScroll(e);
	      }
	      this.updateScrollPosition();
	    }
	  }, {
	    key: 'updateScrollPosition',
	    value: function updateScrollPosition() {
	      var node = this.node;
	      var scrollTop = this.state.scrollTop;


	      if (node.scrollTop !== scrollTop) {
	        this.scroll(node.scrollTop - scrollTop);
	      }
	      this.props.onScroll && this.props.onScroll(e);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this4 = this;

	      var _props2 = this.props,
	          items = _props2.items,
	          getItem = _props2.getItem,
	          getItemKey = _props2.getItemKey,
	          scrollbarOffset = _props2.scrollbarOffset;
	      var _state9 = this.state,
	          winStart = _state9.winStart,
	          winSize = _state9.winSize,
	          avgRowHeight = _state9.avgRowHeight;

	      var winEnd = Math.min(items.length - 1, winStart + winSize - 1);
	      var paddingTop = winStart * avgRowHeight;
	      var paddingBottom = (items.length - winStart - winSize) * avgRowHeight;
	      var style = Object.assign({
	        position: 'absolute',
	        top: 0,
	        right: scrollbarOffset,
	        bottom: 0,
	        left: 0,
	        overflowY: 'auto'
	      }, this.props.style);
	      var contentStyle = { paddingTop: paddingTop, paddingBottom: paddingBottom, marginRight: -scrollbarOffset };
	      var itemView = _react2.default.Children.only(this.props.children);
	      var itemNodes = [];
	      var item = void 0;

	      for (var i = winStart; i <= winEnd; i++) {
	        item = getItem(items, i);
	        itemNodes.push(_react2.default.createElement(Item, { key: getItemKey(item, i), itemIndex: i, itemView: itemView, item: item }));
	      }

	      return _react2.default.createElement(
	        'div',
	        { ref: function ref(node) {
	            _this4.node = node;
	          }, className: 'VirtualList', tabIndex: '-1', style: style, onScroll: this.onScroll },
	        _react2.default.createElement(
	          'div',
	          { ref: function ref(content) {
	              _this4.content = content;
	            }, className: 'VirtualList-content', style: contentStyle },
	          itemNodes
	        )
	      );
	    }
	  }]);

	  return VirtualList;
	}(_react2.default.Component);

	VirtualList.propTypes = {
	  // An array of model items to render into the list. This is the only required prop.
	  items: _propTypes2.default.array.isRequired,

	  // Provide a function to access an item from the `items` array. Gets passed the `items` prop
	  // and an index. The default implementation simply uses the `[]` operator. This exists to work
	  // with an array object that is capable of paging itself such as the one provided by the
	  // Transis library.
	  getItem: _propTypes2.default.func,

	  // Provide a function to generate a react key for each item. Gets passed the item and its index.
	  // The default simply returns the index.
	  getItemKey: _propTypes2.default.func,

	  // Provide a callback function to be invoked whenever the first visible item changes due to a
	  // scroll event.
	  onFirstVisibleItemChange: _propTypes2.default.func,

	  // Provide a callback function that is invoked whenever the container is scrolled.
	  onScroll: _propTypes2.default.func,

	  // Specify the number of buffer items to use in the display window. The virtual list will make
	  // its best attempt to determine the minimum number of items necessary to fill the viewport and
	  // then add this amount to that. The default value is 4.
	  buffer: _propTypes2.default.number,

	  // Offset the scrollbar by the number of pixels specified. The default is 0.
	  scrollbarOffset: _propTypes2.default.number,

	  // Specify how often to check for a resize of the component in milliseconds. The virtual list
	  // must recompute its window size when the component is resized because it may no longer be
	  // large enough to fill the viewport. Default is 1000ms.
	  resizeInterval: _propTypes2.default.number,

	  // Style object applied to the container.
	  style: _propTypes2.default.object,

	  // Specify whether to throttle how often scroll events should update scroll position
	  throttle: _propTypes2.default.bool
	};

	VirtualList.defaultProps = {
	  getItem: defaultGetItem,
	  getItemKey: defaultGetItemKey,
	  buffer: 4,
	  scrollbarOffset: 0,
	  resizeInterval: 1000,
	  throttle: false
	};

	module.exports = VirtualList;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;