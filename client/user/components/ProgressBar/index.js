import LinearProgress from 'material-ui/LinearProgress';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapperDefaultStyle, progressDefaultStyle } from './style';
import renderColor from '../../util/color';

const style = {
  container: isHidden => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    opacity: isHidden ? 0.2 : 1,
  }),
  title: {
    width: 20,
    paddingRight: 5,
    fontSize: 10,
    margin: 0,
  },
};

class ProgressBar extends React.Component {
  render() {
    const {
      leftTitleStyle, rightTitleStyle, containerStyle, wrapperStyle, progressStyle, percentage, left, right, isHidden,
    } = this.props;

    return (
      <div style={{
        ...style.container(isHidden),
        ...containerStyle,
      }}
      >
        <p
          style={{
            ...style.title,
            ...leftTitleStyle,
          }}
        >{left}
        </p>
        <div style={{
          ...wrapperDefaultStyle,
          ...wrapperStyle,
        }}
        >
          <LinearProgress
            mode="determinate"
            value={percentage}
            style={{
              ...progressDefaultStyle,
              ...progressStyle,
            }}
            color={renderColor(percentage)}
          />
          <p
            style={{
              ...style.title,
              ...rightTitleStyle,
            }}
          >{right}
          </p>
        </div>
      </div>
    );
  }
}

export default ProgressBar;
ProgressBar.propTypes = {
  wrapperStyle: PropTypes.object,
  progressStyle: PropTypes.object,
  percentage: PropTypes.number,
  left: PropTypes.string,
  right: PropTypes.string,
  containerStyle: PropTypes.object,
  isHidden: PropTypes.any,
  rightTitleStyle: PropTypes.object,
  leftTitleStyle: PropTypes.object,
};
