(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["VirtualList"] = factory(require("React"));
	else
		root["VirtualList"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Item = _react2.default.createClass({
	  displayName: 'Item',
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
	    return this.props.item !== nextProps.item;
	  },
	  render: function render() {
	    var _props = this.props;
	    var itemIndex = _props.itemIndex;
	    var itemView = _props.itemView;
	    var item = _props.item;

	    return _react2.default.createElement(
	      'div',
	      { className: 'VirtualList-item' },
	      _react2.default.cloneElement(itemView, { itemIndex: itemIndex, item: item })
	    );
	  }
	});

	function defaultGetItem(items, index) {
	  return items[index];
	}

	function defaultGetItemKey(item, index) {
	  return index;
	}

	var VirtualList = _react2.default.createClass({
	  displayName: 'VirtualList',

	  propTypes: {
	    items: _react2.default.PropTypes.array.isRequired,
	    getItem: _react2.default.PropTypes.func,
	    getItemKey: _react2.default.PropTypes.func,
	    onFirstVisibleItemChange: _react2.default.PropTypes.func,
	    buffer: _react2.default.PropTypes.number,
	    scrollbarOffset: _react2.default.PropTypes.number,
	    resizeInterval: _react2.default.PropTypes.number
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      getItem: defaultGetItem,
	      getItemKey: defaultGetItemKey,
	      buffer: 4,
	      scrollbarOffset: 0,
	      resizeInterval: 1000
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      winStart: 0,
	      winSize: 10,
	      viewportHeight: 1,
	      avgRowHeight: 1,
	      scrollTop: 0
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    this._resizeTimer = setInterval(this.checkForResize, this.props.resizeInterval);
	    this.handleResize();
	    this.sampleRowHeights();
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    var _refs = this.refs;
	    var node = _refs.node;
	    var childNodes = _refs.content.childNodes;
	    var _state = this.state;
	    var winSize = _state.winSize;
	    var scrollTop = _state.scrollTop;


	    this.notifyFirstVisibleItemIfNecessary();

	    if (childNodes.length < winSize) {
	      this.sampleRowHeights();
	    }

	    if (node.scrollTop !== scrollTop) {
	      node.scrollTop = scrollTop;
	    }
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    clearInterval(this._resizeTimer);
	  },
	  checkForResize: function checkForResize() {
	    var clientHeight = this.refs.node.clientHeight;
	    var viewportHeight = this.state.viewportHeight;


	    if (clientHeight !== viewportHeight) {
	      this.handleResize();
	    }
	  },
	  handleResize: function handleResize() {
	    var node = this.refs.node;
	    var avgRowHeight = this.state.avgRowHeight;

	    var viewportHeight = node.clientHeight;
	    var winSize = Math.ceil(viewportHeight / avgRowHeight) + this.props.buffer;
	    if (viewportHeight !== this.state.viewportHeight || winSize !== this.state.winSize) {
	      this.setState({ viewportHeight: viewportHeight, winSize: winSize });
	    }
	  },
	  sampleRowHeights: function sampleRowHeights() {
	    var _refs2 = this.refs;
	    var node = _refs2.node;
	    var childNodes = _refs2.content.childNodes;


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
	  },
	  notifyFirstVisibleItemIfNecessary: function notifyFirstVisibleItemIfNecessary() {
	    if (!this.props.onFirstVisibleItemChange) {
	      return;
	    }

	    var first = this.findFirstVisibleItem();

	    if (this._first !== first) {
	      this.props.onFirstVisibleItemChange(first);
	      this._first = first;
	    }
	  },
	  findFirstVisibleItem: function findFirstVisibleItem() {
	    var childNodes = this.refs.content.childNodes;
	    var items = this.props.items;
	    var _state2 = this.state;
	    var winStart = _state2.winStart;
	    var scrollTop = _state2.scrollTop;


	    for (var i = 0; i < childNodes.length; i++) {
	      if (childNodes[i].offsetTop + childNodes[i].offsetHeight >= scrollTop) {
	        return items[winStart + i];
	      }
	    }

	    return undefined;
	  },
	  handleDownwardScroll: function handleDownwardScroll(delta, callback) {
	    var childNodes = this.refs.content.childNodes;
	    var items = this.props.items;
	    var _state3 = this.state;
	    var winSize = _state3.winSize;
	    var avgRowHeight = _state3.avgRowHeight;

	    var maxWinStart = Math.max(0, items.length - winSize);
	    var _state4 = this.state;
	    var winStart = _state4.winStart;
	    var scrollTop = _state4.scrollTop;


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
	  },
	  handleUpwardScroll: function handleUpwardScroll(delta, callback) {
	    var _this = this;

	    var _refs3 = this.refs;
	    var node = _refs3.node;
	    var childNodes = _refs3.content.childNodes;
	    var _state5 = this.state;
	    var winStart = _state5.winStart;
	    var scrollTop = _state5.scrollTop;

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
	      var childNodes = _this.refs.content.childNodes;
	      var avgRowHeight = _this.state.avgRowHeight;
	      var scrollTop = _this.state.scrollTop;


	      for (var _i = 0; _i < n; _i++) {
	        scrollTop -= avgRowHeight - childNodes[_i].offsetHeight;
	      }

	      scrollTop = Math.round(scrollTop);

	      _this.setState({ scrollTop: scrollTop }, callback);
	    });
	  },
	  handleLongScroll: function handleLongScroll(delta, callback) {
	    var items = this.props.items;
	    var _state6 = this.state;
	    var winSize = _state6.winSize;
	    var avgRowHeight = _state6.avgRowHeight;
	    var scrollTop = this.state.scrollTop;

	    var maxWinStart = Math.max(0, items.length - winSize);
	    scrollTop += delta;
	    this.setState({
	      winStart: Math.min(maxWinStart, Math.floor(scrollTop / avgRowHeight)), scrollTop: scrollTop
	    }, callback);
	  },
	  scroll: function scroll(delta, callback) {
	    var viewportHeight = this.state.viewportHeight;


	    if (Math.abs(delta) > viewportHeight) {
	      this.handleLongScroll(delta, callback);
	    } else if (delta > 0) {
	      this.handleDownwardScroll(delta, callback);
	    } else if (delta < 0) {
	      this.handleUpwardScroll(delta, callback);
	    }

	    return this;
	  },
	  scrollToIndex: function scrollToIndex(index, callback) {
	    var items = this.props.items;
	    var _state7 = this.state;
	    var winSize = _state7.winSize;
	    var avgRowHeight = _state7.avgRowHeight;

	    var maxWinStart = Math.max(0, items.length - winSize);
	    var winStart = Math.min(maxWinStart, index);
	    var scrollTop = winStart * avgRowHeight;

	    this.setState({ winStart: winStart, scrollTop: scrollTop }, callback);
	  },
	  scrollToItem: function scrollToItem(item, callback) {
	    var index = this.props.items.indexOf(item);

	    if (index >= 0) {
	      this.scrollToIndex(index, callback);
	    }

	    return this;
	  },
	  scrollToTop: function scrollToTop(callback) {
	    return this.scrollToIndex(0, callback);
	  },
	  onScroll: function onScroll() {
	    var node = this.refs.node;
	    var scrollTop = this.state.scrollTop;


	    if (node.scrollTop !== scrollTop) {
	      this.scroll(node.scrollTop - scrollTop);
	    }
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var items = _props2.items;
	    var getItem = _props2.getItem;
	    var getItemKey = _props2.getItemKey;
	    var scrollbarOffset = _props2.scrollbarOffset;
	    var _state8 = this.state;
	    var winStart = _state8.winStart;
	    var winSize = _state8.winSize;
	    var avgRowHeight = _state8.avgRowHeight;

	    var winEnd = Math.min(items.length - 1, winStart + winSize - 1);
	    var paddingTop = winStart * avgRowHeight;
	    var paddingBottom = (items.length - winStart - winSize) * avgRowHeight;
	    var style = {
	      position: 'absolute',
	      top: 0,
	      right: scrollbarOffset,
	      bottom: 0,
	      left: 0,
	      overflowY: 'auto',
	      overflowX: 'hidden'
	    };
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
	      { ref: 'node', className: 'VirtualList', tabIndex: '-1', style: style, onScroll: this.onScroll },
	      _react2.default.createElement(
	        'div',
	        { ref: 'content', className: 'VirtualList-content', style: contentStyle },
	        itemNodes
	      )
	    );
	  }
	});

	module.exports = VirtualList;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;