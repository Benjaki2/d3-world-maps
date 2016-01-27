# D3 World Maps Template

This library was build to promote data sharing on a global scale.

# How it works

In your html, you must create a div with an id of 'world-map' or create a custom class/id to select. Specify the dimensions here with height & width attributes.

```html
<body>
  <div class='world-map' width='500' height='500'> </div>
</body>

```
# Install 

`npm install d3-world-maps`

# Make a Map

### ES6

```JavaScript
import * as d3WorldMaps from 'd3-world-maps';
```

### CommonJS

```JavaScript
var d3WorldMaps = require('d3-world-maps'); 
```
```JavaScript
/**
 *  Create New Map Instance and set Custom options 
 **/

var map = new d3WorldMaps.WorldMap(
  {
    el: '.world-map', // where the Map Lies
    projection: 'Mercator',
    locationPins: [
      {coords: [55, 55],  opacity:.2},
      {coords: [13, 13], radius: 4},
      {coords: [12, -45], color: 'yellow', radius: 4, opacity:.7}
    ],
    oceanFill: 'black'
);
map.init();
```

# Options

```JavaScript

const defaultOptions = {
  el: '#world-map',
  landFill: 'orange',
  projection: 'Orthographic',
  oceanFill: '#0e1e32',
  locationPins: null
};

```

# Credits

The Orthographic xyz axis drag functionality was inspired by: [Rotate the World](https://www.jasondavies.com/maps/rotate/)

TopoJson was created using [world-atlas](https://github.com/mbostock/world-atlas)

Workflow inspired by [react-serial-forms](https://github.com/LevInteractive/react-serial-forms)