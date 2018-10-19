import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';

import { ProgressBar } from '../../../../components/index';
import Helper from '../../../../../helpers';
import { selectStop } from '../../../../../actions/moveRoute';

const styles = {
  container: {
    border: '1px solid lightgrey',
    borderRadius: 5,
    padding: 8,
    background: 'white',
    wordWrap: 'break-word',
    color: 'black',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  legIndex: color => ({
    border: `2px solid ${color}`,
    borderRadius: '50%',
    width: 25,
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    color,
  }),
  note: {
    width: 15,
    paddingRight: 5,
    fontSize: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
};

class Stop extends React.Component {
  stopInfo() {
    const { stopId, stops } = this.props;

    return stops.find(stop => stop.client_stop_id === stopId);
  }

  vehicle() {
    const { vehicles } = this.props;
    const plan = this.plan();

    return vehicles.find(vehicle => vehicle.client_vehicle_id === plan.client_vehicle_id);
  }

  unservedIndex() {
    const { fleet } = this.props;
    const comps = fleet.unserved.split(',');

    return comps.findIndex(stopId => this.stopInfo().client_stop_id === stopId) + 1;
  }

  plan() {
    const { fleet, planId } = this.props;

    return fleet.plans.find(plan => plan.id === planId);
  }

  render() {
    const {
      index,
      stopId,
      t,
    } = this.props;
    const stop = this.stopInfo();
    const plan = this.plan();
    const color = Helper.color.planColorWithId(this.props.state, stop.plan_id);

    return (
      <div>
        {stop && (
          <Draggable draggableId={stopId} index={index}>
            {provided => (
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                <div
                  style={{
                    ...styles.container,
                    ...(this.props.selectedStop && this.props.selectedStop.id === stop.id) ? {
                      boxShadow: `0px 0px 5px 5px ${color}`,
                    } : {},
                  }}
                  onClick={() => this.props.selectStop(stop)}
                >
                  <span style={styles.legIndex(color)}>
                    {stop.seq || this.unservedIndex()}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 'auto',
                    }}
                    id={`dragAndDrop-${stop.id}`}
                  >
                    <h4 className="resequence__p" style={{ maxWidth: 130 }}>{stop.client_stop_id}</h4>
                    <p className="resequence__p" style={{ maxWidth: 130 }}>{stop.name}</p>
                    <ProgressBar
                      percentage={plan && stop && stop.volume && this.vehicle() && (stop.volume / this.vehicle().volume) * 100}
                      left={t('v')}
                      right={stop.volume && stop.volume.toFixed(1)}
                      rightTitleStyle={{
                        width: 'auto',
                      }}
                    />
                    <ProgressBar
                      percentage={plan && stop && stop.weight && this.vehicle() && (stop.weight / this.vehicle().weight) * 100}
                      left={t('w')}
                      right={stop.weight && stop.weight.toFixed(1)}
                      rightTitleStyle={{
                        width: 'auto',
                      }}
                    />
                    <UncontrolledTooltip target={`dragAndDrop-${stop.id}`}>
                      {t('drag_and_drop')}
                    </UncontrolledTooltip>
                  </div>
                </div>
              </div>
            )}
          </Draggable>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  stops: state.stops.data,
  fleet: state.fleet.data,
  vehicles: state.vehicles.data,
  selectedStop: state.moveRoute.selectedStop,
  state,
});

const mapDispatchToProps = dispatch => ({
  selectStop: stop => dispatch(selectStop(stop)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('moveModel')(Stop));
Stop.propTypes = {
  selectedStop: PropTypes.string,
  stops: PropTypes.array,
  vehicles: PropTypes.array,
  index: PropTypes.number,
  planId: PropTypes.number,
  stopId: PropTypes.string,
  fleet: PropTypes.object,
  state: PropTypes.any,
  selectStop: PropTypes.func,
  t: PropTypes.func,
};
