import VirtualList from "../src/VirtualList.jsx";
import React from "react";
import ReactDOM from 'react-dom';
import RT from "react-addons-test-utils";

const Container = React.createClass({
  render() {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, width: 200, height: 200, border: "1px solid #ccc", overflow: 'hidden' }}>
        <VirtualList ref="list" items={this.props.items}>
          <ItemView />
        </VirtualList>
      </div>
    );
  }
});

const ItemView = ({item}) => <div style={{ height: item.height }}>{item.id}</div>

describe('VirtualList', function() {
  beforeEach(function() {
    this.wrapper = document.createElement('div');
    document.body.appendChild(this.wrapper);

    this.items = [
      {id: 0, height: 40},
      {id: 1, height: 20},
      {id: 2, height: 30},
      {id: 3, height: 50},
      {id: 4, height: 30},
      {id: 5, height: 20},
      {id: 6, height: 30},
      {id: 7, height: 20},
      {id: 8, height: 20},
      {id: 9, height: 40}
    ];

    for (let i = 10; i < 100; i++) {
      this.items.push({id: i, height: 40});
    }

    this.container = ReactDOM.render(<Container items={this.items} />, this.wrapper);

    this.list = this.container.refs.list;
    this.node = ReactDOM.findDOMNode(this.list);
    this.contentNode = this.node.querySelector('.VirtualList-content');
  });

  afterEach(function() {
    this.wrapper.remove();
  });

  describe('#componentDidMount', function() {
    it('measures the state of the viewportHeight', function() {
      expect(this.list.state.viewportHeight).toBe(200);
    });

    it('renders and calculates the average row height of the first 10 rows', function() {
      expect(this.list.state.avgRowHeight).toBe(30);
    });

    it('calculates the window size based on the viewportHeight and average row height', function() {
      expect(this.list.state.winSize).toBe(11);
    })
  });

  describe('#render', function() {
    it('renders an absolutely positioned node with overflowY set to auto and overflowX set to hidden', function() {
      expect(this.node.style.position).toBe('absolute');
      expect(this.node.style.top).toBe('0px');
      expect(this.node.style.right).toBe('0px');
      expect(this.node.style.bottom).toBe('0px');
      expect(this.node.style.left).toBe('0px');
      expect(this.node.style.overflowY).toBe('auto');
      expect(this.node.style.overflowX).toBe('hidden');
    });

    it('renders a content node with a padding-top of 0', function() {
      expect(this.contentNode.style.paddingTop).toBe('0px');
    });

    it('sets the padding-bottom of the content node to the number of items not rendered times the average item row height', function() {
      expect(this.contentNode.style.paddingBottom).toBe('2670px');
    });

    it('renders the number of item rows as indicated by the winSize state prop', function() {
      expect(this.node.querySelectorAll('.VirtualList-item').length).toBe(11);
    });

    it('sets the item prop on each item view to the appropriate item object', function() {
      let itemNodes = this.node.querySelectorAll('.VirtualList-item');
      expect(itemNodes[0].textContent).toEqual("0");
      expect(itemNodes[1].textContent).toEqual("1");
      expect(itemNodes[2].textContent).toEqual("2");
      expect(itemNodes[3].textContent).toEqual("3");
      expect(itemNodes[4].textContent).toEqual("4");
      expect(itemNodes[5].textContent).toEqual("5");
      expect(itemNodes[6].textContent).toEqual("6");
      expect(itemNodes[7].textContent).toEqual("7");
      expect(itemNodes[8].textContent).toEqual("8");
      expect(itemNodes[9].textContent).toEqual("9");
      expect(itemNodes[10].textContent).toEqual("10");
    });
  });

  describe('on a short downward scroll', function() {
    beforeEach(function(done) {
      this.node.scrollTop = 41;
      setTimeout(done);
    });

    it('recalculates the window start based on the number of items scrolled out of view', function() {
      expect(this.list.state.winStart).toBe(1);
    });

    it('sets the padding-top of the content node to account for the number of items before the window that are not rendered', function() {
      expect(this.contentNode.style.paddingTop).toBe('30px');
    });

    it('re-adjusts the scrollTop to account for the difference in the average row height and the height of the item removed', function(done) {
      this.list.setState({}, () => {
        expect(this.node.scrollTop).toBe(31);
        done();
      });
    });
  });
});
