import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import constant from '../../../helper/constant';
import { HourBlock } from '..';
import HomeLabel from './home_label';
import StopLabel from './stop_label';

const styles = {
  container: {
    backgroundColor: 'black',
    position: 'relative',
    height: constant.itemHeight,
  },
  line: {
    position: 'absolute',
    height: constant.itemHeight,
    display: 'flex',
    alignItem: 'center',
  },
};

class TimelineLine extends React.Component {
  stops() {
    const { fleet, stops } = this.props;
    const comps = fleet.unserved && fleet.unserved.split(',');
    const unservedStops = comps && comps
      .map(stopId => stops.find(s => s.client_stop_id === stopId))
      .filter(stop => stop !== undefined);

    return unservedStops;
  }

  renderHour() {
    const { minTime, maxTime } = this.props;
    const results = [];
    let index = 0;
    for (let time = minTime.clone(); time.isBefore(maxTime); time = time.add(60, 'minutes')) {
      results.push(<HourBlock index={index} key={index} isUnserved />);
      index++;
    }

    return results;
  }

  render() {
    const { startTime, minTime } = this.props;
    const stops = this.stops();

    return (
      <div style={styles.container}>
        <div style={{ position: 'relative' }}>
          {this.renderHour()}
          <div style={styles.line}>
            <HomeLabel time={startTime} timeStart={minTime} />
            {stops && stops.map(stop => (
              <StopLabel stop={stop} key={stop.id} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet.data,
  stops: state.stops.data,
  minTime: state.fleet.time.min,
  maxTime: state.fleet.time.max,
  startTime: state.fleet.time.start,
});

export default connect(mapStateToProps)(TimelineLine);
TimelineLine.propTypes = {
  fleet: PropTypes.object,
  stops: PropTypes.array,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
  startTime: PropTypes.object,
};
