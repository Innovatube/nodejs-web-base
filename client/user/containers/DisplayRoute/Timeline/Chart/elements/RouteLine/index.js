import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helper from '../../../helper';
import constant from '../../../helper/constant';

class RouteLine extends React.Component {
  styles() {
    const {
      plan,
      timeStart,
      color,
      isHidden,
    } = this.props;
    const { legs } = plan;
    const allPoints = [
      ...legs.map(leg => leg.arrive_time),
      plan.time_start,
      plan.time_end,
    ].map(item => moment(item));
    const startPosition = Helper.time.leftPosition(moment.min(allPoints), timeStart);
    const endPosition = Helper.time.leftPosition(moment.max(allPoints), timeStart);

    return {
      container: {
        width: endPosition - startPosition,
        height: 4,
        position: 'absolute',
        left: startPosition,
        top: (constant.itemHeight - 4) / 2,
        backgroundColor: color,
        opacity: isHidden ? 0.2 : 1,
      },
    };
  }

  render() {
    return (
      <div style={this.styles().container} />
    );
  }
}

export default RouteLine;
RouteLine.propTypes = {
  plan: PropTypes.object,
  timeStart: PropTypes.object,
  color: PropTypes.string,
  isHidden: PropTypes.bool,
};
