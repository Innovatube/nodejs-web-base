import React from 'react';
import PropTypes from 'prop-types';
import { handleZoomIn } from '../Map/map';

const style = {
  width: 34,
  height: 25,
  background: '#062A30',
  color: 'white',
  marginBottom: 5,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 3,
};

class ZoomIn extends React.Component {
  render() {
    return (
      <div
        style={style}
        onClick={() => {
          handleZoomIn(this.props.map);
        }}
      ><i className="fas fa-plus" />
      </div>
    );
  }
}

export default ZoomIn;
ZoomIn.propTypes = {
  map: PropTypes.any,
};
