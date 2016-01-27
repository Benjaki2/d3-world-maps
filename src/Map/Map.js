import countryJson from '../../assets/topo_countries.json';
import d3 from 'd3';
import topojson from 'topojson';
import Mercator from './Mercator';
import Orthographic from './Orthographic';
import defualtOptions from './options';
import $ from 'jquery';

const PROJECTIONS = {
  Mercator,
  Orthographic
};

/**
 * Creates a new Map.
 * @class
 */
export default class WorldMap {
  /**
   * @constructor
   */
  constructor(options) {
    this.options = $.extend(defualtOptions, options);
    this.el = this.options.el;
    this.pointRadius = this.options.pointRadius || 0.5;
    this.projectionType = this.options.projection;
    this.landFill = this.options.landFill;
    this.oceanFill = this.options.oceanFill;
    //this.scaleLimits = this.options.scaleLimits;
    this.countries = topojson.feature(countryJson, countryJson.objects.countries);
    this.inited = false;
  }
  /**
   * Initializes the map
   * @Method
   */
  init() {
    this.mapDiv = d3.select(this.el);
    if (!this.mapDiv) {
      throw new Error('Must create an element with a ' + this.el + ' element to create the SVG');
    }
    this.svg = this.mapDiv
      .append('svg')
      .attr('class', 'mapsvg');
    this.setDimensions(this.el);
    this.group = this.svg.append('g').attr('class', 'country-group');
    this.graticuleGroup = this.group.append('g').attr('class', 'grat_group');
    this.paths = this.group.append('g').selectAll('path')
      .data(this.countries.features)
      .enter()
      .append('path')
      .attr('id', function(d) { return d.properties.n; })
      .attr('class', 'land')
      .style('fill', this.landFill);
    this.createGraticules(this.graticuleGroup);
    this.setProjection(this.projectionType);

  /**
   * Creating group containers for Map elements
   */
    if(this.options.overlay) {
      this.overlay = this.group.append('g').attr('class', 'overlays');
    }
    if(this.options.bubbles) {
      this.bubbles = this.group.append('g').attr('class', 'points');
    }
    if(this.options.locationPins) {
      this.locationPins = this.group.append('g');
      this.setPoints(this.options.locationPins, this.locationPins);
      this.projection.collectPaths();
      this.projection.redraw();
    }
    this.inited = true;
  }
  /**
   * Sets projection of Map.
   * @method
   * @param {string} projection - Map Projection.
   */
  setProjection(projection) {
    if(this.projection) {
      this.projection.destroy();
    }
    this.projection = new PROJECTIONS[projection](this.group, this.svg, this.options);
    this.projection.redraw();
  }
  /**
   * Sets projection of Map.
   * @method
   * creates a graticle for  Mercator & Orthographic Projections
   */
  createGraticules(group) {
    let graticuleOrth = d3.geo.graticule().extent([[-179.9999, -79.999], [179.999, 79.999]]);
    let graticuleMer = d3.geo.graticule();
    group.append('path')
      .datum(graticuleOrth)
      .attr('class', 'graticule graticule_orth')
      .style('fill', this.oceanFill);
    group.append('path')
      .datum(graticuleOrth.outline())
      .attr('class', 'outline_orth outline graticule_orth')
      .style('fill', this.oceanFill);
    group.append('path')
      .datum(graticuleMer)
      .attr('class', 'graticule graticule_mer')
      .style('fill', this.oceanFill);
    group.append('path')
      .datum(graticuleMer.outline())
      .attr('class', 'outline_mer outline graticule_mer')
      .style('fill', this.oceanFill);
  }
  /**
   * Sets the height, width, and margins of the SVG based on window-size.
   * @method
   */
  setDimensions(el) {
    this.w = $(el).width();
    this.h = $(el).height();
    this.svg
      .attr('height', this.h)
      .attr('width', this.w);
  }
  /**
   * Sets Points on map.
   * @method
   * @param {Object[]} array of points
   */
  setPoints(points, group) {
    group.selectAll('path')
      .data(points)
      .enter()
      .append('path')
      .attr('class', 'point')
      .style('fill', this.options.pointsFill)
      .attr('opacity', (d) => {
        if(d.opacity){
          return d.opacity;
        } else {
          return 1;
        }
      })
      .datum((d) => {
        if(!d.radius) {
          d.radius = 5;
        }
        return {type: 'Point', coordinates: [d.coords[0], d.coords[1]], radius: d.radius};
      });
  }
  /**
   * Sets Overlay on map.
   * @method
   * @param {JSON} - Topojson to be used on map.
   * @param {Object[]} - Range that will be used to create a color gradient
   * Commming soon
   */
  // setOverlay(yearData, range) {
  //   if(this.overlay){this.destroy('overlay'); }
  //   let color = d3.scale.linear()
  //     .domain(range)
  //     .range(['transparent', this.options.overlayColor]);
  //   let result = JSON.parse(yearData);
  //   let topo = topojson.feature(result, result.objects['filtered-vector']);
  //   this.overlay.selectAll('path')
  //     .data(topo.features)
  //     .enter()
  //     .append('path')
  //     .attr('id', function(d) { return d.properties.id; })
  //     .style('fill', function(d) { return color(d.properties.n); })
  //     .attr('class', 'overlay')
  //     .attr('d', this.projection.pathGenerator);
  // }

}
