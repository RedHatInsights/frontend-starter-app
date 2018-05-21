import React from 'react';
import { RouteComponentProps as RouteProps, withRouter } from 'react-router-dom';
import map from './DashboardMap.json';
import merge from 'lodash/merge';
import forOwn from 'lodash/forOwn';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import './DashboardMap.scss';

let conf = {
    rotate: [20, 0, 0],
    transitionTime: 250,
    coordinates: [
        [-97, 38], // center of us
        [-106.3468, 56.1304], // center of canada
        [10.4515, 51.1657], // center of germany
        [0.1278, 51.5074] // London
    ]
};

type Props = {};
type State = {};

class DashboardMap extends React.Component<RouteProps<any> & Props, State> {
    constructor(props) {
        super(props);
        this.deployment_types = {
            all: 'All',
            pubc: 'Public Cloud',
            privc: 'Private Cloud',
            virt: 'Virtual',
            phy: 'Physical'
        };

        this.state = {
            activeButton: this.deployment_types.all
        };

        window.addEventListener('resize', this.reInitMap.bind(this));
    }

    /**
     * Starts map initialization.
     */
    componentDidMount() {
        this.setConf();
        this.initMap();
    }

    /**
     * configuration settings needed by the map.
     */
    setConf() {
        const map_container = document.querySelector('#map');
        const width = map_container.clientWidth;
        const height = map_container.clientHeight;
        const scale = height / 2;
        const initX = width / 2;
        const initY = height / 2 + 300;
        const pinWidth = .03 * width;
        const pinHeight = .03 * height;
        const maxScaleMultiplier = 3;

        conf = merge(conf, {
            height: height,
            width: width,
            scale: scale,
            maxScaleMultiplier: maxScaleMultiplier,
            scaleExtent: [scale,  maxScaleMultiplier * scale],
            initX: initX,
            initY: initY,
            initTrans: [initX, initY],
            pinHeight: pinHeight,
            pinWidth: pinWidth,
            pinOffsetX: pinWidth / 2,
            pinOffsetY: pinHeight,
            popoverWidth: .1 * width,
            popoverHeight: .05 * height
        });
    }

    /**
     * Initializes the projection, path, zoom, and svg needed
     * to render and create the map functionality
     */
    initMap() {
        this.projection = d3.geoMercator()
            .rotate(conf.rotate)
            .fitSize([conf.width, conf.height], topojson.feature(map, map.objects.countries))
            .scale(conf.scale);

        const translate = this.projection.translate();
        this.tlast = {
            k: conf.scale,
            x: translate[0],
            y: translate[1]
        };

        this.path = d3.geoPath().projection(this.projection);

        this.zoom = d3.zoom()
            .scaleExtent(conf.scaleExtent)
            .on('zoom', this.zoomed.bind(this));

        this.svg = d3.select('#map')
            .append('svg')
            .attr('width', conf.width)
            .attr('height', conf.height)
            .call(this.zoom)
            .call(this.zoom.transform, d3.zoomIdentity.translate(this.tlast.x, this.tlast.y).scale(conf.scale))
            .on('dblclick.zoom', null);

        this.pins = this.svg.append('g').attr('class', 'deploymentPins')
            .selectAll('svg')
            .data(conf.coordinates)
            .enter().append('svg:image')
            .attr('width', conf.pinWidth)
            .attr('height', conf.pinHeight)
            .attr('x', d => this.projection(d)[0] - conf.pinOffsetX)
            .attr('y', d => this.projection(d)[1] - conf.pinOffsetY)
            .attr('xlink:href', () => {
                // TODO: CHANGE WHEN YOU KNOW WHERE SYSTEM LOCATION DATA IS KEPT
                if (Math.random() > .5) {
                    return '/insights/images/i_pin-has-error.svg';
                } else {
                    return '/insights/images/i_pin-good.svg';
                }
            })
            .on('mouseenter', d => {
                // sets position of popover to pin location.
                const svgCoord = this.getCoords(d);
                const pos = [
                    `left:${svgCoord.x + conf.popoverWidth * 1.30}px;`,
                    `top:${svgCoord.y + -5}px`,
                ].join('');
                console.log('mouseentered');
                this.popover.attr('style', pos);
                this.popover.style('display', 'inline');
            });

        this.popover = d3.select('#popover')
            .attr('id', 'popover')
            .attr('width', conf.popoverWidth)
            .attr('height', conf.popoverHeight)
            .style('display', 'none');

        this.countries = this.svg.selectAll('path')
            .data(topojson.feature(map, map.objects.countries).features)
            .enter().insert('path', 'g')
            .attr('id', d => d.id)
            .attr('d', this.path)
            .on('dblclick', (d => {
                // resets any path that might have been active from another double click
                this.countries.classed('active', false);
                const feature = {type: "FeatureCollection", features: [d]};
                const prevScale = this.projection.scale();
                const prevTrans = this.projection.translate();
                const prevRotate = this.projection.rotate();
                const centroid = this.projection.invert(this.path.centroid(d));

                // centers country on x-axis b/c it messes up when part of the country is
                // not centered.
                this.projection.rotate([-centroid[0], 0, 0]);

                // auto translates and scales around path (aka. country)
                this.projection.fitSize([conf.width, conf.height], feature);

                // get new translation and scale.
                const trans = this.projection.translate();
                const scale = this.projection.scale();

                if (scale < conf.scaleExtent[0]) {
                    conf.scaleExtent[0] = scale;
                    this.zoom.scaleExtent(conf.scaleExtent);
                } else if (scale > conf.scaleExtent[1]) {
                    conf.scaleExtent[1] = scale;
                    this.zoom.scaleExtent(conf.scaleExtent);
                }

                // reset translation, rotation and scale b/c of interpolation
                this.projection.translate(prevTrans);
                this.projection.scale(prevScale);
                this.projection.rotate(prevRotate);

                this.tlast = {
                    k: scale - scale / (scale * .2),
                    x: prevTrans[0],
                    y: trans[1]
                };

                if (Math.floor(prevScale) !== Math.floor(scale) &&
                    Math.floor(prevTrans[1]) !== Math.floor(trans[1])) {
                    d3.select(d3.event.target).classed('active', true);
                    this.interpolateMapMovement({
                        nextRotate: [-centroid[0], 0, 0],
                        nextScale: this.tlast.k,
                        nextTrans: [this.tlast.x, this.tlast.y]
                    });
                } else {
                    d3.select(d3.event.target).classed('active', false);
                    this.recenterMap();
                }
            }).bind(this));
    }

