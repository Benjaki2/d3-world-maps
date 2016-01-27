/*eslint-env node, mocha */

/*
*****************************
**** Testing d3 methods *****
**** with jsdom & chai  *****
*****************************
*/
import chai from 'chai';
import WorldMap from '../../src/Map/Map.js';
import sinonChai from 'sinon-chai';
import d3 from 'd3';
chai.use(sinonChai);

let expect = chai.expect;

const points = [
  {coords: [55, 55],  opacity:.7},
  {coords: [13, 13], radius: 0.5, opacity:.7},
  {coords: [12, -45], radius: 0.5, opacity:.7}
];

describe('Map Qs ', function() {
  let map;
  let group;
  let svg;
  map = new WorldMap();
  beforeEach('build mock svg', function(){
    svg = d3.select(document).select('div').append('svg');
    group = svg.append('g');
  });
  afterEach('remove mock svg', function(){
    svg = '';
    group ='';
  });
  it('setPoints method Should Create path point elements', function() {
    map.setPoints(points, group);
    expect(svg.selectAll('.point')[0]).to.have.length.of(3);
  });
  it('should have a default element', function() {
    expect(map.el).to.equal('#world-map');
  });
  it('should have a list of countries', function() {
    expect(map.countries).to.be.an('object');
  });

  it('createGraticules method should create two Graticule Outlines', function() {
    map.createGraticules(group);
    expect(svg.selectAll('.graticule')[0]).to.have.length.of(2);
  });
});
