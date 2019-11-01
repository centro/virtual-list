import VirtualList from "../src/VirtualList.jsx";
import React from "react";
import ReactDOM from 'react-dom';
import RT from "react-dom/test-utils";

class Container extends React.Component {
  render() {
    return (
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' }}>
        <VirtualList ref={el => { this.list = el; }} {...this.props}><ItemView /></VirtualList>
      </div>
    );
  }
};

const ItemView = ({item}) => <div style={{ height: item.height }}>{item.id}</div>

describe('VirtualList', function() {
  beforeEach(function(done) {
    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'absolute';
    this.wrapper.style.top = '0px';
    this.wrapper.style.left = '0px';
    this.wrapper.style.height = '200px';
    this.wrapper.style.width = '200px';
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

    this.onFirstVisibleItemChange = jasmine.createSpy('onFirstVisibleItemChange');

    this.setupList = (props) => {
      ReactDOM.render(
        <Container
          items={this.items}
          ref={el => { this.container = el }}
          onFirstVisibleItemChange={this.onFirstVisibleItemChange}
          {...props}
        />, this.wrapper
      );
    };

    this.setupList()

    setTimeout(() => {
      this.list = this.container.list;
      this.node = ReactDOM.findDOMNode(this.list);
      this.contentNode = this.node.querySelector('.VirtualList-content');
      done();
    });

  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(this.wrapper);
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
    it('renders an absolutely positioned node with overflowY set to auto', function() {
      expect(this.node.style.position).toBe('absolute');
      expect(this.node.style.top).toBe('0px');
      expect(this.node.style.right).toBe('0px');
      expect(this.node.style.bottom).toBe('0px');
      expect(this.node.style.left).toBe('0px');
      expect(this.node.style.overflowY).toBe('auto');
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

  describe('scrolling', function() {
    beforeEach(function() {
      this.setupList();
    });

    describe('on a short downward scroll', function() {
      beforeEach(function(done) {
        this.list.scroll(41, done);
      });

      it('recalculates the window start based on the number of items scrolled out of view', function() {
        expect(this.list.state.winStart).toBe(1);
      });

      it('sets the padding-top of the content node to the average row height times the number of non-rendered items', function() {
        expect(this.contentNode.style.paddingTop).toBe('30px');
      });

      it('re-adjusts the scrollTop to account for the difference in the average row height and the height of the item removed', function() {
        expect(this.list.state.scrollTop).toBe(31);
      });
    });

    describe('on a short upward scroll', function() {
      beforeEach(function(done) {
        this.list.scrollToIndex(20, () => {
          this.list.scroll(-1, done);
        });
      });

      it('recalculates the window start based on the number of items scrolled out of view', function() {
        // winSize is 11
        // 5 items at 40px each take up the viewport
        // 6 items are out of view after the scroll
        expect(this.list.state.winStart).toBe(14);
      });

      it('sets the padding-top of the content node to the average row height times the number of non-rendered items', function() {
        // 14 items not rendered times 30px avg height
        expect(this.contentNode.style.paddingTop).toBe('420px');
      });

      it('re-adjusts the scrollTop to account for the difference in the average row height and the height of the newly rendered items at the beginning of the window', function() {
        // scrollTop starts at 600px (20 items not rendered * 30px avg height)
        // 6 items at 40px each of height are rendered at the beginning
        // 600px - 1px scroll + (6 * 10px difference)
        expect(this.list.state.scrollTop).toBe(659);
      });
    });
  });

  describe('on a downward scroll past the end of the list', function() {
    beforeEach(function(done) {
      this.list.scroll(20000000, done);
    });

    it('does not adjust the window past the end of the list', function() {
      expect(this.list.state.winStart).toBe(89);
    });
  });

  describe('on an upward scroll past the beginning of the list', function() {
    beforeEach(function(done) {
      this.list.scroll(-50, done);
    });

    it('does not adjust the window past the beginning of the list', function() {
      expect(this.list.state.winStart).toBe(0);
    });
  });

  describe('on a long scroll', function() {
    beforeEach(function(done) {
      this.list.scroll(1201, done);
    });

    it('sets the window start to the item nearest the scroll postion based on average row height', function() {
      expect(this.list.state.winStart).toBe(40);
    });

    it('sets the padding-top of the content node to the average row height times the number of non-rendered items', function() {
      // 40 items not rendered times 30px avg height
      expect(this.contentNode.style.paddingTop).toBe('1200px');
    });

    it('sets the scrollTop', function() {
      expect(this.list.state.scrollTop).toBe(1201);
    });
  });

  describe('onFirstVisibleItemChange callback', function() {
    it('gets invoked after a scroll changes which item is the first visibile', function(done) {
      expect(this.onFirstVisibleItemChange.calls.count()).toBe(1);

      this.list.scroll(39, () => {
        expect(this.onFirstVisibleItemChange.calls.count()).toBe(1);
        this.list.scroll(2, () => {
          expect(this.onFirstVisibleItemChange.calls.count()).toBe(2);
          expect(this.onFirstVisibleItemChange).toHaveBeenCalledWith(this.items[1], 1);
          done();
        });
      });
    });
  });

  describe('#itemsMutated', function() {
    it('adjusts the window when the last item is removed from the items array', function(done) {
      this.list.scrollToIndex(99, () => {
        expect(this.list.state.winStart).toBe(89);
        this.items.pop();
        this.list.itemsMutated(() => {
          expect(this.list.state.winStart).toBe(88);
          done();
        });
      });
    });

    it("re-renders when an item is replaced", function(done) {
      this.items[0] = {id: 9999, height: 40};
      this.list.itemsMutated(() => {
        let itemNodes = this.node.querySelectorAll('.VirtualList-item');
        expect(itemNodes[0].textContent).toEqual("9999");
        done();
      });
    });
  });
});