    reInitMap() {
        this.setConf();

        this.svg.attr('width', conf.width)
            .attr('height', conf.height);

        this.projection.scale(conf.scale)
            .translate(conf.initTrans);
    }

    /**
     * Figures out the angle needed to rotate from the last x position to the new x position.
     *
     * @param newX The new coordinate on the x-axis
     * @param lastX The previous coordinate on the x-axis
     * @returns {number} returns the angle needed to rotate the projection
     *                   (Ex. this.projection.rotate([this.projection.rotate()[0] + angle, 0, 0],
     *                   where angle is the return value of this function)
     *
     */
    getRotateAngle(newX, lastX) {
        return ((((newX - lastX) * 360) / conf.width) * conf.scale) / this.projection.scale();
    }

    /**
     * Changes the map projections (this.projection) scale, tranlation, and rotation
     * based on the users input/cursor movement.
     */
    zoomed() {
        if (d3.event && this.countries) {
            const transform = d3.event.transform;
            const prevTranslate = this.projection.translate();
            const yaw = this.projection.rotate()[0];

            if (transform.k !== this.tlast.k) {
                this.projection.scale(transform.k);
            } else {
                // Rotates map from left to right/right to left
                const angle = this.getRotateAngle(transform.x, this.tlast.x, transform.k);
                this.projection.rotate([yaw + angle, 0, 0]);

                // Moves map from top to bottom/bottom to top
                const dy = transform.y - this.tlast.y;
                this.projection.translate([prevTranslate[0], prevTranslate[1] + dy]);
            }

            if (Math.floor(prevTranslate[1]) !== Math.floor(this.projection.translate()[1])) {
                this.countries.classed('active', false);
            }

            this.tlast = transform;
            this.renderMap();
        }
    }

    /**
     * updates the locations of the pins whenever the projection has changed.
     *
     * @param transition Tells whether or not to add a transition delay to the movement
     *                   of the pins
     */
    updatePins(transition) {
        if (transition) {
            this.pins.transition()
                .duration(conf.transitionTime)
                .attr('x', d => this.projection(d)[0] - conf.pinOffsetX)
                .attr('y', d => this.projection(d)[1] - conf.pinOffsetY);
        } else {
            this.pins
                .attr('x', d => this.projection(d)[0] - conf.pinOffsetX)
                .attr('y', d => this.projection(d)[1] - conf.pinOffsetY);
        }
    }

    /**
     * Draws all the paths and pins on the svg.
     * This needs to be called whenever a change is made to the projection
     */
    renderMap() {
        this.popover.style('display', 'none');
        this.updatePins();
        this.countries.attr('d', this.path);
    }

