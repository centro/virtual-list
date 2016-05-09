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
    return {winStart: 0, top: 0};
  },

  componentWillMount() {
    this._scrollTop = 0;
    this._itemView = React.Children.only(this.props.children);
  },

  scrollDownward(delta) {
    const {node, content, content: {childNodes}} = this.refs;
    const {items, windowSize, estRowHeight} = this.props;
    const maxWinStart = items.length - windowSize;
    let {winStart, top} = this.state;

    if (winStart === maxWinStart) {
      top = Math.min(content.offsetHeight - node.offsetHeight, top + delta);
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
    const {items, windowSize, estRowHeight} = this.props;
    let {winStart, top} = this.state;
    let n = 0;

    top = Math.max(0, top - delta);

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

  render() {
    const {items, estRowHeight, windowSize} = this.props;
    const {winStart, top} = this.state;
    const style = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    const contentStyle = {
      position: 'absolute',
      top: -top
    };

    return (
      <div ref="node" className="VirtualList" style={style} onWheel={this.onWheel}>
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
