(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["VirtualList"] = factory(require("react"));
	else
		root["VirtualList"] = factory(root["react"]);
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

	  // The `VirtualList` gets re-rendered on scroll events, so we want to be careful that we don't
	  // unnecessarily render item views as that could cause a significant performance degregation.
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
	    return this.props.item !== nextProps.item;
	  },
	  render: function render() {
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
	});

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
	// What sets `VirtualList` apart from other virtualized list implmentations is that it makes no
	// assumptions about the heights of your individual rows. Instead it makes an informed guess about
	// how many rows it should render based on an average row height of the first 10 item rows. Then
	// it checks to see which items have scrolled out of view on scroll events and slides the window
	// by that many items. This means that you can have arbitrarily sized rows and even rows whose sizes
	// are purely determined by the browser. Thus, you should be able to swap this component in for any
	// vertical list view that is rendered inside some fixed height container.
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
	var VirtualList = _react2.default.createClass({
	  displayName: 'VirtualList',

	  propTypes: {
	    // An array of model items to render into the list. This is the only required prop.
	    items: _react2.default.PropTypes.array.isRequired,

	    // Provide a function to access an item from the `items` array. Gets passed the `items` prop
	    // and an index. The default implementation simply uses the `[]` operator. This exists to work
	    // with an array object that is capable of paging itself such as the one provided by the
	    // Transis library.
	    getItem: _react2.default.PropTypes.func,

	    // Provide a function to generate a react key for each item. Gets passed the item and its index.
	    // The default simply returns the index.
	    getItemKey: _react2.default.PropTypes.func,

	    // Provide a callback function to be invoked whenever the first visible item changes due to a
	    // scroll event.
	    onFirstVisibleItemChange: _react2.default.PropTypes.func,

	    // Specify the number of buffer items to use in the display window. The virtual list will make
	    // its best attempt to determine the minimum number of items necessary to fill the viewport and
	    // then add this amount to that. The default value is 4.
	    buffer: _react2.default.PropTypes.number,

	    // Offset the scrollbar by the number of pixels specified. The default is 0.
	    scrollbarOffset: _react2.default.PropTypes.number,

	    // Specify how often to check for a resize of the component in milliseconds. The virtual list
	    // must recompute its window size when the component is resized because it may no longer be
	    // large enough to fill the viewport. Default is 1000ms.
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


	  // Internal: After the component is mounted we do the following:
	  //
	  // 1. Start a timer to periodically check for resizes of the container. When the container is
	  //    resized we have to adjust the display window to ensure that we are rendering enough items
	  //    to fill the viewport.
	  // 2. Calculate the initial viewport height and display window size by triggering the resize
	  //    handler.
	  // 3. Sample the just rendered row heights to get an average row height to use while handling
	  //    scroll events.
	  componentDidMount: function componentDidMount() {
	    this._resizeTimer = setInterval(this.checkForResize, this.props.resizeInterval);
	    this.handleResize();
	    this.sampleRowHeights();
	  },


	  // Internal: After the component is updated we do the following:
	  //
	  // 1. Invoke the `onFirstVisibleItemChange` callback if the first visible item has changed since
	  //    the last update.
	  // 2. Re-sample row heights if we have fewer items than the display window size.
	  // 3. Sync the components `scrollTop` state property with the node's `scrollTop` property. This is
	  //    necessary to keep scrolling smooth as we add or remove rows whose heights differ from the
	  //    average row height.
	  componentDidUpdate: function componentDidUpdate() {
	    var _refs = this.refs,
	        node = _refs.node,
	        childNodes = _refs.content.childNodes;
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


	  // Internal: When the container node has been resized we need to adjust the internal
	  // `viewportHeight` and `winSize` state properties. This will ensure that we are always rendering
	  // enough rows to fill the viewport.
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
	    var _refs2 = this.refs,
	        node = _refs2.node,
	        childNodes = _refs2.content.childNodes;


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
	    var _state2 = this.state,
	        winStart = _state2.winStart,
	        scrollTop = _state2.scrollTop;


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
	  },
	  handleUpwardScroll: function handleUpwardScroll(delta, callback) {
	    var _this = this;

	    var _refs3 = this.refs,
	        node = _refs3.node,
	        childNodes = _refs3.content.childNodes;
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
	    var _state6 = this.state,
	        winSize = _state6.winSize,
	        avgRowHeight = _state6.avgRowHeight;
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
	    var _state7 = this.state,
	        winSize = _state7.winSize,
	        avgRowHeight = _state7.avgRowHeight;

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


	  // Public: Invoke this method whenever the `items` array has been mutated to cause the list to
	  // sync up the display window and re-render.
	  //
	  // callback - An optional function to call once rendering has occurred.
	  //
	  // Returns the receiver.
	  itemsMutated: function itemsMutated(callback) {
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
	  },

	  onScroll: function onScroll() {
	    var node = this.refs.node;
	    var scrollTop = this.state.scrollTop;


	    if (node.scrollTop !== scrollTop) {
	      this.scroll(node.scrollTop - scrollTop);
	    }
	  },
	  render: function render() {
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