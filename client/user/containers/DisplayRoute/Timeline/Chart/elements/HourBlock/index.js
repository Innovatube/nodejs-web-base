import React from 'react';
import PropTypes from 'prop-types';
import constant from '../../../helper/constant';

class HourBlock extends React.Component {
  backgroundColor() {
    const { isHighlight, isUnserved, isHeader } = this.props;

    if (isHighlight) return '#3D464C';
    if (isUnserved) return '#571f24';
    if (isHeader) return 'black';

    return '#2c3337';
  }

  borderColor() {
    const { isHighlight, isUnserved, isHeader } = this.props;

    if (isHighlight) return '#3D464C';
    if (isUnserved) return '#571f24';
    if (isHeader) return 'black';

    return '#3D464C';
  }

  render() {
    const { index, isHeader } = this.props;

    return (
      <React.Fragment>
        <div
          style={{
            backgroundColor: this.backgroundColor(),
            width: constant.hourWidth,
            height: isHeader ? constant.headerHeight : constant.itemHeight,
            position: 'absolute',
            left: constant.hourWidth * index,
            top: 0,
            borderLeftWidth: 2,
            borderLeftStyle: 'solid',
            borderLeftColor: this.borderColor(),
          }}
        />
      </React.Fragment>
    );
  }
}

export default HourBlock;
HourBlock.propTypes = {
  index: PropTypes.number,
  isHeader: PropTypes.bool,
  isHighlight: PropTypes.bool,
  isUnserved: PropTypes.bool,
};
