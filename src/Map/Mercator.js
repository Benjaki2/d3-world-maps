import d3 from 'd3';
import Projection from'./Projection';
import $ from 'jquery';
/**
 * Mercrator Projection Class
 * @class
 */
export default class Mercrator extends Projection {
  /**
   * @constructor
   */
  constructor(group, svg, options) {
    super(group, d3.geo.mercator(), svg);
    this.initMer();
    this.projectionType = 'Mercrator';
  }
  initMer() {
    $('.graticule_orth').css('display', 'none');
    $('.graticule_mer').css('display', 'block');
  }
  onZoom() {}
  onZoomStart() {}
}
