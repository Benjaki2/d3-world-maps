import d3 from 'd3';

/**
 * @class
 */
export default class Projection {
  /**
   * @constructor
   */
  constructor(group, prjFnc, svg) {
    if (!group) {
      throw new Error('group is a required argument.');
    }

    this.height = parseFloat(svg.style('height').replace(/px/, ''));
    this.width = parseFloat(svg.style('width').replace(/px/, ''));
    this.svg = svg;
    this.group = group;
    this.paths = this.group.selectAll('path');
    this.prjFnc = prjFnc.translate([this.width/2, this.height/2]);
    this.pathGenerator = d3.geo.path();
    this.zoom = d3.behavior.zoom();
    this.extent = [[0, 0], [this.width, this.height]];
    this.init();
  }
  /**
   * Initializes the projection
   * @Method
   */
  init() {
    this.zoom.on('zoom', this.onZoom.bind(this));
    this.zoom.on('zoomstart', this.onZoomStart.bind(this));

    this.svg.call(this.zoom)
      .on('mousewheel.zoom', null)
      .on('DOMMouseScroll.zoom', null)
      .on('mousemove.zoom', null)
      .on('wheel.zoom', null)
      .on('MozMousePixelScroll.zoom', null)
      .on('dblclick.zoom', null);
    this.pathGenerator.projection(this.prjFnc);
  }
  /**
   * Updates collection of Path elements when new element is added
   * @Method
   */
  collectPaths() {
    this.paths = this.group.selectAll('path');
  }
  /**
   * Updates d attributes of Path elements
   * @Method
   */
  redraw() {
    this.paths.attr('d', this.pathGenerator.pointRadius(function(d) { return d.radius; }));
  }
}

