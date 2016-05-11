const React = require('react');

const Item = React.createClass({
  shouldComponentUpdate(nextProps) {
    return this.props.item !== nextProps.item;
  },

  render() {
    const {itemView, item} = this.props;
    return <div className="VirtualList-item">{React.cloneElement(itemView, {item})}</div>;
  }
});

const VirtualList = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired,
    getItemKey: React.PropTypes.func,
    onFirstVisibleItemChange: React.PropTypes.func,
    buffer: React.PropTypes.number
  },

  getDefaultProps() {
    return {getItemKey: function(item, index) { return index; }, buffer: 4};
  },

  getInitialState() {
    return {winStart: 0, top: 0, viewportHeight: 1, winSize: 10, avgRowHeight: 1};
  },

  componentWillMount() {
    this._itemView = React.Children.only(this.props.children);
  },

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.sampleRowHeights();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      this._sampleRowHeightsOnNextRender = true;
    }
  },

  componentDidUpdate() {
    const {content: {childNodes}} = this.refs;
    const {winSize} = this.props;

    this.notifyFirstVisibleItemIfNecessary();

    if (this._sampleRowHeightsOnNextRender) {
      this.sampleRowHeights();
      this._sampleRowHeightsOnNextRender = false;
    }

    if (childNodes.length < winSize) {
      this._sampleRowHeightsOnNextRender = true;
    }
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },

  handleResize() {
    const {node, node: {clientHeight}} = this.refs;
    const {avgRowHeight} = this.state;
    const winSize = Math.ceil(node.clientHeight / avgRowHeight) + this.props.buffer;
    this.setState({viewportHeight: clientHeight, winSize});
  },

  sampleRowHeights() {
    const {node, content, content: {childNodes}} = this.refs;

    if (childNodes.length) {
      const avgRowHeight = content.offsetHeight / childNodes.length;
      const winSize = Math.ceil(node.clientHeight / avgRowHeight) + this.props.buffer;
      this.setState({avgRowHeight, winSize});
    }
  },

  notifyFirstVisibleItemIfNecessary() {
    if (!this.props.onFirstVisibleItemChange) { return; }

    const first = this.findFirstVisibleItem();

    if (this._first !== first) {
      this.props.onFirstVisibleItemChange(first);
      this._first = first;
    }
  },

  findFirstVisibleItem() {
    const {content: {childNodes}} = this.refs;
    const {items} = this.props;
    const {winStart, top} = this.state;

    for (let i = 0; i < childNodes.length; i++) {
      if ((childNodes[i].offsetTop + childNodes[i].offsetHeight) >= top) {
        return items[winStart + i];
      }
    }

    return undefined;
  },

  scrollDownward(delta) {
    const {node, content, content: {childNodes}} = this.refs;
    const {items} = this.props;
    const {winSize} = this.state;
    const maxWinStart = Math.max(0, items.length - winSize);
    let {winStart, top} = this.state;

    if (winStart === maxWinStart) {
      if (content.offsetHeight - top > node.offsetHeight) {
        top = Math.min(content.offsetHeight - node.offsetHeight, top + delta);
      }
    }
    else {
      top += delta;
    }

    for (let i = 0; i < childNodes.length; i++) {
      if (winStart < maxWinStart && childNodes[i].offsetTop + childNodes[i].offsetHeight < top) {
        winStart++;
        top -= childNodes[i].offsetHeight;
      }
      else {
        break;
      }
    }

    this.setState({winStart, top});
  },

  scrollUpward(delta) {
    const {node, content: {childNodes}} = this.refs;
    const {items} = this.props;
    let {winStart, top} = this.state;
    let n = 0;

    if (winStart === 0) {
      top = Math.max(0, top - delta);
    }
    else {
      top -= delta;
    }

    for (let i = childNodes.length - 1; i >= 0; i--) {
      if (winStart > 0 && (childNodes[i].offsetTop - top) > node.offsetHeight) {
        winStart--;
        n++;
      }
      else {
        break;
      }
    }

    this.setState({winStart, top}, () => { this.adjustTopForUpwardScroll(n); });
  },

  longScrollDownward(delta) {
    const {items} = this.props;
    const {winSize, avgRowHeight} = this.state;
    const maxWinStart = Math.max(0, items.length - winSize);
    let {winStart} = this.state;

    winStart = Math.min(maxWinStart, winStart + Math.round(delta / avgRowHeight));

    this.setState({winStart, top: 0});
  },

  longScrollUpward(delta) {
    const {items, windowSize} = this.props;
    const {avgRowHeight} = this.state;
    let {winStart} = this.state;

    winStart = Math.max(0, winStart - Math.round(delta / avgRowHeight));

    this.setState({winStart, top: 0});
  },

  adjustTopForUpwardScroll(n) {
    const {content: {childNodes}} = this.refs;
    let {top} = this.state;

    for (let i = 0; i < n; i++) {
      top += childNodes[i].offsetHeight;
    }

    this.setState({top});
  },

  scroll(delta) {
    const {viewportHeight} = this.state;

    if (Math.abs(delta) > viewportHeight) {
      if (delta > 0) {
        this.longScrollDownward(delta);
      }
      else {
        this.longScrollUpward(-delta);
      }
    }
    else if (delta > 0) {
      this.scrollDownward(delta);
    }
    else if (delta < 0) {
      this.scrollUpward(-delta);
    }

    return this;
  },

  scrollToIndex(index) {
    const {items} = this.props;
    const {winSize} = this.state;
    const maxWinStart = Math.max(0, items.length - winSize);
    let winStart = Math.min(maxWinStart, index);

    this.setState({winStart, top: 0});
  },

  scrollToItem(item) {
    const index = this.props.items.indexOf(item);

    if (index >= 0) {
      this.scrollToIndex(index);
    }

    return this;
  },

  onWheel(e) {
    const {deltaY} = e;
    e.stopPropagation();
    e.preventDefault();
    if (e.deltaY !== 0) {
      requestAnimationFrame(() => { this.scroll(deltaY); });
    }
  },

  onScrollStart(e) {
    this._clientY = e.clientY;
    document.addEventListener('mousemove', this.onScroll);
    document.addEventListener('mouseup', this.onScrollStop);
  },

  onScroll(e) {
    e.preventDefault();
    if (this._clientY === e.clientY) { return; }
    const {items} = this.props;
    const {viewportHeight, avgRowHeight} = this.state;
    const estContentHeight = items.length * avgRowHeight;
    const rawDelta = e.clientY - this._clientY;
    const delta = Math.round((rawDelta / viewportHeight) * estContentHeight);
    this.scroll(delta);
    this._clientY = e.clientY;
  },

  onScrollStop() {
    this._clientY = null;
    document.removeEventListener('mousemove', this.onScroll);
    document.removeEventListener('mouseup', this.onScrollStop);
  },

  calculateScrollbar() {
    const {min, max, round} = Math;
    const {node, content} = this.refs;
    const {items} = this.props;
    const {winStart, top, viewportHeight, avgRowHeight} = this.state;
    const estContentHeight = avgRowHeight * items.length;
    const viewportContentRatio = viewportHeight / estContentHeight;
    const scrollbarHeight = min(viewportHeight, max(20, round(viewportHeight * viewportContentRatio)));
    const viewportScrollHeight = estContentHeight - viewportHeight;
    const scrollbarScrollHeight = viewportHeight - scrollbarHeight;
    const viewportPos = winStart * avgRowHeight + top;
    const viewportPosRatio = viewportPos / viewportScrollHeight;
    const scrollbarTop = scrollbarScrollHeight * viewportPosRatio;

    return {top: scrollbarTop, height: scrollbarHeight};
  },

  render() {
    const {items, getItemKey} = this.props;
    const {winStart, top, winSize} = this.state;
    const style = {position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden'};
    const contentStyle = {transform: `translate3d(0, ${-top}px, 0)`};
    const scrollbar = this.calculateScrollbar();
    const sbStyle = {
      position: 'absolute',
      top: scrollbar.top,
      height: scrollbar.height,
      right: 1,
      width: 7,
      backgroundColor: '#000',
      opacity: 0.5,
      borderRadius: 10
    };

    return (
      <div ref="node" className="VirtualList" style={style} onWheel={this.onWheel}>
        <div ref="content" className="VirtualList-content" style={contentStyle}>
          {
            items.slice(winStart, winStart + winSize).map((item, i) =>
              <Item key={getItemKey(item, winStart + i)} itemView={this._itemView} item={item} />
            )
          }
        </div>
        <div className="VirtualList-scollbar" style={sbStyle} onMouseDown={this.onScrollStart} />
      </div>
    );
  }
});

module.exports = VirtualList;
