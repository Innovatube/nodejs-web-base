import React from 'react';
import PropTypes from 'prop-types';
import {
  ListGroupItem, Collapse,
} from 'reactstrap';
import moment from 'moment-timezone';
import _ from 'lodash';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { selectPlan } from '../../../../actions/fleet';
import Stepper from './Stepper';
import { format } from '../../../util/date';
import { convertMeterToKilometer } from '../../../util/distance';
import Box from '../../../icon/box';
import { ProgressBar } from '../../../components/index';

const styles = {
  progressBarContainer: {
    height: 10,
    minWidth: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressBarLeftTitle: {
    fontSize: 10,
    width: 35,
    minWidth: 35,
  },
  progressBarRightTitle: {
    width: '65%',
    fontSize: 10,
    paddingRight: 5,
  },
  progressBar: {
    marginLeft: 5,
    marginRight: 5,
    flex: '1 1 80px',
    width: 80,
    maxWidth: 80,
  },
  hiddenPlans: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#062A30',
    opacity: '0.6',
    borderRadius: 5,
    zIndex: 1,
  },
  header: {
    width: '100%',
    maxWidth: '100%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
};

class RouteItem extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  getCustomerName = (leg) => {
    const { stop } = this.props;
    if (leg && stop) {
      const stopOfLeg = stop.filter(item => (item.client_stop_id === leg.stop_id));
      const customerName = stopOfLeg.length > 0 ? stopOfLeg[0].name : '';

      return customerName;
    }

    return '';
  }

  getSpeed = (route) => {
    const distance = convertMeterToKilometer(route.total_distance);
    const time = route.total_eta / 60;

    return Math.round(distance / time);
  }

  getServiceTime = (time) => {
    const h = Math.floor(time / 60);
    const b = (time / 60) - h;
    const a = Math.floor(b * 60);
    let m = a;
    if (a < 10) {
      m = `0${a}`;
    } else {
      m = a;
    }
    const times = `${h}:${m}`;

    return times;
  }

  getNumOfDrops = () => {
    const { route } = this.props;
    let numOfDrops = 0;
    if (route && route.legs) {
      route.legs.map((item, index) => {
        if (index === 0) {
          numOfDrops++;

          return item;
        } if (index === route.legs.length - 1) {
          if (item.stop_id === route.client_vehicle_id) {
            return item;
          }
          numOfDrops++;

          return item;
        }
        numOfDrops++;

        return item;
      });
    }

    return numOfDrops;
  }

  toggle() {
    const { selectedPlanId, route: { id } } = this.props;
    if (selectedPlanId === id) {
      this.props.selectPlan(false);
    } else {
      this.props.selectPlan(id);
    }
  }


  render() {
    const {
      index, route, plans, ColorHelper, stop, vehicles,
    } = this.props;
    const color = ColorHelper.pathColor(index, plans.length);
    const start = moment(format(route.time_start), 'HH:mm');
    const end = moment.utc(format(route.time_end), 'HH:mm');
    if (end.isBefore(start)) end.add(1, 'day');
    const d = moment.duration(end.diff(start));
    const time = moment.utc(+d).format('H:mm');
    const { t } = this.props;
    const vehicle = _.find(vehicles, { client_vehicle_id: route.client_vehicle_id });

    return (
      <React.Fragment>
        {
          (route) && (
            <ListGroupItem
              className="nexty__map--item"
              key={index}
              style={{
                height: '33.33%',
                position: 'relative',
              }}
              onClick={this.toggle}
            >
              {
                this.props.hiddenPlans
                && this.props.hiddenPlans.findIndex(item => item === route.id) !== -1 && (
                <div
                  style={styles.hiddenPlans}
                />
                )
              }
              <div className="sidebar-item">
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '100%',
                }}
                >
                  <h5 style={styles.header}>{route.client_vehicle_id}</h5>
                </div>
                <p className="fs-14"><Box style={{
                  width: 20,
                  height: 20,
                  fill: color,
                  paddingRight: 5,
                }}
                />{this.getNumOfDrops()} {t('drop')} ({t('service_time')} {this.getServiceTime(route.total_service_time)} {t('hour')})
                </p>
                <p className="fs-14"><i
                  className="far fa-clock w-20"
                  style={{
                    color,
                    paddingRight: 5,
                  }}
                />{`${format(route.time_start)} - ${format(route.time_end)}`} ( {t('duration')} {time} {t('hour')})
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
                >
                  <p className="fs-14"><i
                    className="fas fa-truck w-20"
                    style={{
                      color,
                      paddingRight: 5,
                    }}
                  />{`${convertMeterToKilometer(route.total_distance)} ${t('KM')}`}
                  </p>
                  <p className="fs-14"><i
                    style={{
                      color,
                    }}
                    className="fas fa-tachometer-alt w-20"
                  /> {`${this.getSpeed(route)} ${t('KM/HR')}`}
                  </p>
                </div>
                {
                  vehicle && vehicle.volume !== undefined && vehicle.volume !== null && (
                    <ProgressBar
                      percentage={route.percentage_volume}
                      left={t('volume')}
                      right={`${(route.total_volume).toFixed(1)} / ${vehicle.volume.toFixed(1)}`}
                      containerStyle={styles.progressBarContainer}
                      leftTitleStyle={styles.progressBarLeftTitle}
                      rightTitleStyle={styles.progressBarRightTitle}
                      progressStyle={styles.progressBar}
                    />
                  )
                }
                {
                  vehicle && vehicle.weight !== undefined && vehicle.weight !== null && (
                    <ProgressBar
                      percentage={route.percentage_weight}
                      left={t('weight')}
                      right={`${(route.total_weight).toFixed(1)} / ${vehicle.weight.toFixed(1)}`}
                      containerStyle={styles.progressBarContainer}
                      leftTitleStyle={styles.progressBarLeftTitle}
                      rightTitleStyle={styles.progressBarRightTitle}
                      progressStyle={styles.progressBar}
                    />
                  )
                }
              </div>
              <Collapse isOpen={this.props.selectedPlanId === this.props.route.id}>
                <Stepper
                  route={route}
                  stop={stop}
                  getCustomerName={this.getCustomerName}
                  color={color}
                />
              </Collapse>
            </ListGroupItem>
          )
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  selectedPlanId: state.fleet.selectedPlanId,
  hiddenPlans: state.fleet.hiddenPlans,
});

const mapDispatchToProps = dispatch => ({
  selectPlan: fleet => dispatch(selectPlan(fleet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('sidebar')(RouteItem));


RouteItem.propTypes = {
  vehicles: PropTypes.array,
  route: PropTypes.object,
  index: PropTypes.number,
  plans: PropTypes.any,
  ColorHelper: PropTypes.object,
  stop: PropTypes.array,
  selectedPlanId: PropTypes.any,
  selectPlan: PropTypes.func,
  hiddenPlans: PropTypes.array,
  t: PropTypes.func,
};
