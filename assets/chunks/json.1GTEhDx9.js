import"./graph.rVcXUsE6.js";import{J as i,am as d,an as o}from"../app.JhorOYlA.js";function m(e){var n={options:{directed:e.isDirected(),multigraph:e.isMultigraph(),compound:e.isCompound()},nodes:u(e),edges:s(e)};return i(e.graph())||(n.value=d(e.graph())),n}function u(e){return o(e.nodes(),function(n){var a=e.node(n),r=e.parent(n),t={v:n};return i(a)||(t.value=a),i(r)||(t.parent=r),t})}function s(e){return o(e.edges(),function(n){var a=e.edge(n),r={v:n.v,w:n.w};return i(n.name)||(r.name=n.name),i(a)||(r.value=a),r})}export{m as w};