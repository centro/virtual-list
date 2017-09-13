# VirtualList

`VirtualList` is a React component that virtualizes the rendering of its item rows in order to
provide an efficient, high performing list view capable of handling a huge number of items.

What sets `VirtualList` apart from other virtualized list implementations is that it makes no
assumptions about the heights of your individual rows. It works with arbitrarily sized rows and even
rows whose sizes are purely determined by the browser. Thus, you should be able to swap this
component in for any vertical list view that is rendered inside some fixed height container.

## Usage

Using `VirtualList` is straightforward. Simply give it an array of items and a component to use
as the individual item views. The item view component will be passed `itemIndex` and `item`
props representing the index of the item in the array and the item itself.

```
<VirtualList items={myItemArray}>
  <MyItemView />
</VirtualList>
```

## How it works

`VirtualList` makes an informed guess about how many rows it should initially render based on an
average row height of the first 10 item rows. This defines a render "window". Then, as the user
scrolls the list, it checks to see which items have scrolled out of view on and slides the window by
that many items. This means that you can have arbitrarily sized rows and even rows whose sizes are
purely determined by the browser. Thus, you should be able to swap this component in for any
vertical list view that is rendered inside some fixed height container.

The `VirtualList` must be rendered inside of a fixed size container because it is
positioned absolutely with `top`, `right`, `bottom`, and `left` offsets of `0`. The item views are
rendered inside of a nested content div. This content div has its top padding set to the average row
height times the number of items before the rendered window. The bottom padding is set
similarily. This is what creates the scrollable area and causes the browser to add an
appropriately sized scrollbar. As the user scrolls through the list and the window is adjusted,
the paddings are also adjusted accordingly.

## Caveats

Since the component only renders a subset of the given items, using the in-browser search function
will not find matches on items outside of the current render window. If search functionality is
necessary, it'll have to be implemented in the application in order to work with `VirtualList`.

## A note about paging

`VirtualList` takes an array of item model objects as a prop, however it doesn't actually process
the entire array unless the list is scrolled all the way to the bottom. It only looks at the items
in the current window when it makes a render pass. We can take advantage of this fact to implement
lists that load their content from the server as the user scrolls. This is a major performance boon
for applications that need to display long lists. Not only is the rendering of these lists lightning
fast, but the browser only needs to load a few items from the server at a time instead of
the entire list.

In order to do this you need to pass the `VirtualList` a special array that is capable of paging
itself. This is a sparsely populated array whose `length` property returns the length of the full
list, even when the content is only partially present. You must then pass the `VirtualList` a
function as the `getItem` prop that will fetch and populate the next page of the list as determined
by the given index.

The [Transis][transis] data modeling library contains a query array class that does just this and was
designed to work with `VirtualList`. At Centro we used `Transis` and `VirtualList` to reduce a
painfully slow multi-minute loading index page down to 1 second load times with much better
scrolling performance.

## Examples

* [Basic list with 1000 items of varying row height][example1]
* [Editable list][example2]
* [List with inputs that can be tabbed through][example3]

[transis]: https://github.com/centro/transis
[example1]: https://centro.github.io/virtual-list/examples/1.html
[example2]: https://centro.github.io/virtual-list/examples/2.html
[example3]: https://centro.github.io/virtual-list/examples/3.html

