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
    return {winStart: 0, winSize: 10, viewportHeight: 1, avgRowHeight: 1};
  },

  componentWillMount() {
    this._itemView = React.Children.only(this.props.children);
  },

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.sampleRowHeights();
  },

  componentDidUpdate() {
    const {node, content: {childNodes}} = this.refs;
    const {winSize} = this.state;

    this.notifyFirstVisibleItemIfNecessary();

    if (childNodes.length < winSize) {
      this.sampleRowHeights();
    }
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },

  handleResize() {
    const {node} = this.refs;
    const {avgRowHeight} = this.state;
    const viewportHeight = node.clientHeight;
    const winSize = Math.ceil(viewportHeight / avgRowHeight) + this.props.buffer;
    if (viewportHeight !== this.state.viewportHeight || winSize !== this.state.winSize) {
      this.setState({viewportHeight, winSize});
    }
  },

  sampleRowHeights() {
    const {node, content, content: {childNodes}} = this.refs;

    if (childNodes.length) {
      let totalHeight = 0;
      for (let i = 0; i < childNodes.length; i++) {
        totalHeight += childNodes[i].offsetHeight;
      }
      const avgRowHeight = totalHeight / childNodes.length;
      const winSize = Math.ceil(node.clientHeight / avgRowHeight) + this.props.buffer;
      if (avgRowHeight !== this.state.avgRowHeight || winSize !== this.state.winSize) {
        this.setState({avgRowHeight, winSize});
      }
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
    const {node: {scrollTop}, content: {childNodes}} = this.refs;
    const {items} = this.props;
    const {winStart, top} = this.state;

    for (let i = 0; i < childNodes.length; i++) {
      if ((childNodes[i].offsetTop + childNodes[i].offsetHeight) >= scrollTop) {
        return items[winStart + i];
      }
    }

    return undefined;
  },

  handleDownwardScroll() {
    const {node, node: {scrollTop}, content, content: {childNodes}} = this.refs;
    const {items} = this.props;
    const {winSize, avgRowHeight} = this.state;
    const maxWinStart = Math.max(0, items.length - winSize);
    let {winStart} = this.state;
    let adjust = 0;

    for (let i = 0; i < childNodes.length; i++) {
      if (winStart < maxWinStart && childNodes[i].offsetTop + childNodes[i].offsetHeight < scrollTop) {
        winStart++;
        adjust += avgRowHeight - childNodes[i].offsetHeight;
      }
      else {
        break;
      }
    }

    this.setState({winStart}, () => { this.setScrollTop(scrollTop + adjust); });
  },

  handleUpwardScroll() {
    const {node, node: {scrollTop}, content: {childNodes}} = this.refs;
    let {winStart} = this.state;
    let n = 0;

    for (let i = childNodes.length - 1; i >= 0; i--) {
      if (winStart > 0 && (childNodes[i].offsetTop - scrollTop) > node.offsetHeight) {
        winStart--;
        n++;
      }
      else {
        break;
      }
    }

    this.setState({winStart}, () => {
      const {node: {scrollTop}, content: {childNodes}} = this.refs;
      const {avgRowHeight} = this.state;
      let adjust = 0;

      for (let i = 0; i < n; i++) {
        adjust -= avgRowHeight - childNodes[i].offsetHeight;
      }

      this.setScrollTop(scrollTop + adjust);
    });
  },

  handleLongScroll() {
    const {node: {scrollTop}} = this.refs;
    const {items} = this.props;
    const {winSize, avgRowHeight} = this.state;
    const maxWinStart = Math.max(0, items.length - winSize);
    this.setState({winStart: Math.min(maxWinStart, Math.floor(scrollTop / avgRowHeight))});
  },

  handleScroll(delta) {
    const {viewportHeight} = this.state;

    if (Math.abs(delta) > viewportHeight) {
      this.handleLongScroll();
    }
    else if (delta > 0) {
      this.handleDownwardScroll();
    }
    else if (delta < 0) {
      this.handleUpwardScroll();
    }

    return this;
  },

  scrollToIndex(index) {
    const {items} = this.props;
    const {winSize, avgRowHeight} = this.state;
    const maxWinStart = Math.max(0, items.length - winSize);
    let winStart = Math.min(maxWinStart, index);

    this.setState({winStart}, () => { this.setScrollTop(winStart * avgRowHeight); });
  },

  scrollToItem(item) {
    const index = this.props.items.indexOf(item);

    if (index >= 0) {
      this.scrollToIndex(index);
    }

    return this;
  },

  onScroll() {
    const {node, node: {scrollTop}} = this.refs;

    if (this._adjustedScroll) {
      this._adjustedScroll = false;
    }
    else {
      this.handleScroll(scrollTop - (this._prevScrollTop || 0));
    }

    this._prevScrollTop = scrollTop;
  },

  setScrollTop(scrollTop) {
    const {node} = this.refs;
    if (node.scrollTop !== scrollTop) {
      this._adjustedScroll = true;
      node.scrollTop = scrollTop;
    }
  },

  render() {
    const {items, getItemKey} = this.props;
    const {winStart, winSize, avgRowHeight} = this.state;
    const paddingTop = winStart * avgRowHeight;
    const paddingBottom = (items.length - winStart - winSize) * avgRowHeight;
    const style = {position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto'};
    const contentStyle = {paddingTop, paddingBottom};

    return (
      <div ref="node" className="VirtualList" style={style} onScroll={this.onScroll}>
        <div ref="content" className="VirtualList-content" style={contentStyle}>
          {
            items.slice(winStart, winStart + winSize).map((item, i) =>
              <Item key={getItemKey(item, winStart + i)} itemView={this._itemView} item={item} />
            )
          }
        </div>
      </div>
    );
  }
});

module.exports = VirtualList;
