import React from 'react';
import PropTypes from 'prop-types';
import Helper from '../../../helper';
import constant from '../../../helper/constant';

class HomeLabel extends React.Component {
  styles() {
    const { time, timeStart, isHidden } = this.props;

    return {
      container: {
        width: 26,
        height: 26,
        position: 'absolute',
        left: Helper.time.leftPosition(time, timeStart) - 13,
        top: (constant.itemHeight - 26) / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid',
        borderRadius: 15,
        opacity: isHidden ? 0.2 : 1,
      },
      icon: {
        color: 'white',
      },
    };
  }

  render() {
    return (
      <div style={this.styles().container}>
        <i
          className="fas fa-home"
          style={this.styles().icon}
        />
      </div>
    );
  }
}

export default HomeLabel;
HomeLabel.propTypes = {
  time: PropTypes.object,
  timeStart: PropTypes.object,
  isHidden: PropTypes.bool,
};
