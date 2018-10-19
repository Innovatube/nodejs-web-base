import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import isNumber from 'lodash.isnumber';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import './index.css';
import './switch-button.css';
import {
  initMap, decodePolyline, renderPolyline, renderMarker, addEvent, renderInfoWindow, renderTrafficPolyline, showCorrectTrafficColor, renderIdJob,
} from './map';
import {
  ROUTE, POINT, UNSERVED, HOME, BOX, ERROR, MARKER, START,
} from './constants';
import ColorHelper from '../../containers/DisplayRoute/Timeline/helper/color';
import { startMoveRoute } from '../../../actions/moveRoute';
import { selectPlan } from '../../../actions/fleet';
import { selectStop } from '../../../actions/stop';
import infoWindow from './InfoWindow';
import './snazzy-info-window.css';

const zIndex = {
  hoverWindow: 3,
  moveAndResequence: 2,
  vehicleInfo: 1,
};

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.markerWindow = null;
    this.activePolyline = null;
    this.map = null;
    this.lastestPolyline = null;
    this.lastestTraffic = null;
    this.setOfPaths = [];
    this.activeMarkers = [];
    this.setOfMarkers = [];
    this.setOfTraffic = [];
    this.setOfBorderPolyline = [];
    this.setOfPathOpacity = [];
    this.setOfLabel = [];
  }

  componentDidMount() {
    const {
      data, stop, vehicle,
    } = this.props;
    if (data && stop && vehicle) {
      this.initializeDynamicMap(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      data, stop, vehicle,
    } = nextProps;
    if (data.plans && stop && vehicle) {
      if (!(isEqual(this.props.data, nextProps.data)
      && isEqual(this.props.stop, nextProps.stop)
      && isEqual(this.props.vehicle, nextProps.vehicle))) {
        /**
         * reset data when re-render
         */
        this.setOfPaths = [];
        this.activeMarkers = [];
        this.setOfMarkers = [];
        this.setOfTraffic = [];
        this.setOfBorderPolyline = [];
        this.initializeDynamicMap(nextProps);
      }
      if (nextProps.selectedPlanId) {
        const pathIndex = data.plans.findIndex(plan => plan.id === nextProps.selectedPlanId);
        if (pathIndex !== -1) {
          const plansLenth = data.plans.length;
          this.highLightPolyline(plansLenth, pathIndex);
        }
      }
      if (nextProps.selectedStopId) {
        this.renderUnserved(nextProps.selectedStopId);
      }
      if (nextProps.hiddenPlans && nextProps.hiddenPlans.length !== this.props.hiddenPlans.length) {
        this.displayLabel(this.state, nextProps);
        this.togglePolyline(nextProps);
        nextProps.hiddenPlans.map((hiddenPlan) => {
          if (this.markerWindow && this.markerWindow.planId && hiddenPlan === this.markerWindow.planId) {
            this.markerWindow.close();
          }

          return hiddenPlan;
        });
      }
    }
  }


  shouldComponentUpdate(nextProps) {
    if (isEqual(this.props.data, nextProps.data)
    && isEqual(this.props.stop, nextProps.stop)
    && isEqual(this.props.vehicle, nextProps.vehicle)) {
      return (this.props.isShowTraffic !== nextProps.isShowTraffic)
      || (this.props.hiddenPlans.length !== nextProps.hiddenPlans.length)
      || (nextProps.isShowOrder !== this.props.isShowOrder)
      || (this.props.isShowLabel !== nextProps.isShowLabel);
    }

    return true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isShowTraffic !== this.props.isShowTraffic) {
      this.changeColorPolyline(this.map, this.props);
    }
    // always check label status
    this.displayLabel(this.state, this.props);

    if (prevProps.isShowOrder !== this.props.isShowOrder) {
      this.setOfMarkers.map((col, index) => { // eslint-disable-line
        const color = ColorHelper.pathColor(index, this.setOfMarkers.length);
        col.map((marker, itemIndex) => { // eslint-disable-line
          if (this.props.isShowOrder) {
            marker.setIcon({
              path: MARKER,
              fillColor: 'white',
              fillOpacity: 1,
              anchor: new window.google.maps.Point(0, 0),
              scale: 0.2,
              labelOrigin: new window.google.maps.Point(43, 50),
              strokeColor: color,
              strokeWeight: 2,
            });
            marker.setLabel({
              text: (itemIndex + 1).toString(),
              color,
              fontSize: '12px',
            });
          } else {
            marker.setIcon({
              path: BOX,
              fillColor: color,
              fillOpacity: 1,
              anchor: new window.google.maps.Point(0, 0),
              scale: 0.2,
            });
            marker.setLabel(null);
          }
        });
        if (this.props.selectedPlanId) {
          const pathIndex = this.props.data.plans.findIndex(plan => plan.id === this.props.selectedPlanId);
          if (pathIndex !== -1) {
            const plansLenth = this.props.data.plans.length;
            this.highLightPolyline(plansLenth, pathIndex);
          }
        }
      });
    }
  }

  displayLabel = (state, props) => {
    if (props.isShowLabel) {
      this.setOfLabel.map((label) => {
        const hiddenPlan = props.hiddenPlans.indexOf(label.planId);
        if (hiddenPlan === -1) {
          label.open();
        } else {
          label.close();
        }

        return label;
      });
    } else {
      this.setOfLabel.map(label => label.close());
    }
  }

  handleTrafficOn = (distance, eta) => {
    const convertedDistance = distance / 1000;
    const convertedEta = eta / 60;
    const percentage = convertedDistance / convertedEta;
    if (percentage < 15) {
      return '#820A0D';
    } if (percentage >= 15 && percentage < 30) {
      return '#E31B1F';
    } if (percentage >= 30 && percentage < 45) {
      return '#FDC02F';
    }

    return '#74BA59';
  }

  initializeDynamicMap = (props) => {
    const { data, vehicle } = props;
    let center = null;
    if (data.plans && data.plans.length > 0) {
      center = decodePolyline(data.plans[0].legs[0].route)[0]; //eslint-disable-line
    } else if (vehicle && vehicle.length > 0) {
      center = {
        lat: parseFloat(vehicle[0].lat_start),
        lng: parseFloat(vehicle[0].lng_start),
      };
    }
    const map = initMap('map', {
      center,
      zoom: 10,
    });
    this.map = map;
    this.props.mapRef(this.map);
    window.google.maps.event.addListener(map, 'click', () => {
      if (this.markerWindow) {
        this.props.selectStop(false);
        this.markerWindow.close();
        this.markerWindow = null;
      }
    });
    this.displayRoute(map, props);
  }

  handleClickRoute = (refresh, coordinate) => {
    refresh();
    this.map.setCenter(coordinate);
  }

  displayRoute = (map, props) => {
    const { data, vehicle, stop } = props;
    this.mapSetUnserved(props);
    if (data.plans) {
      const plansLenth = data.plans.length;
      data.plans.map((plan, index) => {
        this.setOfTraffic[index] = [];
        const borderPolyline = this.mapSetBorderPolyline(index, props);
        const { polyline, color } = this.mapSetPolyline(index, props, borderPolyline);
        if (index === plansLenth - 1) {
          this.lastestPolyline = polyline;
        }
        const childMarker = [];
        const vehicleInfo = vehicle.find(item => item.client_vehicle_id === plan.client_vehicle_id);
        if (!vehicleInfo) return false;
        const vehicleId = plan.id;
        if (plan.legs) {
          let lastTraffic = null;
          plan.legs.map((leg, legIndex) => {
            this.setOfTraffic[index][legIndex] = [];
            const line = renderTrafficPolyline(leg.route);
            const trafficColor = this.handleTrafficOn(leg.distance, leg.eta);
            for (let i = 0; i < line.length - 1; i++) {
              if (!lastTraffic) {
                lastTraffic = line[i];
                const trafficLine = renderPolyline([], {
                  strokeColor: trafficColor,
                  strokeWeight: 7,
                  strokeOpacity: 1,
                  zIndex: -2,
                });
                trafficLine.getPath().push(lastTraffic);
                trafficLine.getPath().push(line[i + 1]);
                lastTraffic = line[i + 1];
                trafficLine.setMap(map);
                trafficLine.setVisible(this.props.isShowTraffic);
                this.setOfTraffic[index][legIndex][i] = trafficLine;
              } else if (i === 0) {
                const trafficLine1 = renderPolyline([], {
                  strokeColor: trafficColor,
                  strokeWeight: 7,
                  strokeOpacity: 1,
                  zIndex: -2,
                });
                trafficLine1.getPath().push(lastTraffic);
                trafficLine1.getPath().push(line[i]);
                trafficLine1.setMap(map);
                trafficLine1.setVisible(this.props.isShowTraffic);
                // set
                lastTraffic = line[i];
                // set
                const trafficLine2 = renderPolyline([], {
                  strokeColor: trafficColor,
                  strokeWeight: 7,
                  strokeOpacity: 1,
                  zIndex: -2,
                });
                trafficLine2.getPath().push(lastTraffic);
                trafficLine2.getPath().push(line[i + 1]);
                trafficLine2.setMap(map);
                trafficLine2.setVisible(this.props.isShowTraffic);
                lastTraffic = line[i + 1];
                this.setOfTraffic[index][legIndex][i] = [
                  trafficLine1,
                  trafficLine2,
                ];
              } else {
                const trafficLine = renderPolyline([], {
                  strokeColor: trafficColor,
                  strokeWeight: 7,
                  strokeOpacity: 1,
                  zIndex: -2,
                });
                trafficLine.getPath().push(lastTraffic);
                trafficLine.getPath().push(line[i + 1]);
                lastTraffic = line[i + 1];
                trafficLine.setMap(map);
                trafficLine.setVisible(this.props.isShowTraffic);
                this.setOfTraffic[index][legIndex][i] = trafficLine;
              }
            }
            decodePolyline(leg.route, (point) => {
              polyline.getPath().push(point);
              borderPolyline.getPath().push(point);
            });

            return leg;
          });
          /*
          *render all stop based on stop api
          *
          * */
          stop
            .filter(point => (point.plan_id === vehicleId))
            .sort((current, next) => current.seq - next.seq)
            .map((point, stopIndex) => {
              const params = {
                color,
                vehicleInfo,
                plan,
                stopIndex,
                stopPoint: point,
              };
              const [filteredPlan] = plan.legs.filter(planItem => planItem.stop_id === point.client_stop_id);
              if (filteredPlan) {
                params.filteredPlan = filteredPlan;
              }
              if (stopIndex === 0) {
                this.mapSetHomeMarker(params);
              }
              const marker = this.mapSetMarker(params);
              if (stopIndex === 0) {
                const labelWindow = infoWindow(marker, {
                  content: plan.client_vehicle_id,
                  color,
                  vehicleInfo,
                  plan,
                });
                labelWindow.planId = plan.id;
                this.setOfLabel.push(labelWindow);
              }
              /**
               * add marker of route to array
               */
              childMarker.push(marker);

              return point;
            });
        }
        /**
         * array of all marker by order of route
         */
        this.setOfMarkers.push(childMarker);
        addEvent(polyline, 'click', (e) => {
          this.props.selectStop(false);
          this.props.selectPlan(plan.id);
          const markerWindow = renderInfoWindow({
            event: () => {
              this.props.setSelectedRoute(index);
            },
          }, ROUTE, plan);
          const position = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          markerWindow.setPosition(position);
          markerWindow.setZIndex(zIndex.moveAndResequence);
          if (markerWindow.planId === undefined) {
            markerWindow.planId = plan.id;
          }
          if (this.markerWindow !== null) {
            this.markerWindow.close();
            this.markerWindow = markerWindow;
          } else {
            this.markerWindow = markerWindow;
          }
          markerWindow.open(map);
          if (!this.props.isShowOrder) {
            this.showOrderOfStop(index);
          }
        });
        polyline.setMap(map);
        borderPolyline.setMap(map);

        return plan;
      });
    }
  };

  mapSetPolyline = (index, props, border) => {
    const map = this.map; //eslint-disable-line
    const { data } = props;
    const plansLenth = data.plans.length;
    this.setOfPathOpacity.push(this.props.isShowTraffic ? 0 : 1);
    const color = ColorHelper.pathColor(index, plansLenth);
    const polyline = renderPolyline([], {
      strokeColor: color,
      strokeWeight: 6,
      strokeOpacity: this.props.isShowTraffic ? 0 : 1,
      zIndex: index,
    });
    addEvent(polyline, 'mouseover', () => {
      border.setOptions({
        strokeOpacity: 1,
        strokeWeight: 15,
        strokeColor: 'white',
      });
      polyline.setOptions({
        strokeOpacity: this.props.isShowTraffic ? 0 : 1,
      });
    });
    addEvent(polyline, 'mouseout', () => {
      border.setOptions({
        strokeColor: 'white',
        strokeWeight: 6,
        strokeOpacity: this.props.isShowTraffic ? 0 : 1,
      });
      polyline.setOptions({
        strokeOpacity: this.props.isShowTraffic ? 0 : 1,
      });
    });
    this.setOfPaths.push(polyline);

    return {
      polyline,
      color,
    };
  }

  mapSetBorderPolyline = () => {
    const map = this.map; //eslint-disable-line
    const borderPolyline = renderPolyline([], {
      strokeColor: 'white',
      strokeWeight: 6,
      strokeOpacity: this.props.isShowTraffic ? 0 : 1,
      zIndex: -3,
    });
    this.setOfBorderPolyline.push(borderPolyline);

    return borderPolyline;
  }


  mapSetMarker = (info) => {
    const {
      color,
      stopPoint,
      filteredPlan,
      stopIndex,
      vehicleInfo,
    } = info;
    const map = this.map // eslint-disable-line
    let marker = null;
    if (this.props.isShowOrder) {
      marker = renderMarker({
        lat: parseFloat(stopPoint.lat),
        lng: parseFloat(stopPoint.lng),
      }, map, {
        icon: {
          path: MARKER,
          fillColor: 'white',
          fillOpacity: 1,
          anchor: new window.google.maps.Point(0, 0),
          scale: 0.2,
          labelOrigin: new window.google.maps.Point(43, 50),
          strokeColor: color,
          strokeWeight: 2,
        },
      });
      marker.setLabel({
        text: (stopIndex + 1).toString(),
        color,
        fontSize: '12px',
      });
    } else {
      marker = renderMarker({
        lat: parseFloat(stopPoint.lat),
        lng: parseFloat(stopPoint.lng),
      }, map, {
        icon: {
          path: BOX,
          fillColor: color,
          fillOpacity: 1,
          anchor: new window.google.maps.Point(0, 0),
          scale: 0.2,
        },
      });
    }

    marker.addListener('click', (e) => {
      this.props.selectStop(false);
      const selectedPlan = this.props.fleet.plans.find(plan => plan.id === stopPoint.plan_id);
      const markerWindow = renderInfoWindow({
        stopPoint,
        event: () => {
          this.props.closeReSequence();
          this.props.startMoveRoute(stopPoint, undefined, selectedPlan);
        },
        filteredPlan,
      }, POINT);
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      if (markerWindow.planId === undefined) {
        markerWindow.planId = selectedPlan.id;
      }
      markerWindow.setPosition(position);
      markerWindow.setZIndex(zIndex.moveAndResequence);
      if (this.markerWindow !== null) {
        this.markerWindow.close();
        this.markerWindow = markerWindow;
      } else {
        this.markerWindow = markerWindow;
      }
      markerWindow.open(map);
    });
    marker.addListener('mouseover', (e) => {
      const markerJob = renderIdJob(stopPoint, vehicleInfo, filteredPlan);
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      markerJob.setPosition(position);
      markerJob.setZIndex(zIndex.hoverWindow);
      markerJob.open(map);
      this.markerJob = markerJob;
    });
    marker.addListener('mouseout', () => {
      this.markerJob.close();
    });

    return marker;
  }

  /**
   *  set home marker based on vehicle API
   */
  mapSetHomeMarker = (info) => {
    const {
      vehicleInfo,
    } = info;
    if (vehicleInfo) {
      const map = this.map // eslint-disable-line
      const home = renderMarker({
        lat: parseFloat(vehicleInfo.lat_start),
        lng: parseFloat(vehicleInfo.lng_start),
      }, map, {
        icon: {
          path: HOME,
          fillColor: 'white',
          fillOpacity: 1,
          anchor: new window.google.maps.Point(0, 0),
          strokeWeight: 1,
          scale: 0.2,
        },
      });

      home.addListener('click', (e) => {
        this.props.selectStop(false);
        const markerWindow = renderInfoWindow({
          stop,
          vehicleInfo,
        }, START);
        const position = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        markerWindow.setPosition(position);
        markerWindow.setZIndex(zIndex.moveAndResequence);
        if (this.markerWindow !== null) {
          this.markerWindow.close();
          this.markerWindow = markerWindow;
        } else {
          this.markerWindow = markerWindow;
        }
        markerWindow.open(map);
      });

      return home;
    }

    return null;
  }


  mapSetUnserved = (props) => {
    const map = this.map; //eslint-disable-line
    const { data, stop } = props;
    const unserved = data && stop && data.unserved && (data.unserved.split(',').map((point) => { //eslint-disable-line
      const [stopPoint] = stop.filter(s => s.client_stop_id === point);
      if (stopPoint) {
        const position = {
          lat: parseFloat(stopPoint.lat),
          lng: parseFloat(stopPoint.lng),
        };
        const errorMarker = renderMarker(position, map, {
          icon: {
            path: ERROR,
            fillColor: '#FF0000',
            fillOpacity: 1,
            anchor: new window.google.maps.Point(0, 0),
            strokeWeight: 0,
            scale: 0.2,
          },
        });
        errorMarker.addListener('click', () => {
          this.props.selectStop(false);
          const markerWindow = renderInfoWindow({
            stop,
            event: () => {
              this.props.closeReSequence();
              const unservedStops = this.props.fleet.unserved.split(',');
              this.props.startMoveRoute(stopPoint, unservedStops);
            },
          }, UNSERVED, stopPoint);
          markerWindow.setPosition(position);
          markerWindow.setZIndex(zIndex.moveAndResequence);
          if (this.markerWindow !== null) {
            this.markerWindow.close();
            this.markerWindow = markerWindow;
          } else {
            this.markerWindow = markerWindow;
          }
          markerWindow.open(map);
        });
      }

      return point;
    }));
  }


  highLightPolyline = (plansLenth, index) => {
    // set order polyline
    if (!this.props.isShowOrder) {
      this.showOrderOfStop(index);
    }

    if (this.lastestPolyline) {
      this.lastestPolyline.setOptions({
        zIndex: index,
      });
      this.setOfPaths[index].setOptions({
        zIndex: plansLenth,
      });
      if (this.props.isShowTraffic) {
        if (this.lastestTraffic) {
          this.lastestTraffic.map((leg) => {
            leg.map((point) => {
              if (Array.isArray(point)) {
                point.map(p => p.setOptions({
                  zIndex: -2,
                }));
              } else {
                point.setOptions({
                  zIndex: -2,
                });
              }

              return point;
            });

            return leg;
          });
        }

        this.setOfTraffic[index].map((leg) => {
          leg.map((point) => {
            if (Array.isArray(point)) {
              point.map(p => p.setOptions({
                zIndex: -1,
              }));
            } else {
              point.setOptions({
                zIndex: -1,
              });
            }

            return point;
          });

          return leg;
        });
        this.lastestTraffic = this.setOfTraffic[index];
      }
      this.lastestPolyline = this.setOfPaths[index];
    }
  }

  showOrderOfStop = (index) => {
    const { data } = this.props;
    const plansLenth = data.plans.length;
    const result = this.activeMarkers.filter(child => child !== undefined);
    const childMarker = this.setOfMarkers[index];
    const color = ColorHelper.pathColor(index, plansLenth);
    if (result.length === 0) {
      this.activeMarkers[index] = childMarker;
      this.activeMarkers[index].map((marker, itemIndex) => {
        marker.setIcon({
          path: MARKER,
          fillColor: 'white',
          fillOpacity: 1,
          anchor: new window.google.maps.Point(0, 0),
          scale: 0.2,
          labelOrigin: new window.google.maps.Point(43, 50),
          strokeColor: color,
          strokeWeight: 2,
        });
        marker.setLabel({
          text: (itemIndex + 1).toString(),
          color,
          fontSize: '12px',
        });

        return marker;
      });
    } else {
      this.activeMarkers = this.activeMarkers.map((markers, markerIndex) => {
        if (markers) {
          markers.map((marker) => {
            marker.setIcon({
              path: BOX,
              fillColor: ColorHelper.pathColor(markerIndex, plansLenth),
              fillOpacity: 1,
              anchor: new window.google.maps.Point(0, 0),
              scale: 0.2,
            });
            marker.setLabel(null);

            return marker;
          });
        }

        return undefined;
      });
      this.activeMarkers[index] = childMarker;
      this.activeMarkers[index].map((marker, itemIndex) => {
        marker.setIcon({
          path: MARKER,
          fillColor: 'white',
          fillOpacity: 1,
          anchor: new window.google.maps.Point(0, 0),
          scale: 0.2,
          labelOrigin: new window.google.maps.Point(43, 50),
          strokeColor: color,
          strokeWeight: 2,
        });
        marker.setLabel({
          text: (itemIndex + 1).toString(),
          color,
          fontSize: '12px',
        });

        return marker;
      });
    }
  }

  changeColorPolyline = () => {
    this.props.fleet.plans.map((plan, indexPlan) => { //eslint-disable-line
      const hiddenPlan = this.props.hiddenPlans.indexOf(plan.id);
      if (hiddenPlan !== -1) {
        this.setOfTraffic[indexPlan].map((leg) => {//eslint-disable-line
          leg.map((point) => {
            if (Array.isArray(point)) {
              point.map(p => p.setVisible(false));
            } else {
              point.setVisible(false);
            }

            return point;
          });
        });
        this.setOfPaths[indexPlan].setVisible(false);
        this.setOfBorderPolyline[indexPlan].setVisible(false);
      } else {
        this.setOfTraffic[indexPlan].map((leg) => {//eslint-disable-line
          leg.map((point) => {
            if (Array.isArray(point)) {
              point.map((p) => {
                p.setVisible(this.props.isShowTraffic);
                const strokeColor = showCorrectTrafficColor(p.strokeColor);
                p.setOptions({
                  strokeColor,
                });

                return p;
              });
            } else {
              point.setVisible(this.props.isShowTraffic);
              const strokeColor = showCorrectTrafficColor(point.strokeColor);
              point.setOptions({
                strokeColor,
              });
            }

            return point;
          });
        });
        this.setOfPaths[indexPlan].setVisible(true);
        this.setOfBorderPolyline[indexPlan].setVisible(true);
        this.setOfPaths[indexPlan].setOptions({
          strokeOpacity: this.props.isShowTraffic ? 0 : 1,
        });
        this.setOfBorderPolyline[indexPlan].setOptions({
          strokeOpacity: this.props.isShowTraffic ? 0 : 1,
        });
      }
    });
  }

  togglePolyline = (nextProps) => {
    nextProps.fleet.plans.map((plan, indexPlan) => { //eslint-disable-line
      const hiddenPlan = nextProps.hiddenPlans.indexOf(plan.id);
      if (hiddenPlan !== -1) {
        this.setOfMarkers[indexPlan].map((marker) => { //eslint-disable-line
          marker.setVisible(false);
        });
        this.setOfPaths[indexPlan].setVisible(false);
        this.setOfBorderPolyline[indexPlan].setVisible(false);
        if (this.props.isShowTraffic) {
          this.setOfTraffic[indexPlan].map((leg) => { //eslint-disable-line
            leg.map((point) => { //eslint-disable-line
              if (Array.isArray(point)) {
                point.map(p => p.setVisible(false));
              } else {
                point.setVisible(false);
              }
            });
          });
        }
      } else {
        this.setOfMarkers[indexPlan].map((marker) => { //eslint-disable-line
          marker.setVisible(true);
        });
        this.setOfPaths[indexPlan].setVisible(true);
        this.setOfBorderPolyline[indexPlan].setVisible(true);
        this.setOfPaths[indexPlan].setOptions({
          strokeOpacity: this.props.isShowTraffic ? 0 : 1,
        });
        this.setOfBorderPolyline[indexPlan].setOptions({
          strokeOpacity: this.props.isShowTraffic ? 0 : 1,
        });
        if (this.props.isShowTraffic) {
          this.setOfPaths[indexPlan].setVisible(true);
          this.setOfBorderPolyline[indexPlan].setVisible(true);
          this.setOfTraffic[indexPlan].map((leg) => { //eslint-disable-line
            leg.map((point) => { //eslint-disable-line
              if (Array.isArray(point)) {
                point.map(p => p.setVisible(true));
              } else {
                point.setVisible(true);
              }
            });
          });
        }
      }
    });
  }

  renderUnserved = (stopPoint) => {
    if (stopPoint && isNumber(stopPoint)) {
      const [stop] = this.props.stop.filter(s => s.id === stopPoint);
      const map = this.map; //eslint-disable-line
      const position = {
        lat: parseFloat(stop.lat),
        lng: parseFloat(stop.lng),
      };
      const markerWindow = renderInfoWindow({
        stop,
        event: () => {
          this.props.selectStop(false);
          this.props.closeReSequence();
          const unservedStops = this.props.fleet.unserved.split(',');
          this.props.startMoveRoute(stop, unservedStops);
        },
      }, UNSERVED, stop);
      markerWindow.setPosition(position);
      markerWindow.setZIndex(zIndex.moveAndResequence);
      window.google.maps.event.addListener(markerWindow, 'closeclick', () => {
        this.props.selectStop(false);
      });
      if (this.markerWindow !== null) {
        this.markerWindow.close();
        this.markerWindow = markerWindow;
      } else {
        this.markerWindow = markerWindow;
      }
      markerWindow.open(map);
    }
  }

  render() {
    return (
      <div style={{
        width: '100%',
        height: '100%',
      }}
      >
        <div
          id="map"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet.data,
  selectedPlanId: state.fleet.selectedPlanId,
  selectedStopId: state.stops.selectedStopId,
  data: state.fleet.data,
  stop: state.stops.data,
  hiddenPlans: state.fleet.hiddenPlans,
  vehicle: state.vehicles.data,
});

const mapDispatchToProps = dispatch => ({
  selectPlan: planId => dispatch(selectPlan(planId)),
  startMoveRoute: (stop, unservedStops, fromPlan) => dispatch(startMoveRoute(stop, unservedStops, fromPlan)),
  selectStop: stopId => dispatch(selectStop(stopId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('upload')(Map));
Map.propTypes = {
  fleet: PropTypes.any,
  data: PropTypes.any,
  stop: PropTypes.array,
  vehicle: PropTypes.array,
  selectedPlanId: PropTypes.any,
  selectPlan: PropTypes.any,
  setSelectedRoute: PropTypes.func,
  startMoveRoute: PropTypes.func,
  selectedStopId: PropTypes.any,
  hiddenPlans: PropTypes.array,
  closeReSequence: PropTypes.func,
  mapRef: PropTypes.func,

  isShowTraffic: PropTypes.bool,
  isShowOrder: PropTypes.bool,
  isShowLabel: PropTypes.bool,
  selectStop: PropTypes.func,
};
