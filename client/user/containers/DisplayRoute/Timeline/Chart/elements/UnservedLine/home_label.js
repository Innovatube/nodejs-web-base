import React from 'react';
import PropTypes from 'prop-types';
import Helper from '../../../helper';
import constant from '../../../helper/constant';

class HomeLabel extends React.Component {
  styles() {
    const { time, timeStart } = this.props;

    return {
      container: {
        width: 26,
        height: 26,
        marginLeft: Helper.time.leftPosition(time, timeStart) - 13,
        marginTop: (constant.itemHeight - 26) / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 13,
      },
      icon: {
        color: 'white',
        fontSize: 15,
      },
    };
  }

  render() {
    return (
      <div style={this.styles().container}>
        <i
          className="fas fa-question"
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
};
