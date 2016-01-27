import Projection from'./Projection';
import d3 from 'd3';
import $ from 'jquery';
const radians = Math.PI / 180;
const degrees = 180 / Math.PI;
/**
 * Orthographic Projection Class
 * @class
 */
export default class Orthographic extends Projection {
  /**
   * @constructor
   */
  constructor(group, svg, options) {
    super(group, d3.geo.orthographic().clipAngle(90), svg);
    this.prjFnc.rotate([0, 0]);
    this.setScale();
    this.zoom.scaleExtent([150, 600]);
    this.projectionType = 'Orthographic';
    this.zoomPoint = null;
    this.initOrth();
  }
  initOrth() {
    $('.graticule_orth').css('display', 'block');
    $('.graticule_mer').css('display', 'none');
  }
  /**
   * Sets projection scale based on dimensions
   * @method
   */
  setScale() {
    if (this.height >= this.width) {
      this.zoom.scale(this.width / 2);
      this.prjFnc.scale(this.width / 2);
    } else {
      this.zoom.scale(this.height / 2 - (this.height * 0.05));
      this.prjFnc.scale(this.height / 2 - (this.height * 0.05));
    }
    this.prjFnc.translate([this.width / 2, this.height / 2]);
  }
  /**
   * Collects Zoom Event properties
   * @method
   */
  onZoomStart() {
    this.mouse0 = d3.mouse(this.group[0][0]);
    this.rotate = this.quaternionFromEuler(this.prjFnc.rotate());
    this.point = this.position(this.prjFnc, this.mouse0);
    if(this.point) { this.zoomPoint = this.point; }
  }
  /**
   * Updates projection after drag
   * @method
   */
  onZoom() {
    this.prjFnc.scale(d3.event.scale);
    let mouse1 = d3.mouse(this.group[0][0]);
    let between = this.rotateBetween(this.zoomPoint, this.position(this.prjFnc, mouse1));
    this.prjFnc.rotate(this.eulerFromQuaternion(this.rotate = between
      ? this.multiply(this.rotate, between)
      : this.multiply(this.bank(this.prjFnc, this.mouse0, mouse1), this.rotate)));
    this.mouse0 = mouse1;
    this.redraw();
  }
  /**
   * Determines appropriate scale and Translate of an onClick Zoom
   * @method
   * @param {string} inOrOut - Variable that says whether to zoom in or out
   */
  zoomClick(inOrOut) {
    let direction = 1,
      factor = 30,
      targetZoom = 1,
      extent = this.zoom.scaleExtent();
    direction = (inOrOut === 'zoom_in') ? 1 : -1;
    targetZoom = this.zoom.scale() + (factor * direction);
    if (targetZoom < extent[0] || targetZoom > extent[1]) { return false; }
    this.interpolateZoom(targetZoom);
  }

  /**
   * Zoom Interpolation Function
   * @method
   * @param {string} scale - New Scale
   */
  interpolateZoom(scale) {
    let self = this;
    return d3.transition().duration(350).tween('zoom', function () {
      let iScale = d3.interpolate(self.zoom.scale(), scale);
      return function (t) {
        self.zoom
          .scale(iScale(t));
        self.zoomed();
      };
    });
  }
  /**
   * Rescales Zoom and Updates paths
   * @method
   */
  zoomed() {
    this.prjFnc.scale(this.zoom.scale());
    this.redraw();
  }
  /**
   * Todo
   * @method
   */
  bank(projection, p0, p1) {
    let t = projection.translate(),
      angle = Math.atan2(p0[1] - t[1], p0[0] - t[0]) - Math.atan2(p1[1] - t[1], p1[0] - t[0]);
    return [Math.cos(angle / 2), 0, 0, Math.sin(angle / 2)];
  }
  /**
   * Todo
   * @method
   */
  position(projection, point) {

    projection.translate();
    let spherical = projection.invert(point);

    return spherical && isFinite(spherical[0]) && isFinite(spherical[1]) && this.cartesian(spherical);
  }
  /**
   * Todo
   * @method
   */
  quaternionFromEuler(euler) {
    let λ = .5 * euler[0] * radians;
    let φ = .5 * euler[1] * radians;
    let γ = .5 * euler[2] * radians,
      sinλ = Math.sin(λ), cosλ = Math.cos(λ),
      sinφ = Math.sin(φ), cosφ = Math.cos(φ),
      sinγ = Math.sin(γ), cosγ = Math.cos(γ);
    return [
      cosλ * cosφ * cosγ + sinλ * sinφ * sinγ,
      sinλ * cosφ * cosγ - cosλ * sinφ * sinγ,
      cosλ * sinφ * cosγ + sinλ * cosφ * sinγ,
      cosλ * cosφ * sinγ - sinλ * sinφ * cosγ
    ];
  }
  /**
   * Todo
   * @method
   */
  multiply(a, b) {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return [
      a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3,
      a0 * b1 + a1 * b0 + a2 * b3 - a3 * b2,
      a0 * b2 - a1 * b3 + a2 * b0 + a3 * b1,
      a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0
    ];
  }
  /**
   * Todo
   * @method
   */
  rotateBetween(a, b) {
    if(!a || !b){ return null; }
    let axis = this.cross(a, b);
    let self = this;
    let norm = Math.sqrt(self.dot(axis, axis));
    let halfγ = .5 * Math.acos(Math.max(-1, Math.min(1, self.dot(a, b))));
    let k = Math.sin(halfγ) / norm;

    return (norm && [Math.cos(halfγ), axis[2] * k, -axis[1] * k, axis[0] * k]);
  }
  /**
   * Todo
   * @method
   */
  eulerFromQuaternion(q) {
    return [
      Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), 1 - 2 * (q[1] * q[1] + q[2] * q[2])) * degrees,
      Math.asin(Math.max(-1, Math.min(1, 2 * (q[0] * q[2] - q[3] * q[1])))) * degrees,
      Math.atan2(2 * (q[0] * q[3] + q[1] * q[2]), 1 - 2 * (q[2] * q[2] + q[3] * q[3])) * degrees
    ];
  }
  /**
   * Todo
   * @method
   */
  cartesian(spherical) {
    let λ = spherical[0] * radians;
    let φ = spherical[1] * radians,
      cosφ = Math.cos(φ);
    return [
      cosφ * Math.cos(λ),
      cosφ * Math.sin(λ),
      Math.sin(φ)
    ];
  }
  /**
   * Todo
   * @method
   */
  dot(a, b) {
    let s = 0;
    for (let i = 0, n = a.length; i < n; ++i) {
      s += a[i] * b[i];
    }
    return s;
  }
  /**
   * Todo
   * @method
   */
  cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

}