    /**
     * Sets the zoomIdentity which is needed to keep the zoom transformations
     * and projection transformations equivalent.
     */
    setZoomIdentity() {
        const trans = this.projection.translate();
        const scale = this.projection.scale();
        this.svg
            .call(this.zoom.transform, d3.zoomIdentity.translate(trans[0], trans[1]).scale(scale));
    }

    /**
     * changes DOM coordinates to SVG coordinates.
     *
     * @param d an array of coordinates (Ex. [-106.3468, 56.1304])
     * @returns the svg coordinates of the corresponding DOM coordinates
     */
    getCoords(d) {
        // used to switch from DOM coordinates into SVG
        // coordinates.
        const svg = this.svg._groups[0][0];
        const pt = svg.createSVGPoint();
        const domCoords = this.projection(d);

        pt.x = domCoords[0];
        pt.y = domCoords[1];

        return pt.matrixTransform(svg.getCTM().inverse());
    }

    /**
     * Used by the zoom controls to increase the scale to the next scale factor.
     *
     * @param zoomIn True if user clicks the zoom in button and false if
     *               the zoom out button is clicked.
     */
    zoomInOut(zoomIn) {
        const scaleMultiplier = Math.floor(this.projection.scale() / conf.scale);
        let scale = zoomIn ? conf.scale * (scaleMultiplier + 1) :
            conf.scale * (scaleMultiplier - 1);

        if (scale > conf.scaleExtent[1] || scale < conf.scaleExtent[0]) {
            scale = this.projection.scale();
        }

        this.interpolateMapMovement({
            nextRotate: this.projection.rotate(),
            nextScale: scale,
            nextTrans: this.projection.translate()
        });
    }

    /**
     * Moves projection to initial map position.
     */
    recenterMap() {
        const prevTrans = this.projection.translate();
        const prevScale = this.projection.scale();

        this.projection.fitSize([conf.width, conf.height], topojson.feature(map, map.objects.countries));

        const trans = this.projection.translate();

        this.projection.translate(prevTrans);
        this.projection.scale(prevScale);

        this.interpolateMapMovement({
            nextRotate: conf.rotate,
            nextScale: conf.scale,
            nextTrans: [prevTrans[0], trans[1]]
        });
    }

    /**
     * This changes the maps rotation in the x-axis, the scale, and translation of the projection.
     * It adds a transition as well equal to conf.transitionTime.
     *
     * @param nextRotate The angle you want to add to the current rotation in the x direction
     * @param nextScale The new scale for the map.
     * @param nextTrans the new translation for the map.
     */
    interpolateMapMovement({ nextRotate, nextScale, nextTrans }) {
        const currentTrans = this.projection.translate();
        const currentScale = this.projection.scale();
        const currentRotate = this.projection.rotate();
        let bool = false;
        this.popover.style('display', 'none');
        this.countries.transition()
            .duration(conf.transitionTime)
            .attrTween("d", (d => {
                const r = nextRotate ? d3.interpolate(currentRotate, nextRotate) : null;
                const s = nextScale ? d3.interpolate(currentScale, nextScale) : null;
                const trans = nextTrans ? d3.interpolate(currentTrans, nextTrans) : null;
                return (t => {
                    this.projection.scale(s ? s(t) : currentScale)
                        .translate(trans(t))
                        .rotate(r(t));
                    this.updatePins();
                    return this.path(d);
                }).bind(this);
            }).bind(this))
            .on('end', () => {
                if (!bool) {
                    this.setZoomIdentity();
                    bool = true;
                }
            });
    }

    render() {
        const btns = ['All', 'Public Cloud', 'Private Cloud', 'Virtual', 'Physical'];
        const MapToolbarButtons = btns.map(str => {
            return (
                <button key={str}
                        className={this.state.activeButton === str ? 'active' : null}
                        onClick={() => this.setState({activeButton: str})}>
                    {str}
                </button>
            );
        });
        console.log(MapToolbarButtons);
        return (
          <React.Fragment>
              <div className='ins-c-map-controls'>
                  <div className='ins-c-map__toolbar'>
                      {MapToolbarButtons}
                  </div>
                  <div className='ins-c-map-navigation'>
                      <button className='ins-c-map-navigation__center' onClick={this.recenterMap.bind(this)}>
                          <i className='fas fa-crosshairs'></i>
                      </button>
                      <button className='ins-c-map-navigation__zoom' onClick={this.zoomInOut.bind(this, true)}>
                          <i className='fas fa-plus'></i>
                      </button>
                      <button className='ins-c-map-navigation__zoom' onClick={this.zoomInOut.bind(this, false)}>
                          <i className='fas fa-minus'></i>
                      </button>
                  </div>
              </div>
              <div id='map'>
                  <div id='popover'/>
              </div>
          </React.Fragment>
        );
    }
}

export default withRouter(DashboardMap);
