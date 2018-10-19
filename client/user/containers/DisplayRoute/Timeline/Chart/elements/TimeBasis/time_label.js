import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helper from '../../../helper';
import constant from '../../../helper/constant';

class TimeLabel extends React.Component {
  styles() {
    const { timeStart, time } = this.props;

    return {
      container: {
        width: 40,
        height: 26,
        position: 'absolute',
        left: Helper.time.leftPosition(time, timeStart) - 20,
        top: (constant.headerHeight - 26) / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        color: 'gray',
        fontSize: 12,
        backgroundColor: '#062A30',
      },
    };
  }

  render() {
    return (
      <div style={this.styles().container}>
        {moment(this.props.time).format('HH:mm')}
      </div>
    );
  }
}

export default TimeLabel;
TimeLabel.propTypes = {
  time: PropTypes.object,
  timeStart: PropTypes.object,
};
