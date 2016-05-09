const React = require('react');

const VirtualList = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired,
    estRowHeight: React.PropTypes.number,
    windowSize: React.PropTypes.number
  },

  getDefaultProps() {
    return {estRowHeight: 50, windowSize: 10};
  },

  getInitialState() {
    const {items, windowSize, estRowHeight} = this.props;

    return {
      winStart: 0,
      paddingTop: 0,
      paddingBottom: (items.length - windowSize) * estRowHeight
    };
  },

  componentWillMount() {
    this._scrollTop = 0;
    this._itemView = React.Children.only(this.props.children);
  },

  adjustPaddingTopForUpwardScroll(n) {
    const {content: {childNodes}} = this.refs;
    const {estRowHeight} = this.props;
    let {paddingTop} = this.state;

    for (let i = 0; i < n; i++) {
      paddingTop -= childNodes[i].offsetHeight;
    }

    this.setState({paddingTop});
  },

  handleDownwardScroll() {
    const {node, content} = this.refs;
    const {items, windowSize, estRowHeight} = this.props;
    const scrollTop = node.scrollTop;
    const itemNodes = content.childNodes;
    let {winStart, paddingTop} = this.state;
    let paddingTopAdjust = 0;

    for (let i = 0; i < itemNodes.length; i++) {
      if (itemNodes[i].offsetTop + itemNodes[i].offsetHeight < scrollTop) {
        winStart++;
        paddingTopAdjust += estRowHeight + (itemNodes[i].offsetHeight - estRowHeight);
      }
      else {
        break;
      }
    }

    this.setState({
      winStart,
      paddingTop: paddingTop + paddingTopAdjust,
      paddingBottom: (items.length - windowSize - winStart) * estRowHeight
    });
  },

  handleUpwardScroll() {
    const {node, content} = this.refs;
    const {items, estRowHeight, windowSize} = this.props;
    const scrollTop = node.scrollTop;
    const itemNodes = content.childNodes;
    let {winStart} = this.state;
    let n = 0;

    for (let i = itemNodes.length - 1; i >= 0; i--) {
      if (winStart > 0 && itemNodes[i].offsetTop > (scrollTop + node.offsetHeight)) {
        winStart--;
        n++;
      }
      else {
        break;
      }
    }

    this.setState({
      winStart,
      paddingBottom: (items.length - windowSize - winStart) * estRowHeight
    }, () => { this.adjustPaddingTopForUpwardScroll(n) });
  },

  handleLongScroll() {
    const {node: {scrollTop}} = this.refs;
    const {items, windowSize, estRowHeight} = this.props;
    const winStart = Math.floor(scrollTop / estRowHeight);
    const paddingTop = winStart * estRowHeight;
    const paddingBottom = (items.length - windowSize - winStart) * estRowHeight;

    this.setState({winStart, paddingTop, paddingBottom});
  },

  onScroll(e) {
    const {node, node: {scrollTop}, content} = this.refs;
    const {estRowHeight} = this.props;
    const {winStart, paddingTop, paddingBottom} = this.state;
    const scrollDelta = Math.abs(scrollTop - this._scrollTop);

    if (scrollDelta > (content.offsetHeight - paddingTop - paddingBottom)) {
      this.handleLongScroll();
    }
    else if (scrollTop > this._scrollTop) {
      this.handleDownwardScroll();
    }
    else {
      this.handleUpwardScroll();
    }

    this._scrollTop = scrollTop;
  },

  render() {
    const {items, estRowHeight, windowSize} = this.props;
    const {winStart, paddingTop, paddingBottom} = this.state;
    const style = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflowX: 'hidden',
      overflowY: 'auto'
    };
    const contentStyle = {paddingTop, paddingBottom};

    return (
      <div ref="node" className="VirtualList" style={style} onScroll={this.onScroll}>
        <div ref="content" className="VirtualList-content" style={contentStyle}>
          {
            items.slice(winStart, winStart + windowSize).map(item =>
              <div className="VirtualList-item" key={item.id}>
                {React.cloneElement(this._itemView, {item: item})}
              </div>
            )
          }
        </div>
      </div>
    );
  }
});

module.exports = VirtualList;
