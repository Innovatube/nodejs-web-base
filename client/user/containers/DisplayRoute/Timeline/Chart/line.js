import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import constant from '../helper/constant';
import {
  HourBlock,
  HomeLabel,
  StopLabel,
  RouteLine,
} from './elements';
import { selectPlan } from '../../../../../actions/fleet';

const styles = {
  container: {
    backgroundColor: 'black',
    position: 'relative',
    height: constant.itemHeight,
  },
};

class TimelineLine extends React.Component {
  isHidden() {
    const { hiddenPlans, plan } = this.props;

    return hiddenPlans.some(planId => planId === plan.id);
  }

  renderHour() {
    const {
      minTime,
      maxTime,
      selectedPlanId,
      plan,
    } = this.props;
    const results = [];
    let index = 0;
    for (let time = minTime.clone(); time.isBefore(maxTime); time = time.add(60, 'minutes')) {
      results.push(<HourBlock index={index} key={index} isHighlight={selectedPlanId === plan.id} />);
      index++;
    }

    return results;
  }

  renderStop() {
    const {
      minTime,
      plan,
      stops,
      color,
    } = this.props;
    if (plan) {
      return plan.legs
        .filter(leg => leg.arrive_time !== plan.time_end)
        .map(leg => (
          leg && leg.stop_id !== plan.client_vehicle_id
          && (
          <StopLabel
            key={leg.id}
            stops={stops}
            leg={leg}
            timeStart={minTime}
            color={color}
            isHidden={this.isHidden()}
          />
          )
        ));
    }

    return null;
  }

  render() {
    const {
      plan,
      minTime,
      color,
    } = this.props;

    return (
      <div
        style={styles.container}
        onClick={() => this.props.selectPlan(plan.id)}
      >
        <div style={{ position: 'relative' }}>
          {this.renderHour()}
          <RouteLine timeStart={minTime} plan={plan} color={color} isHidden={this.isHidden()} />
          {this.renderStop()}
          <HomeLabel timeStart={minTime} time={moment(plan.time_start)} isHidden={this.isHidden()} />
          {
            plan && plan.client_vehicle_id === plan.legs[plan.legs.length - 1].stop_id
            && <HomeLabel timeStart={minTime} time={moment(plan.time_end)} isHidden={this.isHidden()} />
          }

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  stops: state.stops.data,
  selectedPlanId: state.fleet.selectedPlanId,
  hiddenPlans: state.fleet.hiddenPlans,
  maxTime: state.fleet.time.max,
  minTime: state.fleet.time.min,
});

const mapDispatchToProps = dispatch => ({
  selectPlan: planId => dispatch(selectPlan(planId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineLine);
TimelineLine.propTypes = {
  plan: PropTypes.object,
  color: PropTypes.string,

  stops: PropTypes.array,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
  selectedPlanId: PropTypes.any,
  hiddenPlans: PropTypes.array,

  selectPlan: PropTypes.func,
};
