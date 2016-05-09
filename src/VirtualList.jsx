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
    const {node, content} = this.refs;
    const {items, windowSize, estRowHeight} = this.props;
    const itemNodes = content.childNodes;
    const maxWinStart = items.length - windowSize;
    let {winStart, top} = this.state;

    if (winStart === maxWinStart) {
      top = Math.min(content.offsetHeight - node.offsetHeight, top + delta);
    }
    else {
      top += delta;
    }

    for (let i = 0; i < itemNodes.length; i++) {
      if (winStart < maxWinStart && itemNodes[i].offsetTop + itemNodes[i].offsetHeight < top) {
        winStart++;
        top -= itemNodes[i].offsetHeight;
      }
      else {
        break;
      }
    }

    this.setState({winStart, top});
  },

  scrollUpward() {
  },

  scroll(delta) {
    if (delta > 0) {
      this.scrollDownward(delta);
    }
    else if (delta < 0) {
      this.scrollUpward(-delta);
    }
  },

  onWheel(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.deltaY !== 0) { this.scroll(e.deltaY); }
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
