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
    estRowHeight: React.PropTypes.number,
    windowSize: React.PropTypes.number,
    getItemKey: React.PropTypes.func,
    onFirstVisibleItemChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      estRowHeight: 50,
      windowSize: 10,
      getItemKey: function(item, index) { return index; }
    };
  },

  getInitialState() {
    const {items, windowSize} = this.props;

    return {
      winStart: 0,
      winEnd: Math.min(items.length, windowSize),
      top: 0,
      viewportHeight: 0
    };
  },

  componentWillMount() {
    this._itemView = React.Children.only(this.props.children);
  },

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },

  componentDidUpdate() {
    this.notifyFirstVisibleItemIfNecessary();
  },

  handleResize() {
    const {node: {clientHeight}} = this.refs;
    this.setState({viewportHeight: clientHeight});
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
    const {items, windowSize, estRowHeight} = this.props;
    const maxWinStart = Math.max(0, items.length - windowSize);
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

    this.setState({
      winStart,
      winEnd: Math.min(items.length, winStart + windowSize),
      top
    });
  },

  scrollUpward(delta) {
    const {node, content: {childNodes}} = this.refs;
    const {items, windowSize, estRowHeight} = this.props;
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

    this.setState({
      winStart,
      winEnd: Math.min(items.length, winStart + windowSize),
      top
    }, () => { this.adjustTopForUpwardScroll(n); });
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
    if (delta > 0) {
      this.scrollDownward(delta);
    }
    else if (delta < 0) {
      this.scrollUpward(-delta);
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

  calculateScrollbar() {
    const {min, max, round} = Math;
    const {node, content} = this.refs;
    const {items, estRowHeight} = this.props;
    const {winStart, winEnd, top, viewportHeight} = this.state;
    const numItemNodes = winEnd - winStart;
    const estContentHeight = estRowHeight * items.length;
    const viewportContentRatio = viewportHeight / estContentHeight;
    const scrollbarHeight = min(viewportHeight, max(20, round(viewportHeight * viewportContentRatio)));
    const scrollHeight = estContentHeight - viewportHeight;
    const viewportPos = winStart * estRowHeight + top;
    const viewportPosRatio = viewportPos / scrollHeight;
    const scrollbarTop = round((viewportHeight - scrollbarHeight) * viewportPosRatio);

    return {top: scrollbarTop, height: scrollbarHeight};
  },

  render() {
    const {items, estRowHeight, windowSize, getItemKey} = this.props;
    const {winStart, winEnd, top} = this.state;
    const style = {position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden'};
    const contentStyle = {transform: `translate3d(0, ${-top}px, 0)`};
    const scrollbar = this.calculateScrollbar();
    const scrollbarStyle = {
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
            items.slice(winStart, winEnd).map((item, i) =>
              <Item key={getItemKey(item, winStart + i)} itemView={this._itemView} item={item} />
            )
          }
        </div>
        <div className="VirtualList-scollbar" style={scrollbarStyle} />
      </div>
    );
  }
});

module.exports = VirtualList;
