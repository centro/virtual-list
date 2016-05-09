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

  adjustTopForUpwardScroll(n) {
    const {content: {childNodes}} = this.refs;
    let {top} = this.state;

    for (let i = 0; i < n; i++) {
      top -= childNodes[i].offsetHeight;
    }

    this.setState({top});
  },

  handleDownwardScroll() {
    const {node, content} = this.refs;
    const scrollTop = node.scrollTop;
    const itemNodes = content.childNodes;
    let {winStart, top} = this.state;

    for (let i = 0; i < itemNodes.length; i++) {
      if (top + itemNodes[i].offsetTop + itemNodes[i].offsetHeight < scrollTop) {
        winStart++;
        top += itemNodes[i].offsetHeight;
      }
      else {
        break;
      }
    }

    this.setState({winStart, top});
  },

  handleUpwardScroll() {
    const {node, content} = this.refs;
    const scrollTop = node.scrollTop;
    const itemNodes = content.childNodes;
    let {winStart, top} = this.state;
    let n = 0;

    // upward scroll
    for (let i = itemNodes.length - 1; i >= 0; i--) {
      if (top + itemNodes[i].offsetTop > scrollTop + node.offsetHeight) {
        n++;
      }
      else {
        break;
      }
    }

    this.setState({winStart: winStart - n}, () => {
      this.adjustTopForUpwardScroll(n);
    });
  },

  onScroll(e) {
    const {node: {scrollTop}} = this.refs;

    if (scrollTop > this._scrollTop) {
      this.handleDownwardScroll();
    }
    else {
      this.handleUpwardScroll();
    }

    this._scrollTop = scrollTop;
  },

  render() {
    const {items, estRowHeight, windowSize} = this.props;
    const {winStart, top} = this.state;
    const style = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflowX: 'hidden',
      overflowY: 'auto'
    };
    const containerStyle = {
      position: 'relative',
      height: estRowHeight * items.length
    };
    const contentStyle = {
      position: 'absolute',
      top: top
    };

    return (
      <div ref="node" className="VirtualList" style={style} onScroll={this.onScroll}>
        <div ref="container" className="VirtualList-container" style={containerStyle}>
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
      </div>
    );
  }
});

module.exports = VirtualList;
