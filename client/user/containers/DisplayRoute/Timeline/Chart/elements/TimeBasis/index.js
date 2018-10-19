import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import constant from '../../../helper/constant';
import { HourBlock } from '../index';
import TimeLabel from './time_label';

class TimeBasis extends React.Component {
  renderHour() {
    const { timeStart, timeEnd } = this.props;
    const results = [];
    let index = 0;
    for (let time = timeStart.clone(); time.isBefore(timeEnd); time = time.add(60, 'minutes')) {
      results.push(<HourBlock index={index} key={index} isHeader />);
      index++;
    }

    index = 0;
    for (let time = timeStart.clone(); time.isBefore(timeEnd); time = time.add(60, 'minutes')) {
      if (index > 0) {
        results.push(<TimeLabel timeStart={timeStart} time={time.clone()} key={time.format('LLLL')} />);
      }
      index++;
    }

    return results;
  }

  render() {
    return (
      <div style={{ backgroundColor: 'black', position: 'relative', height: constant.headerHeight }}>
        <div style={{ position: 'relative' }}>
          {this.renderHour()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  timeStart: state.fleet.time.min,
  timeEnd: state.fleet.time.max,
});

export default connect(mapStateToProps)(TimeBasis);
TimeBasis.propTypes = {
  timeStart: PropTypes.object,
  timeEnd: PropTypes.object,
};
